// POST /api/triage — Lambda behind API Gateway (Cognito JWT authorizer). NOT YET DEPLOYED.
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient({})
const MODEL_ID = process.env.BEDROCK_MODEL_ID! // set per environment

const SYSTEM = `You triage residential maintenance requests for a property manager.
Return ONLY JSON: {"category","urgency":"emergency|high|medium|low","team","nextAction","explanation","missingInfo":[]}.
Rules: gas smell, smoke/fire, sparking electrical, sewage, flooding, or break-in are always "emergency".
Never predict future equipment failures. Base the answer only on the request text. Say when information is missing.`

export const handler = async (event: { body: string; requestContext: { authorizer: { claims: { org_id: string; sub: string } } } }) => {
  const { text } = JSON.parse(event.body)
  if (typeof text !== 'string' || text.length < 5 || text.length > 2000) return { statusCode: 400, body: '{"error":"invalid text"}' }
  const out = await client.send(new ConverseCommand({
    modelId: MODEL_ID, system: [{ text: SYSTEM }],
    messages: [{ role: 'user', content: [{ text }] }],
    inferenceConfig: { maxTokens: 600, temperature: 0 },
  }))
  const raw = out.output?.message?.content?.[0]?.text ?? '{}'
  let result; try { result = JSON.parse(raw) } catch { return { statusCode: 502, body: '{"error":"model returned invalid JSON"}' } }
  // TODO: apply deterministic safety guardrails (shared keyword rules) and validate against schema; write ai_audit_log; persist to Postgres
  return { statusCode: 200, body: JSON.stringify(result) }
}
