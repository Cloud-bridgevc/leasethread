# LeaseThread architecture

```
Browser (React/Vite, CloudFront + S3)
  └─ HTTPS → API Gateway (Cognito JWT) → Lambda
        ├─ /triage, /assistant → Amazon Bedrock (server side only)
        ├─ /documents → pre-signed S3 PUT; S3 event → extract Lambda → Textract + Bedrock
        ├─ CRUD → Aurora PostgreSQL (private subnets, RDS Proxy, RLS by org_id)
        ├─ EventBridge (daily) → renewal-scan Lambda → tasks + notifications (SES)
        └─ /leads → HubSpot (see HUBSPOT.md)
CloudWatch: structured logs, error/latency alarms, Bedrock token-usage metrics
```

Principles: AI calls never leave the server; every AI output stores model id, explanation and source; assistant tools are parameterised queries filtered by `org_id` and property grants (the model never sees SQL or out-of-scope rows); humans confirm consequential actions; the system does not forecast failures.

Files: `backend/db/schema.sql`, `backend/lambdas/*`, `backend/infra/template.yaml`.
