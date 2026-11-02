import { useEffect, useState, type ReactNode, type AnchorHTMLAttributes } from 'react'
const get = () => (location.hash.replace(/^#/, '') || '/').split('?')[0]
/** `#/page?s=section` scrolls to the element with id `section` once the page has rendered. */
const section = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('s')
function scrollToSection() {
  const id = section()
  if (!id) return false
  let tries = 0
  const t = setInterval(() => { const el = document.getElementById(id); if (el || ++tries > 40) { clearInterval(t); el?.scrollIntoView() } }, 50)
  return true
}
export function useRoute() {
  const [path, setPath] = useState(get())
  useEffect(() => {
    scrollToSection()
    const h = () => { setPath(get()); if (!scrollToSection()) window.scrollTo(0, 0) }
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [])
  return path
}
export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest}>{children}</a>
}
