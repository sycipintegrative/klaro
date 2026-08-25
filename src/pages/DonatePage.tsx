import { Link } from 'react-router-dom'
import { DonatePanel } from '../components/DonatePanel'
import { SiteHeader } from '../components/SiteHeader'

export function DonatePage() {
  return (
    <div className="app-shell">
      <SiteHeader kicker="Donate" />
      <main className="donate-page">
        <h1>Klaro is free.</h1>
        <p className="lede">
          No paywall, no client fee. If a booking lands and you want this to keep existing, scan the QR.
          Production never sees this page.
        </p>
        <DonatePanel />
        <p>
          <Link to="/terms">Back to your terms</Link>
        </p>
      </main>
    </div>
  )
}
