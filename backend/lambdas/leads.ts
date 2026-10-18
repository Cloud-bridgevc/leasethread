// POST /api/leads — public demo-request endpoint. NOT YET DEPLOYED. See docs/HUBSPOT.md.
const HUBSPOT = 'https://api.hubapi.com'
export const handler = async (event: { body: string }) => {
  const f = JSON.parse(event.body)
  if (!/^\S+@\S+\.\S+$/.test(f.email ?? '')) return { statusCode: 400, body: '{"error":"invalid email"}' }
  // Token comes from AWS Secrets Manager (HUBSPOT_SECRET_ARN), never from the browser.
  const token = process.env.HUBSPOT_TOKEN! // resolve from Secrets Manager at cold start
  const res = await fetch(`${HUBSPOT}/crm/v3/objects/contacts`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: { email: f.email, firstname: f.name, company: f.company, lifecyclestage: 'lead', leadstatus: 'NEW' } }),
  })
  return { statusCode: res.ok || res.status === 409 ? 200 : 502, body: JSON.stringify({ ok: res.ok }) }
}
