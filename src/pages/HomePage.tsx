import { Link } from 'react-router-dom'
import { hasSavedTalent } from '../storage'

export function HomePage() {
  const resume = hasSavedTalent()

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="home-top">
        <p className="wordmark">Klaro</p>
        <nav aria-label="Primary">
          <Link to="/terms">Create terms</Link>
          <Link to="/conforme?sample=1">Sample conforme</Link>
        </nav>
      </header>
      <main id="main" className="home-hero">
        <p className="eyebrow">Philippine production · booking + rider</p>
        <h1>Clear terms. One-page conforme. Before call time.</h1>
        <p className="home-lead">
          Freelancers set the fee, hours, and working conditions. Production fills the job and answers the
          rider. The output is a conforme — a working agreement, not a chat thread and not a medical form.
        </p>
        <div className="home-cta">
          <Link className="btn btn-primary" to="/terms?from=blank">
            Create a booking
          </Link>
          <Link className="btn btn-ghost" to="/terms?from=sample">
            Start from sample
          </Link>
          {resume ? (
            <Link className="btn btn-ghost" to="/terms">
              Continue last terms
            </Link>
          ) : null}
        </div>
        <div className="home-split">
          <section>
            <p className="micro">Talent</p>
            <h2>You write what you need.</h2>
            <p>
              Name, role, ₱ fee, payment, overtime, day cap, and the rider: restroom, holding room, food,
              water, assistant. Location and call time stay off this form — those are production’s to fill.
            </p>
          </section>
          <section>
            <p className="micro">Production</p>
            <h2>You complete the booking.</h2>
            <p>
              Open the link. Add client name, title, city, venue, dates, call and wrap. Answer each rider
              item in producer language: Yes / We’ll arrange / No. Then both sides conforme.
            </p>
          </section>
        </div>
        <p className="home-foot">
          Inclusive by default. The rider is how bookings work here — not a special ask, not a diagnosis.
        </p>
        <p className="home-links">
          <Link to="/c?sample=1">Try the sample as a client</Link>
          <span aria-hidden="true">·</span>
          <Link to="/conforme?sample=1">View sample conforme</Link>
        </p>
      </main>
    </div>
  )
}
