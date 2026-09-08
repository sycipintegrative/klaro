import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ClientForm } from '../components/ClientForm'
import { ConformeDoc } from '../components/ConformeDoc'
import { PreviewFrame } from '../components/PreviewFrame'
import { SectionNav } from '../components/SectionNav'
import { SiteHeader } from '../components/SiteHeader'
import { decodeConforme, decodeTerms, encodeConforme, payloadFromLocation } from '../encoding'
import { blankClient } from '../defaults'
import { sampleTalent } from '../sample'
import { CLIENT_SECTIONS, type ClientBooking, type TalentTerms } from '../types'
import { moneyLines } from '../money'

function loadClientDraft(talentId: string): ClientBooking | null {
  try {
    const raw = sessionStorage.getItem(`klaro.client.${talentId}`)
    return raw ? (JSON.parse(raw) as ClientBooking) : null
  } catch {
    return null
  }
}

function saveClientDraft(talentId: string, client: ClientBooking) {
  sessionStorage.setItem(`klaro.client.${talentId}`, JSON.stringify(client))
}

function resolveSource(search: string, hash: string): {
  key: string
  talent: TalentTerms | null
  client: ClientBooking
} {
  const parsed = payloadFromLocation(search, hash)
  if (parsed.conforme) {
    const packet = decodeConforme(parsed.conforme)
    if (packet) return { key: `b:${parsed.conforme.slice(0, 24)}`, talent: packet.talent, client: packet.client }
  }
  if (parsed.sample) {
    return { key: 'sample', talent: sampleTalent(), client: blankClient() }
  }
  if (parsed.terms) {
    const talent = decodeTerms(parsed.terms)
    if (talent) {
      return {
        key: `t:${talent.id}`,
        talent,
        client: loadClientDraft(talent.id) ?? blankClient(),
      }
    }
  }
  return { key: 'missing', talent: null, client: blankClient() }
}

export function ClientPage() {
  const location = useLocation()
  const source = resolveSource(location.search, location.hash)
  return <ClientEditor key={source.key} talent={source.talent} initialClient={source.client} />
}

function ClientEditor({
  talent,
  initialClient,
}: {
  talent: TalentTerms | null
  initialClient: ClientBooking
}) {
  const [client, setClient] = useState<ClientBooking>(initialClient)
  const [activeSection, setActiveSection] = useState('production')
  const [pane, setPane] = useState<'edit' | 'preview'>('edit')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (talent) saveClientDraft(talent.id, client)
  }, [talent, client])

  useEffect(() => {
    const nodes = CLIENT_SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    if (nodes.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.2, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [talent])

  if (!talent) {
    return (
      <div className="app-shell">
        <SiteHeader kicker="Client booking" />
        <main className="narrow-msg">
          <h1>This client link is missing talent terms.</h1>
          <p>Ask the freelancer for a new Klaro link, or open the sample booking.</p>
          <p>
            <Link className="btn btn-primary" to="/c?sample=1">
              Open sample as client
            </Link>
          </p>
        </main>
      </div>
    )
  }

  const conforme = { talent, client }
  const conformeHref = `/conforme?b=${encodeConforme(conforme)}`
  const money = moneyLines(talent.fee, talent.discountType, talent.discountValue)
  const unanswered = [
    !client.clientName.trim() && 'production name',
    !client.jobTitle.trim() && 'job title',
    !client.city.trim() && 'city',
    !client.dateStart && 'date',
    !client.callTime && 'call time',
    !client.restroom.answer && 'restroom',
    !client.holding.answer && 'holding',
    !client.food.answer && 'food',
    !client.water.answer && 'water',
    !client.assistant.answer && 'assistant',
    !client.hours.answer && 'hours',
  ].filter((item): item is string => Boolean(item))

  async function copyConforme() {
    const url = `${window.location.origin}${conformeHref}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this conforme link', url)
    }
  }

  return (
    <div className="app-shell">
      <SiteHeader kicker="Complete this booking" />
      <div className="client-banner no-print">
        <div>
          <p className="micro">Booking for</p>
          <p className="client-banner-name">
            {talent.talentName.trim() || 'Talent'} · {talent.role.trim() || 'Role'}
          </p>
        </div>
        <dl className="client-banner-meta">
          <div>
            <dt>Fee</dt>
            <dd>{money.netLine}</dd>
          </div>
          <div>
            <dt>Day cap</dt>
            <dd>{talent.maxHours.trim() ? `${talent.maxHours}h` : '—'}</dd>
          </div>
        </dl>
      </div>
      <div className="editor-top no-print">
        <SectionNav sections={CLIENT_SECTIONS} activeId={activeSection} />
        <div className="editor-actions">
          <Link className="btn btn-primary" to={conformeHref}>
            Open conforme
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => void copyConforme()}>
            {copied ? 'Copied' : 'Copy conforme link'}
          </button>
        </div>
      </div>
      {unanswered.length > 0 ? (
        <p className="inline-note no-print">
          You can generate the conforme anytime. Still open: {unanswered.join(', ')}.
        </p>
      ) : (
        <p className="inline-note is-ok no-print">All booking fields have an answer. Open the conforme to print or send.</p>
      )}
      <div className="pane-toggle no-print" role="tablist" aria-label="Edit or preview">
        <button type="button" role="tab" aria-selected={pane === 'edit'} onClick={() => setPane('edit')}>
          Complete booking
        </button>
        <button type="button" role="tab" aria-selected={pane === 'preview'} onClick={() => setPane('preview')}>
          Conforme preview
        </button>
      </div>
      <div className={`editor-grid ${pane === 'preview' ? 'show-preview' : 'show-edit'}`}>
        <div className="editor-form">
          <ClientForm talent={talent} client={client} onChange={setClient} />
        </div>
        <aside className="editor-preview">
          <PreviewFrame label="Conforme · A4">
            <ConformeDoc conforme={conforme} />
          </PreviewFrame>
        </aside>
      </div>
    </div>
  )
}
