import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TalentForm } from '../components/TalentForm'
import { TermsPreview } from '../components/TermsPreview'
import { SectionNav } from '../components/SectionNav'
import { SiteHeader } from '../components/SiteHeader'
import { clientLink, encodeTerms } from '../encoding'
import { useDebounced } from '../hooks/useDebounced'
import { blankTalent } from '../defaults'
import { sampleTalent } from '../sample'
import { hasSavedTalent, loadActiveTalent, saveTalent } from '../storage'
import { DonateModal } from '../components/DonateModal'
import { TALENT_SECTIONS, type TalentTerms } from '../types'

function missingTalent(talent: TalentTerms): string[] {
  const gaps: string[] = []
  if (!talent.talentName.trim()) gaps.push('your name')
  if (!talent.role.trim()) gaps.push('role')
  if (!talent.fee.trim()) gaps.push('fee')
  if (!talent.maxHours.trim()) gaps.push('day cap')
  return gaps
}

function startTalent(from: string | null): TalentTerms {
  if (from === 'sample') return sampleTalent()
  if (from === 'blank') return blankTalent()
  return loadActiveTalent() ?? blankTalent()
}

export function TalentPage() {
  const [params] = useSearchParams()
  const from = params.get('from')
  return <TalentEditor key={from ?? 'saved'} from={from} />
}

function TalentEditor({ from }: { from: string | null }) {
  const [talent, setTalent] = useState<TalentTerms>(() => startTalent(from))
  const [copied, setCopied] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [activeSection, setActiveSection] = useState('you')
  const [pane, setPane] = useState<'edit' | 'preview'>('edit')
  const debounced = useDebounced(talent, 350)
  const gaps = missingTalent(talent)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const link = useMemo(() => clientLink(origin, talent), [origin, talent])

  useEffect(() => {
    saveTalent(debounced)
  }, [debounced])

  useEffect(() => {
    const nodes = TALENT_SECTIONS.map((section) => document.getElementById(section.id)).filter(
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
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setLinkSent(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setLinkSent(true)
      window.prompt('Copy this client link', link)
    }
  }

  return (
    <div className="app-shell">
      <SiteHeader kicker="Talent terms" showDonate onDonate={() => setDonateOpen(true)} />
      <div className="editor-top no-print">
        <SectionNav sections={TALENT_SECTIONS} activeId={activeSection} />
        <div className="editor-actions">
          <p className="save-pill" aria-live="polite">
            Saved on this device
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void copyLink()}>
            {copied ? 'Copied' : 'Copy client link'}
          </button>
          <Link className="btn btn-ghost" to={`/c?t=${encodeTerms(talent)}`}>
            Open as client
          </Link>
        </div>
      </div>
      {linkSent ? (
        <p className="inline-note is-ok no-print">
          If a booking lands, you can donate.{' '}
          <button type="button" className="text-btn" onClick={() => setDonateOpen(true)}>
            Show QR
          </button>
        </p>
      ) : null}
      {gaps.length > 0 ? (
        <p className="inline-note no-print">
          You can send this now. Still empty: {gaps.join(', ')}. Nothing is blocked at the end.
        </p>
      ) : (
        <p className="inline-note is-ok no-print">Ready to send. Production fills location, dates, and the rider.</p>
      )}
      <div className="pane-toggle no-print" role="tablist" aria-label="Edit or preview">
        <button type="button" role="tab" aria-selected={pane === 'edit'} onClick={() => setPane('edit')}>
          Edit
        </button>
        <button type="button" role="tab" aria-selected={pane === 'preview'} onClick={() => setPane('preview')}>
          What production sees
        </button>
      </div>
      <div className={`editor-grid ${pane === 'preview' ? 'show-preview' : 'show-edit'}`}>
        <div className="editor-form">
          <TalentForm talent={talent} onChange={setTalent} />
        </div>
        <aside className="editor-preview" aria-label="Live preview">
          <TermsPreview talent={talent} />
        </aside>
      </div>
      <div className="editor-bottom no-print">
        <Link to="/terms?from=blank">Start blank</Link>
        <Link to="/terms?from=sample">Start from sample</Link>
        {hasSavedTalent() ? <span>Last edit stays on this browser until you clear it.</span> : null}
      </div>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  )
}
