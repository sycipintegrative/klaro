type Props = {
  idPrefix?: string
}

export function DonatePanel({ idPrefix = 'donate' }: Props) {
  return (
    <figure className="donate-panel">
      <img
        src="/donate-qr.png"
        alt="Donate QR code placeholder. Replace public/donate-qr.png with the real GCash or Maya QR."
        width={720}
        height={720}
      />
      <figcaption id={`${idPrefix}-caption`}>
        Klaro is free. If a booking lands and you want to keep this going, scan to donate.
      </figcaption>
    </figure>
  )
}
