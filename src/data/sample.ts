// ALL DATA IN THIS FILE IS FICTIONAL SAMPLE DATA for demonstration only.
import { addDays } from '../lib/dates'
import type { Property, Lease, Request, Contractor, Comm, Task, Doc, Notification } from './types'

export const properties: Property[] = [
  { id: 'p1', name: 'Harbor View Apartments', address: '120 Example Wharf Rd, Sampleton', type: 'Multifamily', units: 48, occupied: 45, monthlyRent: 71400, manager: 'Priya Raman (sample)' },
  { id: 'p2', name: 'Maple Court Townhomes', address: '14 Placeholder Lane, Sampleton', type: 'Townhomes', units: 16, occupied: 16, monthlyRent: 29600, manager: 'Priya Raman (sample)' },
  { id: 'p3', name: 'Cedar Row Duplexes', address: '8 Fictional Ave, Demoville', type: 'Duplex portfolio', units: 10, occupied: 9, monthlyRent: 15300, manager: 'Marcus Bell (sample)' },
  { id: 'p4', name: 'Northgate Lofts', address: '501 Mockingbird St, Demoville', type: 'Mixed-use', units: 24, occupied: 22, monthlyRent: 48400, manager: 'Marcus Bell (sample)' },
]

export const leases: Lease[] = [
  { id: 'l1', propertyId: 'p1', unit: '3B', tenant: 'Jordan Ellis (sample)', docId: 'd1', start: addDays(-335), end: addDays(28), rent: 1650, deposit: 1650, noticeDays: 60, renewalClause: 'Lease renews month-to-month unless either party gives 60 days written notice.', renewalActionTaken: false },
  { id: 'l2', propertyId: 'p1', unit: '5A', tenant: 'Amara Okafor (sample)', docId: 'd2', start: addDays(-300), end: addDays(65), rent: 1725, deposit: 1725, noticeDays: 60, renewalClause: 'Tenant may renew for 12 months at a rent not exceeding 5% above current rent, by written notice 60 days before expiry.', renewalActionTaken: false },
  { id: 'l3', propertyId: 'p2', unit: '7', tenant: 'Chen Family (sample)', docId: 'd3', start: addDays(-200), end: addDays(160), rent: 1850, deposit: 2000, noticeDays: 90, renewalClause: 'Automatic 12-month renewal unless 90 days written notice is given.', renewalActionTaken: false },
  { id: 'l4', propertyId: 'p3', unit: 'A', tenant: 'Sam Whitfield (sample)', docId: 'd4', start: addDays(-350), end: addDays(14), rent: 1520, deposit: 1500, noticeDays: 30, renewalClause: 'Either party may terminate at expiry with 30 days written notice; otherwise month-to-month.', renewalActionTaken: true },
  { id: 'l5', propertyId: 'p4', unit: '2C', tenant: 'Lucía Fernández (sample)', docId: 'd5', start: addDays(-120), end: addDays(245), rent: 2200, deposit: 2200, noticeDays: 60, renewalClause: 'Renewal by mutual written agreement; landlord to send renewal offer at least 75 days before expiry.', renewalActionTaken: false },
  { id: 'l6', propertyId: 'p4', unit: '4A', tenant: 'Devon Park (sample)', docId: 'd6', start: addDays(-340), end: addDays(52), rent: 2050, deposit: 2050, noticeDays: 60, renewalClause: 'Renewal by mutual written agreement; landlord to send renewal offer at least 60 days before expiry.', renewalActionTaken: false },
]

export const contractors: Contractor[] = [
  { id: 'c1', name: 'Bluewater Plumbing (sample)', trade: 'Plumbing', team: 'Plumbing', phone: '555-0101', rating: 4.7, availability: 'available' },
  { id: 'c2', name: 'Voltline Electric (sample)', trade: 'Electrical', team: 'Electrical', phone: '555-0102', rating: 4.5, availability: 'busy' },
  { id: 'c3', name: 'ClimateWorks HVAC (sample)', trade: 'HVAC', team: 'HVAC', phone: '555-0103', rating: 4.8, availability: 'available' },
  { id: 'c4', name: 'FixRight Handyman (sample)', trade: 'General / Appliance', team: 'General', phone: '555-0104', rating: 4.2, availability: 'available' },
  { id: 'c5', name: 'SafeKey Locksmiths (sample)', trade: 'Locks & Security', team: 'Security', phone: '555-0105', rating: 4.6, availability: 'off' },
]

const t = (d: number, h = 9) => `${addDays(d)}T${String(h).padStart(2, '0')}:00:00`
export const requests: Request[] = [
  { id: 'r1', propertyId: 'p1', unit: '3B', tenant: 'Jordan Ellis (sample)', submitted: t(-2), text: 'Kitchen sink is leaking under the cabinet and the floor is getting wet.', status: 'assigned', category: 'Plumbing', urgency: 'high', contractorId: 'c1', missingInfo: ['Photo of leak source', 'Whether the water shutoff valve has been closed'] },
  { id: 'r2', propertyId: 'p1', unit: '5A', tenant: 'Amara Okafor (sample)', submitted: t(-9), text: 'Heat has not worked for three days. It is getting cold at night.', status: 'in_progress', category: 'HVAC', urgency: 'high', contractorId: 'c3', missingInfo: [] },
  { id: 'r3', propertyId: 'p2', unit: '7', tenant: 'Chen Family (sample)', submitted: t(-1), text: 'Dishwasher stopped draining, there is standing water.', status: 'triaged', category: 'Appliance', urgency: 'medium', missingInfo: ['Dishwasher make/model'] },
  { id: 'r4', propertyId: 'p3', unit: 'A', tenant: 'Sam Whitfield (sample)', submitted: t(-21), text: 'Front door lock sticks and sometimes will not open.', status: 'resolved', category: 'Locks & Security', urgency: 'medium', contractorId: 'c5', resolvedAt: t(-18), missingInfo: [] },
  { id: 'r5', propertyId: 'p4', unit: '4A', tenant: 'Devon Park (sample)', submitted: t(-14), text: 'Bathroom ceiling has a brown stain that is growing after rain.', status: 'new', category: 'Structural', urgency: 'medium', missingInfo: ['Photo', 'Whether unit above has plumbing issues'] },
  { id: 'r6', propertyId: 'p1', unit: '2D', tenant: 'Riley Stone (sample)', submitted: t(-30), text: 'Hallway light flickering.', status: 'resolved', category: 'Electrical', urgency: 'low', contractorId: 'c2', resolvedAt: t(-27), missingInfo: [] },
  { id: 'r7', propertyId: 'p1', unit: '3B', tenant: 'Jordan Ellis (sample)', submitted: t(-60), text: 'Bathroom faucet drips constantly.', status: 'resolved', category: 'Plumbing', urgency: 'low', contractorId: 'c1', resolvedAt: t(-55), missingInfo: [] },
  { id: 'r8', propertyId: 'p1', unit: '6C', tenant: 'Noor Haddad (sample)', submitted: t(-45), text: 'Toilet keeps running and won\'t stop.', status: 'resolved', category: 'Plumbing', urgency: 'low', contractorId: 'c1', resolvedAt: t(-44), missingInfo: [] },
  { id: 'r9', propertyId: 'p2', unit: '3', tenant: 'Ibrahim Cole (sample)', submitted: t(-6), text: 'Mice seen in the kitchen twice this week.', status: 'assigned', category: 'Pest', urgency: 'medium', contractorId: 'c4', missingInfo: ['Where droppings found'] },
  { id: 'r10', propertyId: 'p4', unit: '2C', tenant: 'Lucía Fernández (sample)', submitted: t(-4), text: 'Outlet in the living room sparks when I plug things in.', status: 'new', category: 'Electrical', urgency: 'emergency', missingInfo: [] },
]

export const comms: Comm[] = [
  { id: 'm1', requestId: 'r1', propertyId: 'p1', tenant: 'Jordan Ellis (sample)', channel: 'portal', direction: 'in', at: t(-2), summary: 'Reported sink leak under kitchen cabinet.' },
  { id: 'm2', requestId: 'r1', propertyId: 'p1', tenant: 'Jordan Ellis (sample)', channel: 'sms', direction: 'out', at: t(-2, 10), summary: 'Confirmed plumber assigned; asked tenant to close shutoff valve.' },
  { id: 'm3', requestId: 'r2', propertyId: 'p1', tenant: 'Amara Okafor (sample)', channel: 'email', direction: 'in', at: t(-9), summary: 'No heat for three days.' },
  { id: 'm4', requestId: 'r2', propertyId: 'p1', tenant: 'Amara Okafor (sample)', channel: 'call', direction: 'out', at: t(-8), summary: 'Called to schedule HVAC visit; tenant asked about space heater.' },
  { id: 'm5', requestId: 'r5', propertyId: 'p4', tenant: 'Devon Park (sample)', channel: 'portal', direction: 'in', at: t(-14), summary: 'Reported ceiling stain. No response logged yet.' },
  { id: 'm6', propertyId: 'p3', tenant: 'Sam Whitfield (sample)', channel: 'email', direction: 'out', at: t(-10), summary: 'Sent renewal offer for unit A.' },
]

export const tasks: Task[] = [
  { id: 't1', title: 'Send renewal offer — Harbor View 3B', due: addDays(3), done: false, source: 'ai' },
  { id: 't2', title: 'Respond to Devon Park re: ceiling stain', due: addDays(0), done: false, source: 'ai', link: 'r5' },
  { id: 't3', title: 'Dispatch electrician — Northgate 2C outlet', due: addDays(0), done: false, source: 'ai', link: 'r10' },
  { id: 't4', title: 'Upload Q3 insurance certificate', due: addDays(10), done: false, source: 'manual' },
]

const leaseText = (unit: string, tenant: string, rent: number, end: string, notice: number, clause: string) =>
  `RESIDENTIAL LEASE AGREEMENT (FICTIONAL SAMPLE)\n\n1. PARTIES. This lease is between Sample Landlord LLC and ${tenant} for unit ${unit}.\n\n2. TERM. The lease term ends on ${end}.\n\n3. RENT. Tenant shall pay monthly rent of $${rent} due on the 1st of each month. A late fee of $75 applies after the 5th.\n\n4. RENEWAL. ${clause}\n\n5. NOTICE. Any notice of non-renewal must be given in writing at least ${notice} days before the end of the term.\n\n6. OBLIGATIONS. Tenant shall report maintenance issues promptly and maintain renter's insurance. Landlord shall maintain heating, plumbing, and electrical systems in good working order.`
export const docs: Doc[] = (leases.map((l, i) => ({
  id: l.docId, propertyId: l.propertyId, name: `Lease — ${l.unit} — ${l.tenant.replace(' (sample)', '')}.pdf`, kind: 'Lease' as const, uploaded: addDays(-300 + i * 20),
  text: leaseText(l.unit, l.tenant, l.rent, l.end, l.noticeDays, l.renewalClause),
})) as Doc[]).concat([
  { id: 'd7', propertyId: 'p1', name: 'Fire Inspection 2026.pdf', kind: 'Inspection', uploaded: addDays(-80), text: undefined },
  { id: 'd8', propertyId: 'p2', name: 'Property Insurance Certificate.pdf', kind: 'Insurance', uploaded: addDays(-120), text: undefined },
])

export const notifications: Notification[] = [
  { id: 'n1', at: t(0, 8), text: 'Outlet sparking reported at Northgate Lofts 2C — emergency triage.', level: 'critical', read: false },
  { id: 'n2', at: t(0, 7), text: 'Harbor View 3B lease ends in 28 days with no renewal action.', level: 'warn', read: false },
  { id: 'n3', at: t(-1, 15), text: 'Plumber assigned to Harbor View 3B.', level: 'info', read: true },
]
