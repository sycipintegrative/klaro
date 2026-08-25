import { Link, NavLink } from 'react-router-dom'

type Props = {
  kicker?: string
}

export function SiteHeader({ kicker }: Props) {
  return (
    <header className="site-header no-print">
      <div className="site-header-inner">
        <Link className="wordmark" to="/">
          Klaro
        </Link>
        {kicker ? <p className="header-kicker">{kicker}</p> : null}
        <nav className="header-nav" aria-label="Primary">
          <NavLink to="/terms">Talent</NavLink>
          <NavLink to="/conforme?sample=1">Sample conforme</NavLink>
        </nav>
      </div>
    </header>
  )
}
