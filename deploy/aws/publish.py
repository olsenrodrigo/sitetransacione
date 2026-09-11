#!/usr/bin/env python3
"""Publish an already validated static build to an existing S3/CloudFront site.

Does not provision infrastructure, modify DNS, or deploy the separate leads API.
AWS CLI credentials are used without copying them into files or command arguments.
"""
import argparse
import datetime
import json
import os
from pathlib import Path
import re
import subprocess


def aws(*args):
    result = subprocess.run(
        ["aws", *args, "--no-cli-pager", "--output", "json"],
        check=True, capture_output=True, text=True,
        env={**os.environ, "AWS_DEFAULT_REGION": "us-east-1"},
    )
    return json.loads(result.stdout) if result.stdout.strip() else {}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--account", required=True)
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--distribution", required=True)
    parser.add_argument("--function", required=True)
    args = parser.parse_args()
    build = Path(".build/aws")
    public = build / "public"
    router = (build / "router.js").read_text()
    subprocess.run(["npx", "tsx", "script/verify-build.ts", str(build)], check=True)
    if aws("sts", "get-caller-identity")["Account"] != args.account:
        raise RuntimeError("AWS account does not match --account")
    distribution = aws("cloudfront", "get-distribution-config", "--id", args.distribution)
    config = distribution["DistributionConfig"]
    origin = next(o for o in config["Origins"]["Items"] if o["Id"] == config["DefaultCacheBehavior"]["TargetOriginId"])
    if origin["DomainName"] != f"{args.bucket}.s3.us-east-1.amazonaws.com" or origin.get("OriginPath") != "/public":
        raise RuntimeError("Unexpected origin: publication refused")
    function_arn = f"arn:aws:cloudfront::{args.account}:function/{args.function}"
    if not any(f["FunctionARN"] == function_arn and f["EventType"] == "viewer-request" for f in config["DefaultCacheBehavior"]["FunctionAssociations"]["Items"]):
        raise RuntimeError("Router is not attached to this distribution")

    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    checkpoint = Path(".dados/aws-publications") / timestamp
    checkpoint.mkdir(parents=True)
    (checkpoint / "distribution-before.json").write_text(json.dumps(distribution, indent=2))
    live = aws("cloudfront", "get-function", "--name", args.function, "--stage", "LIVE", str(checkpoint / "router-before.js"))
    (checkpoint / "function-before.json").write_text(json.dumps(live, indent=2))
    objects = aws("s3api", "list-objects-v2", "--bucket", args.bucket, "--prefix", "public/")
    (checkpoint / "objects-before.json").write_text(json.dumps(objects, indent=2))
    keys = {obj["Key"] for obj in objects.get("Contents", [])}
    # Keep old, hashed assets routable for cached HTML and already-open tabs.
    match = re.search(r"var files = (\[.*?\]);", router)
    if not match:
        raise RuntimeError("Missing build file manifest")
    files = set(json.loads(match[1]))
    files.update("/" + key.removeprefix("public/") for key in keys if key.startswith("public/assets/") and ".." not in key)
    router = router[:match.start(1)] + json.dumps(sorted(files), separators=(",", ":")) + router[match.end(1):]
    if len(router.encode()) > 10000:
        raise RuntimeError("Router exceeds CloudFront 10 KB limit")
    ready = checkpoint / "router.js"
    ready.write_text(router)
    destination = f"s3://{args.bucket}/public"
    html_cache = "public,max-age=0,s-maxage=300,stale-while-revalidate=60,stale-if-error=86400"
    print(f"Checkpoint: {checkpoint}; publishing static assets", flush=True)
    aws("s3", "sync", str(public / "assets"), destination + "/assets/", "--cache-control", "public,max-age=31536000,immutable", "--only-show-errors")
    aws("s3", "sync", str(public), destination + "/", "--exclude", "assets/*", "--exclude", "*.html", "--exclude", "suporte-acesso.js", "--cache-control", "public,max-age=3600", "--only-show-errors")
    aws("s3", "cp", str(public / "suporte-acesso.js"), destination + "/suporte-acesso.js", "--cache-control", "no-cache", "--only-show-errors")
    # New routes must exist in S3 before the router begins accepting them.
    for html in public.rglob("*.html"):
        relative = html.relative_to(public).as_posix()
        if "public/" + relative not in keys:
            aws("s3", "cp", str(html), destination + "/" + relative, "--content-type", "text/html; charset=utf-8", "--cache-control", html_cache, "--only-show-errors")

    dev = aws("cloudfront", "describe-function", "--name", args.function, "--stage", "DEVELOPMENT")
    updated = aws("cloudfront", "update-function", "--name", args.function, "--if-match", dev["ETag"], "--function-config", json.dumps(dev["FunctionSummary"]["FunctionConfig"]), "--function-code", "fileb://" + str(ready.resolve()))
    event = {"version": "1.0", "context": {"eventType": "viewer-request"}, "viewer": {"ip": "192.0.2.1"}, "request": {"method": "GET", "uri": "/precatorios", "headers": {}, "cookies": {}, "querystring": {}}}
    event_file = checkpoint / "test-event.json"
    event_file.write_text(json.dumps(event))
    tested = aws("cloudfront", "test-function", "--name", args.function, "--if-match", updated["ETag"], "--stage", "DEVELOPMENT", "--event-object", "fileb://" + str(event_file.resolve()))
    (checkpoint / "function-test.json").write_text(json.dumps(tested, indent=2))
    test = tested["TestResult"]
    if test.get("FunctionErrorMessage") or json.loads(test["FunctionOutput"])["request"]["uri"] != "/precatorios/index.html":
        raise RuntimeError("CloudFront router test failed")
    published = aws("cloudfront", "publish-function", "--name", args.function, "--if-match", updated["ETag"])
    (checkpoint / "function-published.json").write_text(json.dumps(published, indent=2))
    print("Router published; uploading HTML", flush=True)
    aws("s3", "cp", str(public), destination + "/", "--recursive", "--exclude", "*", "--include", "*.html", "--content-type", "text/html; charset=utf-8", "--cache-control", html_cache, "--only-show-errors")
    invalidation = aws("cloudfront", "create-invalidation", "--distribution-id", args.distribution, "--paths", "/*")
    (checkpoint / "invalidation.json").write_text(json.dumps(invalidation, indent=2))
    print(json.dumps({"checkpoint": str(checkpoint), "invalidation": invalidation["Invalidation"]["Id"], "status": invalidation["Invalidation"]["Status"], "routerBytes": len(router.encode())}), flush=True)


if __name__ == "__main__":
    main()
