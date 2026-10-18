/**
 * DEMO lease extraction: regex over the fictional sample lease text.
 * Production: Lambda (S3 event) -> Textract/OCR -> Bedrock structured extraction,
 * each field stored with the source passage + page offset for human verification.
 */
export interface Extracted { field: string; value: string; passage: string }
const grab = (t: string, re: RegExp) => { const m = t.match(re); return m ? m[0].trim() : '' }
export function extractLease(text: string): Extracted[] {
  const out: Extracted[] = []
  const add = (field: string, re: RegExp, val: (m: RegExpMatchArray) => string) => {
    const m = text.match(re); if (m) out.push({ field, value: val(m), passage: grab(text, new RegExp(`[^\\n]*${m[0].replace(/[.*+?^${}()|[\]\\$]/g, '\\$&')}[^\\n]*`)) })
  }
  add('Lease end date', /term ends on (\d{4}-\d{2}-\d{2})/i, m => m[1])
  add('Monthly rent', /monthly rent of \$(\d[\d,]*)/i, m => `$${m[1]}`)
  add('Late fee', /late fee of \$(\d+)/i, m => `$${m[1]}`)
  add('Notice period', /at least (\d+) days before/i, m => `${m[1]} days`)
  const ren = text.match(/4\. RENEWAL\. ([^\n]+)/); if (ren) out.push({ field: 'Renewal condition', value: ren[1], passage: ren[0] })
  const obl = text.match(/6\. OBLIGATIONS\. ([^\n]+)/); if (obl) out.push({ field: 'Obligations', value: obl[1], passage: obl[0] })
  return out
}
