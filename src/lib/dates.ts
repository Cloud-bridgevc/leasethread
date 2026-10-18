export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
export const addDays = (n: number, from = today()) => { const d = new Date(from); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
export const daysUntil = (iso: string) => Math.round((new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).getTime() - today().getTime()) / 864e5)
export const fmtDate = (iso: string) => new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
export const ago = (iso: string) => { const d = -daysUntil(iso.slice(0, 10)); return d <= 0 ? 'today' : d === 1 ? '1 day ago' : `${d} days ago` }
