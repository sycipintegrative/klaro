import { Link, NavLink } from 'react-router-dom'

type Props = {
  kicker?: string
  showDonate?: boolean
  onDonate?: () => void
}

export function SiteHeader({ kicker, showDonate = false, onDonate }: Props) {
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
          {showDonate ? (
            onDonate ? (
              <button type="button" className="text-btn" onClick={onDonate}>
                Donate
              </button>
            ) : (
              <NavLink to="/donate">Donate</NavLink>
            )
          ) : null}
        </nav>
      </div>
    </header>
  )
}
