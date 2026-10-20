import { useRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import SiteLayout from './site/SiteLayout'
import * as P from './site/pages'
import AppShell from './app/AppShell'
import Dashboard from './app/Dashboard'
import Maintenance from './app/Maintenance'
import Leases from './app/Leases'
import * as O from './app/Others'

const site: Record<string, () => JSX.Element> = {
  '/': P.Home, '/features': P.Features, '/demo': P.DemoPage, '/use-cases': P.UseCases, '/pricing': P.Pricing,
  '/request-demo': P.RequestDemo, '/faq': P.FAQ, '/about': P.About, '/privacy': P.Privacy, '/security': P.Security, '/terms': P.Terms,
}
const app: Record<string, () => JSX.Element> = {
  '/app': Dashboard, '/app/properties': O.Properties, '/app/maintenance': Maintenance, '/app/leases': Leases,
  '/app/contractors': O.Contractors, '/app/communications': O.Communications, '/app/assistant': O.Assistant,
  '/app/reports': O.Reports, '/app/documents': O.Documents, '/app/tasks': O.Tasks,
}
export default function App() {
  const path = useRoute()
  const A = app[path]
  if (A) return <StoreProvider><AppShell path={path}><A /></AppShell></StoreProvider>
  const S = site[path] ?? P.Home
  return <SiteLayout><S /></SiteLayout>
}
