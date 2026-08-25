import { useEffect, useId, useRef } from 'react'
import { DonatePanel } from './DonatePanel'

type Props = {
  open: boolean
  onClose: () => void
}

export function DonateModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="donate-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="donate-dialog-inner">
        <h2 id={titleId}>Donate</h2>
        <p className="donate-lede">Klaro has no paywall. Scan to donate via GCash or Maya.</p>
        <DonatePanel />
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  )
}
