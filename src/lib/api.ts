/**
 * Client-side API facade. In this demo each call resolves locally after a short
 * delay so the UI behaves like a networked product.
 * BACKEND STATUS: replace bodies with fetch('/api/...') once the AWS stack in
 * /backend is deployed. Endpoints are documented in docs/BACKEND_STATUS.md.
 */
import { triage, type TriageResult } from './triage'
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function apiTriage(text: string): Promise<TriageResult> {
  await wait(700) // POST /api/triage  -> Lambda -> Bedrock (not yet connected)
  return triage(text)
}
export async function apiSubmitDemoRequest(payload: Record<string, string>) {
  await wait(600) // POST /api/leads -> Lambda -> HubSpot Forms/CRM API (not yet connected)
  console.info('[demo] lead captured locally only', { ...payload, email: '[redacted]' })
  return { ok: true }
}
