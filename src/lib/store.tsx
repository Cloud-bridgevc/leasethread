import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { properties, leases, requests, contractors, comms, tasks, docs, notifications } from '../data/sample'
import type { Request, Task, Notification, Comm, Lease, RequestStatus } from '../data/types'

interface State { requests: Request[]; tasks: Task[]; notifications: Notification[]; comms: Comm[]; leases: Lease[] }
type Action =
  | { type: 'addRequest'; req: Request }
  | { type: 'assign'; id: string; contractorId: string }
  | { type: 'status'; id: string; status: RequestStatus }
  | { type: 'toggleTask'; id: string }
  | { type: 'addTask'; task: Task }
  | { type: 'read'; id: string }
  | { type: 'renewalSent'; leaseId: string }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'addRequest': return { ...s, requests: [a.req, ...s.requests] }
    case 'assign': return { ...s, requests: s.requests.map(r => r.id === a.id ? { ...r, contractorId: a.contractorId, status: r.status === 'new' || r.status === 'triaged' ? 'assigned' : r.status } : r) }
    case 'status': return { ...s, requests: s.requests.map(r => r.id === a.id ? { ...r, status: a.status, resolvedAt: a.status === 'resolved' ? new Date().toISOString() : undefined } : r) }
    case 'toggleTask': return { ...s, tasks: s.tasks.map(t => t.id === a.id ? { ...t, done: !t.done } : t) }
    case 'addTask': return { ...s, tasks: [a.task, ...s.tasks] }
    case 'read': return { ...s, notifications: s.notifications.map(n => n.id === a.id ? { ...n, read: true } : n) }
    case 'renewalSent': return { ...s, leases: s.leases.map(l => l.id === a.leaseId ? { ...l, renewalActionTaken: true } : l) }
  }
}

const Ctx = createContext<null | ReturnType<typeof build>>(null)
function build(state: State, dispatch: React.Dispatch<Action>) {
  return { ...state, properties, contractors, docs, dispatch }
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { requests, tasks, notifications, comms, leases })
  const value = useMemo(() => build(state, dispatch), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error('StoreProvider missing'); return c }
