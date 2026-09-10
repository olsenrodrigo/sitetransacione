#!/usr/bin/env python3
"""AWS CLI orchestration with local checkpoints. No credentials in artifacts.
Run without --execute to review commands; only --execute mutates AWS.
"""
import argparse,json,os,subprocess,pathlib,zipfile,datetime
ROOT=pathlib.Path(__file__).resolve().parents[2]
LOCAL=ROOT/'.dados/aws';LOCAL.mkdir(parents=True,exist_ok=True)
STATE=LOCAL/'state.json'
state=json.loads(STATE.read_text()) if STATE.exists() else {}
REGION='us-east-1';ACCOUNT='658150330486';NAME='transacione';BUCKET=f'transacione-site-{ACCOUNT}-us-east-1';TABLE='transacione-leads';FUNCTION='transacione-leads';ROLE='transacione-lambda'
TAGS=[{'Key':'Project','Value':'Transacione'},{'Key':'Owner','Value':'Sintetiza'},{'Key':'Origem','Value':'migracao-vps'}]
p=argparse.ArgumentParser();p.add_argument('phase',choices=['base','edge','certificate','monitor','dns']);p.add_argument('--execute',action='store_true');args=p.parse_args()
def save():
 state['updatedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
 tmp=STATE.with_suffix('.tmp');tmp.write_text(json.dumps(state,indent=2));os.chmod(tmp,0o600);tmp.replace(STATE)
def call(service,operation,params,key=None):
 params=dict(params); extra=[]
 if service=='s3api' and operation=='put-object':extra=['--body',params.pop('Body')]
 f=LOCAL/f'{key or service+"-"+operation}.json';f.write_text(json.dumps(params,indent=2))
 cmd=['aws',service,operation,'--region',REGION,'--cli-input-json','file://'+str(f),'--output','json','--cli-binary-format','raw-in-base64-out']+extra
 print(' '.join(cmd),flush=True)
 if not args.execute:return {}
 if key and key in state:return state[key]
 r=subprocess.run(cmd,capture_output=True,text=True)
 if r.returncode:raise RuntimeError(r.stderr)
 result=json.loads(r.stdout) if r.stdout.strip() else {}
 if key:state[key]=result;save()
 return result
if args.execute:
 identity=json.loads(subprocess.check_output(['aws','sts','get-caller-identity','--region',REGION]))
 assert identity['Account']==ACCOUNT and identity['Arn']==f'arn:aws:iam::{ACCOUNT}:user/servicomcpaws','Unexpected identity'

if args.phase=='base':
 call('s3api','create-bucket',{'Bucket':BUCKET},'bucket')
 call('s3api','put-public-access-block',{'Bucket':BUCKET,'PublicAccessBlockConfiguration':{k:True for k in ['BlockPublicAcls','IgnorePublicAcls','BlockPublicPolicy','RestrictPublicBuckets']}},'bucket-block')
 call('s3api','put-bucket-encryption',{'Bucket':BUCKET,'ServerSideEncryptionConfiguration':{'Rules':[{'ApplyServerSideEncryptionByDefault':{'SSEAlgorithm':'AES256'}}]}},'bucket-encryption')
 call('s3api','put-bucket-versioning',{'Bucket':BUCKET,'VersioningConfiguration':{'Status':'Enabled'}},'bucket-versioning')
 call('s3api','put-bucket-tagging',{'Bucket':BUCKET,'Tagging':{'TagSet':TAGS}},'bucket-tags')
 call('s3api','put-bucket-lifecycle-configuration',{'Bucket':BUCKET,'LifecycleConfiguration':{'Rules':[{'ID':'old-versions','Status':'Enabled','Filter':{'Prefix':''},'NoncurrentVersionExpiration':{'NoncurrentDays':30},'AbortIncompleteMultipartUpload':{'DaysAfterInitiation':7}}]}},'bucket-lifecycle')
 call('dynamodb','create-table',{'TableName':TABLE,'AttributeDefinitions':[{'AttributeName':'pk','AttributeType':'S'}],'KeySchema':[{'AttributeName':'pk','KeyType':'HASH'}],'BillingMode':'PAY_PER_REQUEST','DeletionProtectionEnabled':True,'Tags':TAGS},'table')
 if args.execute:
  subprocess.run(['aws','dynamodb','wait','table-exists','--region',REGION,'--table-name',TABLE],check=True)
 call('dynamodb','update-time-to-live',{'TableName':TABLE,'TimeToLiveSpecification':{'Enabled':True,'AttributeName':'expiresAt'}},'table-ttl')
 call('dynamodb','update-continuous-backups',{'TableName':TABLE,'PointInTimeRecoverySpecification':{'PointInTimeRecoveryEnabled':True,'RecoveryPeriodInDays':7}},'table-pitr')
 trust={'Version':'2012-10-17','Statement':[{'Effect':'Allow','Principal':{'Service':'lambda.amazonaws.com'},'Action':'sts:AssumeRole'}]}
 call('iam','create-role',{'RoleName':ROLE,'AssumeRolePolicyDocument':json.dumps(trust),'Tags':TAGS},'role')
 policy={'Version':'2012-10-17','Statement':[
  {'Effect':'Allow','Action':['dynamodb:GetItem','dynamodb:PutItem','dynamodb:UpdateItem'],'Resource':f'arn:aws:dynamodb:{REGION}:{ACCOUNT}:table/{TABLE}'},
  {'Effect':'Allow','Action':['logs:CreateLogStream','logs:PutLogEvents'],'Resource':f'arn:aws:logs:{REGION}:{ACCOUNT}:log-group:/aws/lambda/{FUNCTION}:*'}]}
 call('iam','put-role-policy',{'RoleName':ROLE,'PolicyName':'transacione-leads','PolicyDocument':json.dumps(policy)},'role-policy')
 call('logs','create-log-group',{'logGroupName':f'/aws/lambda/{FUNCTION}','tags':{t['Key']:t['Value'] for t in TAGS}},'logs')
 call('logs','put-retention-policy',{'logGroupName':f'/aws/lambda/{FUNCTION}','retentionInDays':7},'logs-retention')
 # Lambda zip via S3 avoids embedding binary or secrets in command logs.
 artifact=ROOT/'.build/aws/lambda.zip'
 if args.execute:
  with zipfile.ZipFile(artifact,'w',zipfile.ZIP_DEFLATED) as z:z.write(ROOT/'.build/aws/lambda/index.cjs','index.cjs')
 call('s3api','put-object',{'Bucket':BUCKET,'Key':'_deploy/lambda.zip','Body':str(artifact)},'lambda-upload')
 call('lambda','create-function',{'FunctionName':FUNCTION,'Runtime':'nodejs22.x','Role':f'arn:aws:iam::{ACCOUNT}:role/{ROLE}','Handler':'index.handler','Code':{'S3Bucket':BUCKET,'S3Key':'_deploy/lambda.zip'},'Description':'Transacione contact API','Timeout':15,'MemorySize':512,'Architectures':['x86_64'],'Environment':{'Variables':{'LEADS_TABLE':TABLE}},'Tags':{t['Key']:t['Value'] for t in TAGS}},'lambda')
 call('lambda','put-function-concurrency',{'FunctionName':FUNCTION,'ReservedConcurrentExecutions':5},'lambda-concurrency')
 call('lambda','create-function-url-config',{'FunctionName':FUNCTION,'AuthType':'AWS_IAM','InvokeMode':'BUFFERED'},'lambda-url')
 print('CHECKPOINT base complete',flush=True)

if args.phase=='edge':
 import urllib.parse
 if args.execute:assert 'lambda-url' in state,'Run base first'
 url=state.get('lambda-url',{}).get('FunctionUrl','https://pending.lambda-url.us-east-1.on.aws/')
 for origin in ['s3','lambda']:
  call('cloudfront','create-origin-access-control',{'OriginAccessControlConfig':{'Name':f'transacione-{origin}','Description':'Transacione private origin','SigningProtocol':'sigv4','SigningBehavior':'always','OriginAccessControlOriginType':origin}},f'oac-{origin}')
 code=(ROOT/'.build/aws/router.js').read_text()
 call('cloudfront','create-function',{'Name':'transacione-routes','FunctionConfig':{'Comment':'Transacione prerendered routes','Runtime':'cloudfront-js-2.0'},'FunctionCode':code},'router')
 etag=state.get('router',{}).get('ETag','pending')
 call('cloudfront','publish-function',{'Name':'transacione-routes','IfMatch':etag},'router-live')
 vis=lambda name:{'SampledRequestsEnabled':False,'CloudWatchMetricsEnabled':True,'MetricName':name}
 call('wafv2','create-web-acl',{'Name':'transacione','Scope':'CLOUDFRONT','DefaultAction':{'Allow':{}},'Description':'Transacione CloudFront Free plan','Rules':[{'Name':'LimitContactRequests','Priority':0,'Statement':{'RateBasedStatement':{'Limit':2000,'EvaluationWindowSec':300,'AggregateKeyType':'IP'}},'Action':{'Block':{}},'VisibilityConfig':vis('TransacioneContactRate')}],'VisibilityConfig':vis('Transacione'),'Tags':TAGS},'waf')
 functionArn=state.get('router',{}).get('FunctionSummary',{}).get('FunctionMetadata',{}).get('FunctionARN',f'arn:aws:cloudfront::{ACCOUNT}:function/transacione-routes')
 base={'ResponseHeadersPolicyId':'67f7725c-6f97-4210-82d7-5512b31e9d03','ViewerProtocolPolicy':'redirect-to-https','AllowedMethods':{'Quantity':2,'Items':['GET','HEAD'],'CachedMethods':{'Quantity':2,'Items':['GET','HEAD']}},'Compress':True,'FunctionAssociations':{'Quantity':1,'Items':[{'FunctionARN':functionArn,'EventType':'viewer-request'}]}}
 default={**base,'TargetOriginId':'site','CachePolicyId':'658327ea-f89d-4fab-a63d-7e88639e58f6'}
 api={**base,'PathPattern':'/api/*','TargetOriginId':'api','CachePolicyId':'4135ea2d-6df8-44a3-9df3-4b5a84be39ad','OriginRequestPolicyId':'b689b0a8-53d0-40ab-baf2-68738e2966ac','FunctionAssociations':{'Quantity':0},'AllowedMethods':{'Quantity':7,'Items':['GET','HEAD','OPTIONS','PUT','POST','PATCH','DELETE'],'CachedMethods':{'Quantity':2,'Items':['GET','HEAD']}}}
 origins=[{'Id':'site','DomainName':f'{BUCKET}.s3.us-east-1.amazonaws.com','OriginPath':'/public','S3OriginConfig':{'OriginAccessIdentity':''},'OriginAccessControlId':state.get('oac-s3',{}).get('OriginAccessControl',{}).get('Id','pending')},
 {'Id':'api','DomainName':urllib.parse.urlparse(url).netloc,'CustomOriginConfig':{'HTTPPort':80,'HTTPSPort':443,'OriginProtocolPolicy':'https-only','OriginSslProtocols':{'Quantity':1,'Items':['TLSv1.2']}},'OriginAccessControlId':state.get('oac-lambda',{}).get('OriginAccessControl',{}).get('Id','pending')}]
 config={'CallerReference':'transacione-serverless-20260910','Comment':'Transacione serverless migration','DefaultRootObject':'','Origins':{'Quantity':2,'Items':origins},'DefaultCacheBehavior':default,'CacheBehaviors':{'Quantity':1,'Items':[api]},'Enabled':False,'PriceClass':'PriceClass_All','ViewerCertificate':{'CloudFrontDefaultCertificate':True},'HttpVersion':'http2and3','IsIPV6Enabled':True,'WebACLId':state.get('waf',{}).get('Summary',{}).get('ARN','pending')}
 call('cloudfront','create-distribution-with-tags',{'DistributionConfigWithTags':{'DistributionConfig':config,'Tags':{'Items':TAGS}}},'distribution')
 d=state.get('distribution',{}).get('Distribution',{});did=d.get('Id','pending');arn=d.get('ARN',f'arn:aws:cloudfront::{ACCOUNT}:distribution/pending')
 policy={'Version':'2012-10-17','Statement':[{'Sid':'CloudFrontReadPublicOnly','Effect':'Allow','Principal':{'Service':'cloudfront.amazonaws.com'},'Action':'s3:GetObject','Resource':f'arn:aws:s3:::{BUCKET}/public/*','Condition':{'StringEquals':{'AWS:SourceArn':arn}}}]}
 call('s3api','put-bucket-policy',{'Bucket':BUCKET,'Policy':json.dumps(policy)},'bucket-policy')
 for action,suffix in [('lambda:InvokeFunctionUrl','url'),('lambda:InvokeFunction','invoke')]:
  params={'FunctionName':FUNCTION,'StatementId':f'TransacioneCloudFront{suffix}','Action':action,'Principal':'cloudfront.amazonaws.com','SourceArn':arn}
  if suffix=='url':params['FunctionUrlAuthType']='AWS_IAM'
  else:params['InvokedViaFunctionUrl']=True
  call('lambda','add-permission',params,'lambda-permission-'+suffix)
 call('pricing-plan-manager','create-subscription',{'planFamily':'CloudFront','planTier':'FREE','resourceArns':[arn,state.get('waf',{}).get('Summary',{}).get('ARN','pending')],'approvalMode':'IMMEDIATE','clientToken':'transacione-free-20260910'},'subscription')
 print('CHECKPOINT edge created disabled; verify subscription then enable',flush=True)

if args.phase=='certificate':
 call('acm','request-certificate',{'DomainName':'transacione.com.br','SubjectAlternativeNames':['www.transacione.com.br'],'ValidationMethod':'DNS','IdempotencyToken':'transacione20260910','Options':{'CertificateTransparencyLoggingPreference':'ENABLED','Export':'DISABLED'},'Tags':TAGS},'certificate')

if args.phase=='monitor':
 call('sns','create-topic',{'Name':'transacione-alertas','Tags':TAGS},'alerts-topic')
 topic=state.get('alerts-topic',{}).get('TopicArn',f'arn:aws:sns:{REGION}:{ACCOUNT}:transacione-alertas')
 did=state.get('distribution',{}).get('Distribution',{}).get('Id','pending')
 metrics=[('api-errors','AWS/Lambda','Errors','Sum',1,[{'Name':'FunctionName','Value':FUNCTION}]),('api-throttles','AWS/Lambda','Throttles','Sum',5,[{'Name':'FunctionName','Value':FUNCTION}]),('site-5xx','AWS/CloudFront','5xxErrorRate','Average',5,[{'Name':'DistributionId','Value':did},{'Name':'Region','Value':'Global'}])]
 for name,ns,metric,stat,threshold,dimensions in metrics:
  call('cloudwatch','put-metric-alarm',{'AlarmName':'transacione-'+name,'AlarmDescription':'Transacione serverless health','ActionsEnabled':True,'AlarmActions':[topic],'OKActions':[topic],'Namespace':ns,'MetricName':metric,'Dimensions':dimensions,'Statistic':stat,'Period':60,'EvaluationPeriods':2,'DatapointsToAlarm':2,'Threshold':threshold,'ComparisonOperator':'GreaterThanOrEqualToThreshold','TreatMissingData':'notBreaching','Tags':TAGS},'alarm-'+name)

if args.phase=='dns':
 call('route53','create-hosted-zone',{'Name':'transacione.com.br','CallerReference':'transacione-serverless-20260910','HostedZoneConfig':{'Comment':'Transacione migration; delegation remains unchanged','PrivateZone':False}},'zone')
 zid=state.get('zone',{}).get('HostedZone',{}).get('Id','/hostedzone/pending').split('/')[-1]
 call('route53','change-tags-for-resource',{'ResourceType':'hostedzone','ResourceId':zid,'AddTags':TAGS},'zone-tags')
 changes=[{'Action':'UPSERT','ResourceRecordSet':{'Name':name,'Type':'A','TTL':300,'ResourceRecords':[{'Value':'76.13.229.194'}]}} for name in ['transacione.com.br','www.transacione.com.br']]
 validation=json.loads((LOCAL/'certificate-validation.json').read_text())
 for v in validation['Validation']:
  r=v['Record'];changes.append({'Action':'UPSERT','ResourceRecordSet':{'Name':r['Name'],'Type':r['Type'],'TTL':300,'ResourceRecords':[{'Value':r['Value']}]}})
 call('route53','change-resource-record-sets',{'HostedZoneId':zid,'ChangeBatch':{'Comment':'Prepare zone; retain origin A records until validated cutover','Changes':changes}},'zone-initial-records')
 policy={'Version':'2012-10-17','Statement':[
 {'Sid':'AccountAdministration','Effect':'Allow','Principal':{'AWS':f'arn:aws:iam::{ACCOUNT}:root'},'Action':'kms:*','Resource':'*'},
 {'Sid':'Route53DNSSEC','Effect':'Allow','Principal':{'Service':'dnssec-route53.amazonaws.com'},'Action':['kms:DescribeKey','kms:GetPublicKey','kms:Sign'],'Resource':'*','Condition':{'StringEquals':{'aws:SourceAccount':ACCOUNT},'ArnEquals':{'aws:SourceArn':f'arn:aws:route53:::hostedzone/{zid}'}}},
 {'Sid':'Route53Grant','Effect':'Allow','Principal':{'Service':'dnssec-route53.amazonaws.com'},'Action':['kms:CreateGrant'],'Resource':'*','Condition':{'Bool':{'kms:GrantIsForAWSResource':'true'}}}]}
 call('kms','create-key',{'Description':'Transacione Route53 DNSSEC signing','KeyUsage':'SIGN_VERIFY','KeySpec':'ECC_NIST_P256','Policy':json.dumps(policy),'Tags':[{'TagKey':t['Key'],'TagValue':t['Value']} for t in TAGS]},'dnssec-key')
 keyArn=state.get('dnssec-key',{}).get('KeyMetadata',{}).get('Arn','pending')
 call('kms','create-alias',{'AliasName':'alias/transacione-dnssec','TargetKeyId':keyArn},'dnssec-alias')
 call('route53','create-key-signing-key',{'HostedZoneId':zid,'KeyManagementServiceArn':keyArn,'Name':'transacione_20260910','Status':'ACTIVE','CallerReference':'transacione-dnssec-20260910'},'dnssec-ksk')
 call('route53','enable-hosted-zone-dnssec',{'HostedZoneId':zid},'dnssec-enabled')
 print('CHECKPOINT DNS zone prepared; public delegation NOT changed')
