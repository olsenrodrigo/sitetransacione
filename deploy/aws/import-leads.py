#!/usr/bin/env python3
"""Idempotent import. Values never printed; existing contacts never overwritten."""
import json,pathlib,hashlib,subprocess,datetime,os
root=pathlib.Path(__file__).resolve().parents[2]
identity=json.loads(subprocess.check_output(['aws','sts','get-caller-identity','--region','us-east-1']))
assert identity['Account']=='658150330486' and identity['Arn'].endswith(':user/servicomcpaws')
source=root/'.dados/leads.jsonl';folder=root/'.dados/aws';folder.mkdir(exist_ok=True)
def av(x):
 if x is None:return {'NULL':True}
 if isinstance(x,bool):return {'BOOL':x}
 if isinstance(x,(int,float)):return {'N':str(x)}
 if isinstance(x,dict):return {'M':{k:av(v) for k,v in x.items()}}
 if isinstance(x,list):return {'L':[av(v) for v in x]}
 return {'S':str(x)}
added=skipped=0
for line in source.read_text().splitlines() if source.exists() else []:
 if not line.strip():continue
 item=json.loads(line);digest=hashlib.sha256(json.dumps(item,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
 item.update(pk='LEAD#legacy#'+digest,importedFrom='vps',importedAt=datetime.datetime.now(datetime.timezone.utc).isoformat())
 f=folder/'import-current.json';f.write_text(json.dumps({'TableName':'transacione-leads','Item':{k:av(v) for k,v in item.items()},'ConditionExpression':'attribute_not_exists(pk)'}));os.chmod(f,0o600)
 r=subprocess.run(['aws','dynamodb','put-item','--region','us-east-1','--cli-input-json','file://'+str(f)],capture_output=True,text=True)
 if r.returncode:
  if 'ConditionalCheckFailedException' in r.stderr:skipped+=1
  else:raise RuntimeError('Import failed; see AWS error type: '+r.stderr.split(':')[-1][:160])
 else:added+=1
summary={'imported':added,'alreadyPresent':skipped,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest() if source.exists() else None,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
(folder/'import-summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
