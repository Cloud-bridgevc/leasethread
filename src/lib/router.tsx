import { useEffect, useState, type ReactNode, type AnchorHTMLAttributes } from 'react'
const get = () => (location.hash.replace(/^#/, '') || '/').split('?')[0]
export function useRoute() {
  const [path, setPath] = useState(get())
  useEffect(() => { const h = () => { setPath(get()); window.scrollTo(0, 0) }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])
  return path
}
export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest}>{children}</a>
}
