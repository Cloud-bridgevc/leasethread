import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from '../lib/router'
import { apiSubmitDemoRequest } from '../lib/api'
import TriageWidget from './TriageWidget'

const Wrap = ({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) => <div className={`mx-auto px-4 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>{children}</div>
const Hero = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) => (
  <div className="bg-gradient-to-b from-slate-50 to-white py-16"><Wrap><div className="text-xs font-bold uppercase tracking-widest text-teal-600">{eyebrow}</div><h1 className="mt-2 max-w-3xl text-4xl font-extrabold md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-lg text-slate-600">{sub}</p></Wrap></div>
)

const features = [
  ['AI Lease Intelligence', 'Extract dates, rent, renewal conditions, notice periods and obligations — each field linked to the exact passage in the source document for verification.'],
  ['AI Maintenance Triage', 'Categorize tenant requests, assess urgency, flag missing information and recommend the right maintenance team.'],
  ['Property Operations Assistant', 'Ask plain-language questions about your own properties, open requests, deadlines and contractor assignments.'],
  ['Renewal Risk Monitor', 'See approaching expirations, missing renewal actions and unresolved maintenance that may affect renewals.'],
  ['Intelligent Reporting', 'Summaries of recurring problems, resolution times and outstanding tasks, with sample sizes shown.'],
  ['Contractor Board', 'Assign and track work across trades with a clear status for every job.'],
]

export function Home() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <Wrap>
          <div className="grid items-center gap-10 py-20 md:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-teal-300">AI-native property operations</div>
              <h1 className="mt-3 text-4xl font-extrabold !text-white md:text-5xl">Every property, lease, and maintenance request connected in one intelligent workspace.</h1>
              <p className="mt-5 text-lg text-slate-300">LeaseThread reads your leases, triages tenant requests and keeps renewals from slipping — so your team spends time on decisions, not document hunting.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to="/app" className="btn-accent">Explore the live workspace</Link><Link to="/request-demo" className="btn border border-white/30 text-white hover:bg-white/10">Request a demo</Link></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
              {[['3B · Sink leak', 'Plumbing', 'high'], ['2C · Outlet sparks', 'Electrical', 'emergency'], ['4A · Ceiling stain', 'Structural', 'medium']].map(([a, b, c]) => (
                <div key={a} className="mb-2 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 last:mb-0"><span>{a}</span><span className="flex gap-2"><span className="text-slate-300">{b}</span><span className={`rounded-full px-2 text-xs font-semibold ${c === 'emergency' ? 'bg-red-400/20 text-red-200' : c === 'high' ? 'bg-orange-400/20 text-orange-200' : 'bg-amber-400/20 text-amber-200'}`}>{c}</span></span></div>
              ))}
              <p className="mt-3 text-xs text-slate-400">Illustrative sample requests</p>
            </div>
          </div>
        </Wrap>
      </section>
      <section className="py-16"><Wrap>
        <h2 className="text-3xl font-bold">One workspace, five AI capabilities</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{features.map(([t, d]) => <div key={t} className="card p-5"><div className="mb-3 h-1 w-8 rounded bg-teal-500" /><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm">{d}</p></div>)}</div>
      </Wrap></section>
      <section className="bg-slate-50 py-16"><Wrap>
        <h2 className="text-3xl font-bold">Try the triage — right now</h2>
        <p className="mb-6 mt-2 max-w-2xl">Paste a tenant request and see how LeaseThread classifies it.</p>
        <TriageWidget compact />
      </Wrap></section>
      <section className="py-16"><Wrap narrow><div className="text-center"><h2 className="text-3xl font-bold">See it with your portfolio</h2><p className="mt-3">We'll walk through your lease and maintenance workflows in a 30-minute demo.</p><Link to="/request-demo" className="btn-primary mt-6">Request a demo</Link></div></Wrap></section>
    </>
  )
}

export const Features = () => (<><Hero eyebrow="Product" title="Built for how property teams actually work" sub="Lease documents, maintenance, contractors and deadlines are usually in five places. LeaseThread connects them." />
  <Wrap><div className="grid gap-5 py-12 md:grid-cols-2">{features.map(([t, d]) => <div key={t} className="card p-6"><h3 className="text-lg font-bold">{t}</h3><p className="mt-2">{d}</p></div>)}</div>
  <div className="mb-16 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm"><b>Our approach to AI:</b> AI output is always shown with its reasoning or source and is reviewed by a person before consequential actions. LeaseThread flags conditions that are visible in your data; it does not claim to predict maintenance failures without sufficient supporting data.</div></Wrap></>)

export const DemoPage = () => (<><Hero eyebrow="Interactive demo" title="AI maintenance triage" sub="Enter a request and get a category, urgency assessment, recommended action and explanation." /><Wrap><div className="pb-16"><TriageWidget /></div></Wrap></>)

const cases = [
  ['Regional property manager', '800 units, 6 properties', 'Catch expiring leases before notice windows close, and see which buildings have recurring problems.'],
  ['Small residential landlord', '12 units, self-managed', 'One place for leases, tenant messages and contractor jobs — with reminders so nothing is missed.'],
  ['Maintenance coordinator', 'Dispatch & scheduling', 'Start every day with requests already categorized and ranked, with missing details flagged to request from tenants.'],
  ['Asset manager', 'Portfolio oversight', 'Review resolution times and outstanding tasks across properties without compiling spreadsheets.'],
]
export const UseCases = () => (<><Hero eyebrow="Use cases" title="For teams managing real buildings" sub="Illustrative scenarios — not customer testimonials." /><Wrap><div className="grid gap-5 pb-16 md:grid-cols-2">{cases.map(([t, s, d]) => <div key={t} className="card p-6"><h3 className="text-lg font-bold">{t}</h3><div className="text-xs font-semibold uppercase text-teal-600">{s}</div><p className="mt-2">{d}</p></div>)}</div></Wrap></>)

const tiers = [
  ['Starter', '$99', 'per month · up to 25 units', ['Lease intelligence', 'Maintenance triage', 'Task & notification center']],
  ['Growth', '$349', 'per month · up to 250 units', ['Everything in Starter', 'Operations assistant', 'Renewal risk monitor', 'Reporting']],
  ['Portfolio', 'Custom', 'for 250+ units', ['Everything in Growth', 'SSO & audit logs', 'HubSpot / PMS integrations', 'Onboarding support']],
]
export const Pricing = () => (<><Hero eyebrow="Pricing" title="Simple pricing that scales with units" sub="Placeholder pricing for the prototype — final plans have not been set." /><Wrap><div className="grid gap-5 pb-16 md:grid-cols-3">{tiers.map(([n, p, s, f], i) => (
  <div key={n as string} className={`card p-6 ${i === 1 ? 'ring-2 ring-teal-500' : ''}`}><h3 className="font-bold">{n as string}</h3><div className="mt-2 font-display text-4xl font-extrabold text-navy-900">{p as string}</div><div className="text-sm text-slate-500">{s as string}</div>
  <ul className="my-5 space-y-2 text-sm">{(f as string[]).map(x => <li key={x}>✓ {x}</li>)}</ul><Link to="/request-demo" className={i === 1 ? 'btn-accent w-full' : 'btn-ghost w-full'}>Request demo</Link></div>))}</div></Wrap></>)

export function RequestDemo() {
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Please enter a valid work email.')
    setBusy(true); setErr(''); await apiSubmitDemoRequest(f); setBusy(false); setSent(true)
  }
  return (<><Hero eyebrow="Demo" title="Request a product demo" sub="Tell us about your portfolio and we'll tailor the walkthrough." /><Wrap narrow><div className="pb-16">
    {sent ? <div className="card p-8 text-center"><h2 className="text-2xl font-bold">Thanks — request recorded</h2><p className="mt-2">Prototype note: the HubSpot connection isn't live yet, so this submission was not sent anywhere. See docs/HUBSPOT.md for the planned flow.</p></div> :
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2"><div><label className="label" htmlFor="n">Name</label><input id="n" name="name" required className="input" /></div><div><label className="label" htmlFor="e">Work email</label><input id="e" name="email" type="email" required className="input" /></div>
      <div><label className="label" htmlFor="c">Company</label><input id="c" name="company" required className="input" /></div><div><label className="label" htmlFor="u">Units managed</label><select id="u" name="units" className="input"><option>1–25</option><option>26–250</option><option>251–1,000</option><option>1,000+</option></select></div></div>
      <div><label className="label" htmlFor="m">What would you like to improve?</label><textarea id="m" name="message" className="input min-h-[90px]" /></div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-accent w-full" disabled={busy}>{busy ? 'Submitting…' : 'Request demo'}</button>
      <p className="text-xs text-slate-500">Backend required: submission will go to a Lambda that creates a HubSpot contact + company and books a meeting. Not yet connected.</p></form>}
  </div></Wrap></>)
}

const faqs = [
  ['Does the AI make decisions for us?', 'No. It suggests categories, urgency and actions with an explanation. A person confirms before work is dispatched or notices are sent.'],
  ['Can LeaseThread predict equipment failures?', 'No. We only flag conditions visible in your data (e.g. repeated requests in a unit). We do not claim failure prediction without sufficient supporting data.'],
  ['How do I verify extracted lease terms?', 'Every extracted field links to the source document and the passage it came from.'],
  ['Where is AI processing done?', 'Server-side only, through Amazon Bedrock inside our AWS environment. Browsers never call a model directly.'],
  ['Who can see my properties?', 'Access is scoped by organization and property grants. The assistant can only query data the signed-in user is authorized to see.'],
  ['Is this product available today?', 'This is a prototype. Features marked "Backend required" in the app are not yet implemented.'],
]
export const FAQ = () => (<><Hero eyebrow="FAQ" title="Frequently asked questions" sub="" /><Wrap narrow><div className="space-y-3 pb-16">{faqs.map(([q, a]) => <details key={q} className="card group p-4"><summary className="cursor-pointer font-semibold text-navy-900">{q}</summary><p className="mt-2 text-sm">{a}</p></details>)}</div></Wrap></>)

const Legal = ({ title, items }: { title: string; items: [string, string][] }) => (<><Hero eyebrow="Legal" title={title} sub="Draft template for the prototype. Requires review by qualified counsel before launch." /><Wrap narrow><div className="space-y-6 pb-16">{items.map(([h, b]) => <div key={h}><h2 className="text-lg font-bold">{h}</h2><p className="mt-1">{b}</p></div>)}</div></Wrap></>)
export const Privacy = () => <Legal title="Privacy policy" items={[['Data we collect', 'Account details, property and lease records, uploaded documents, and maintenance communications provided by customers.'], ['How we use it', 'To provide the service, including AI analysis of your documents and requests. Customer data is not used to train shared models.'], ['Retention & deletion', 'Customers can request export and deletion. Retention periods to be finalized.'], ['Contact', 'privacy@example.com (placeholder)']]} />
export const Security = () => <Legal title="Security" items={[['Server-side AI', 'All model calls occur in AWS Lambda via Amazon Bedrock. No keys or prompts are exposed to browsers.'], ['Encryption', 'Planned: TLS in transit; S3 and PostgreSQL encrypted at rest with KMS.'], ['Access control', 'Planned: organization-scoped, role-based access with property-level grants and audit logging.'], ['Monitoring', 'Planned: Amazon CloudWatch logs, metrics and alarms.'], ['Status', 'This prototype has not undergone a security audit or certification.']]} />
export const Terms = () => <Legal title="Terms of service" items={[['Use of service', 'Customers are responsible for the accuracy of data and for reviewing AI output before acting on it.'], ['AI output', 'AI suggestions are advisory and may be incorrect. They are not legal advice or a substitute for professional judgment.'], ['Emergencies', 'LeaseThread is not an emergency service. Anyone in danger should contact local emergency services.'], ['Liability & termination', 'To be completed by counsel.']]} />
