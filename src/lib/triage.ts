/**
 * DEMO TRIAGE ENGINE — deterministic keyword rules, NOT a language model.
 * In production this runs server-side: POST /api/triage -> Lambda -> Amazon Bedrock
 * (see backend/lambdas/triage.ts). The rule set below is also intended as a
 * safety guardrail layer in production (e.g. gas/fire/CO always escalate).
 */
import type { Category, Urgency } from '../data/types'

export interface TriageResult {
  category: Category
  urgency: Urgency
  team: string
  nextAction: string
  explanation: string
  missingInfo: string[]
  signals: string[]
  safetyNote?: string
}

const CATEGORY_RULES: { cat: Category; team: string; words: string[] }[] = [
  { cat: 'Safety', team: 'Emergency response', words: ['gas smell', 'smell gas', 'smoke', 'fire', 'carbon monoxide', 'co detector', 'smoke detector', 'mold'] },
  { cat: 'Electrical', team: 'Electrical', words: ['outlet', 'spark', 'breaker', 'power', 'electric', 'wiring', 'light', 'switch', 'flicker'] },
  { cat: 'Plumbing', team: 'Plumbing', words: ['leak', 'sink', 'toilet', 'faucet', 'drain', 'clog', 'pipe', 'water', 'flood', 'sewage', 'shower', 'water heater'] },
  { cat: 'HVAC', team: 'HVAC', words: ['heat', 'furnace', 'a/c', 'ac ', 'air condition', 'thermostat', 'cooling', 'vent', 'hvac'] },
  { cat: 'Locks & Security', team: 'Security', words: ['lock', 'key', 'door', 'break-in', 'broken in', 'window latch', 'intercom'] },
  { cat: 'Pest', team: 'General', words: ['mice', 'mouse', 'roach', 'cockroach', 'bed bug', 'ants', 'rat', 'pest', 'termite'] },
  { cat: 'Appliance', team: 'General', words: ['dishwasher', 'fridge', 'refrigerator', 'oven', 'stove', 'washer', 'dryer', 'microwave', 'disposal'] },
  { cat: 'Structural', team: 'General', words: ['ceiling', 'stain', 'crack', 'roof', 'wall', 'floor', 'stairs', 'railing', 'window'] },
]

const EMERGENCY = ['gas smell', 'smell gas', 'smoke', 'fire', 'spark', 'carbon monoxide', 'sewage', 'flood', 'burst', 'break-in', 'broken in', 'exposed wire', 'electrocut']
const HIGH = ['no heat', 'heat has not', "heat doesn't", 'not working', 'no hot water', 'leak', 'standing water', 'locked out', 'no power', 'won\'t lock', 'wont lock']
const LOW = ['flicker', 'drip', 'squeak', 'cosmetic', 'paint', 'minor', 'sticks', 'running']

const has = (txt: string, w: string) => txt.includes(w)

export function triage(raw: string): TriageResult {
  const text = ` ${raw.toLowerCase()} `
  const signals: string[] = []

  // category = rule with the most keyword hits; Safety wins ties
  let best = { cat: 'General' as Category, team: 'General', hits: 0 }
  for (const r of CATEGORY_RULES) {
    const matched = r.words.filter(w => has(text, w))
    if (matched.length > best.hits || (matched.length === best.hits && matched.length > 0 && r.cat === 'Safety')) best = { cat: r.cat, team: r.team, hits: matched.length }
    if (matched.length) signals.push(`${r.cat}: "${matched.slice(0, 3).join('", "')}"`)
  }

  const emergencyHit = EMERGENCY.filter(w => has(text, w))
  const highHit = HIGH.filter(w => has(text, w))
  const lowHit = LOW.filter(w => has(text, w))

  let urgency: Urgency = 'medium'
  if (emergencyHit.length) urgency = 'emergency'
  else if (highHit.length) urgency = 'high'
  else if (lowHit.length && best.hits > 0) urgency = 'low'
  if (best.hits === 0 && !emergencyHit.length) urgency = 'low'
  if (/\b(\d+|three|four|five|several) days?\b/.test(text) && urgency === 'medium' && ['HVAC', 'Plumbing'].includes(best.cat)) urgency = 'high'

  if (emergencyHit.length && best.cat !== 'Safety' && /gas|smoke|fire|carbon/.test(emergencyHit.join(' '))) best = { cat: 'Safety', team: 'Emergency response', hits: best.hits }

  const missing: string[] = []
  if (!/\b(unit|apt|apartment|#)\s*\w+|\b\d{1,3}[a-z]\b/.test(text)) missing.push('Unit number or location within the unit')
  if (!/(since|ago|yesterday|today|last night|this morning|days?|weeks?|started|began)/.test(text)) missing.push('When the problem started')
  if (['Plumbing', 'Structural', 'Electrical', 'Appliance'].includes(best.cat)) missing.push('A photo or short video of the problem')
  if (best.cat === 'Plumbing' && /leak|flood|burst|water/.test(text)) missing.push('Whether the water shutoff has been closed')
  if (best.cat === 'Appliance' && !/model|brand|make/.test(text)) missing.push('Appliance make/model')
  if (best.cat === 'HVAC' && !/(thermostat|set to|degrees|°)/.test(text)) missing.push('Thermostat setting and indoor temperature')
  if (best.cat === 'Pest') missing.push('Where activity was seen')

  const nextActions: Record<Urgency, string> = {
    emergency: 'Contact the tenant immediately, advise them how to stay safe, and dispatch the on-call team now.',
    high: `Dispatch ${best.team} within 24 hours and confirm access times with the tenant.`,
    medium: `Schedule ${best.team} within 3–5 business days; request any missing details first.`,
    low: `Add to the routine queue for ${best.team}; batch with other work at this property if possible.`,
  }

  const why: string[] = []
  if (best.hits) why.push(`Wording matched ${best.cat.toLowerCase()} terms (${signals.length ? signals[0] : 'n/a'}).`)
  else why.push('No strong category signals were found, so this is filed as General for human review.')
  if (emergencyHit.length) why.push(`Safety-critical wording detected ("${emergencyHit[0]}"), which always escalates to emergency.`)
  else if (highHit.length) why.push(`Wording suggests loss of an essential service or active damage ("${highHit[0]}").`)
  else if (lowHit.length) why.push(`Wording suggests a minor or cosmetic issue ("${lowHit[0]}").`)
  else why.push('No emergency or minor-issue wording, so urgency defaults to medium.')

  return {
    category: best.cat, urgency, team: best.team,
    nextAction: nextActions[urgency],
    explanation: why.join(' ') + ' A property manager should confirm before dispatch.',
    missingInfo: missing, signals,
    safetyNote: urgency === 'emergency' ? 'If anyone is in danger, tenants should call local emergency services first. LeaseThread does not replace emergency response.' : undefined,
  }
}

export const SAMPLE_REQUESTS = [
  'Unit 4C: kitchen sink is leaking under the cabinet and water is on the floor since this morning.',
  'The outlet in my living room sparks when I plug things in. Unit 2C.',
  'Heat has not worked for three days in 5A and the apartment is cold.',
  'Hallway light outside 2D is flickering.',
]
