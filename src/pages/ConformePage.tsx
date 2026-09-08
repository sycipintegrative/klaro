import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConformeDoc } from '../components/ConformeDoc'
import { SiteHeader } from '../components/SiteHeader'
import { decodeConforme, encodeConforme, payloadFromLocation } from '../encoding'
import { sampleClient, sampleTalent } from '../sample'
import { slugFilename } from '../format'

export function ConformePage() {
  const location = useLocation()
  const parsed = payloadFromLocation(location.search, location.hash)
  const conforme = useMemo(() => {
    if (parsed.sample) return { talent: sampleTalent(), client: sampleClient() }
    if (parsed.conforme) return decodeConforme(parsed.conforme)
    return null
  }, [parsed.conforme, parsed.sample])
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pdfError, setPdfError] = useState('')

  if (!conforme) {
    return (
      <div className="app-shell">
        <SiteHeader kicker="Conforme" />
        <main className="narrow-msg">
          <h1>No conforme loaded.</h1>
          <p>Open a completed booking link, or view the sample shoot.</p>
          <p>
            <Link className="btn btn-primary" to="/conforme?sample=1">
              View sample conforme
            </Link>
          </p>
        </main>
      </div>
    )
  }

  const sharePath = parsed.sample ? '/conforme?sample=1' : `/conforme?b=${encodeConforme(conforme)}`
  const editHref = `/c?b=${encodeConforme(conforme)}`
  const filename = slugFilename([
    'Klaro-Conforme',
    conforme.talent.talentName,
    conforme.client.jobTitle,
  ])

  async function copyShare() {
    const url = `${window.location.origin}${sharePath}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  async function downloadPdf() {
    const node = document.getElementById('conforme-doc')
    if (!node) return
    setBusy(true)
    setPdfError('')
    const { downloadElementPdf } = await import('../pdf')
    try {
      await downloadElementPdf(node, filename)
    } catch {
      setPdfError('Could not build the PDF in this browser. Use Print and choose Save as PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="conforme-shell">
      <SiteHeader kicker="Conforme" />
      <div className="conforme-toolbar no-print">
        <p>
          {conforme.talent.talentName} · {conforme.client.clientName || 'Production'}
        </p>
        <div className="editor-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print A4
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void downloadPdf()} disabled={busy}>
            {busy ? 'Preparing PDF…' : 'Download PDF'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void copyShare()}>
            {copied ? 'Copied' : 'Copy share link'}
          </button>
          <Link className="btn btn-ghost" to={editHref}>
            Edit booking
          </Link>
        </div>
      </div>
      {pdfError ? (
        <p className="inline-note no-print" role="status">
          {pdfError}
        </p>
      ) : null}
      <div className="conforme-stage">
        <ConformeDoc conforme={conforme} />
      </div>
    </div>
  )
}
