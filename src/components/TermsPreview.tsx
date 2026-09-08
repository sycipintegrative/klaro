import { moneyLines, paymentLabel } from '../money'
import { clientQuestion, RIDER_KEYS, talentNeedBadge, talentStatement } from '../rider'
import type { TalentTerms } from '../types'

type Props = {
  talent: TalentTerms
}

export function TermsPreview({ talent }: Props) {
  const money = moneyLines(talent.fee, talent.discountType, talent.discountValue)
  const name = talent.talentName.trim() || 'Your name'
  const role = talent.role.trim() || 'Role'

  return (
    <article className="brief-doc" aria-label="What production will see">
      <header className="brief-head">
        <p className="brief-brand">Klaro</p>
        <p className="brief-kind">For production</p>
      </header>
      <h2 className="brief-name">{name}</h2>
      <p className="brief-role">{role}</p>
      <div className="brief-money">
        <div>
          <p className="micro">Fee</p>
          <p className="brief-num">{money.netLine}</p>
          {money.discountLine ? <p className="micro">{money.discountLine}</p> : null}
        </div>
        <div>
          <p className="micro">Terms</p>
          <p>{paymentLabel(talent.paymentPreset, talent.paymentCustom)}</p>
        </div>
        <div>
          <p className="micro">Day cap</p>
          <p className="brief-num">{talent.maxHours.trim() ? `${talent.maxHours}h` : '—'}</p>
        </div>
      </div>
      {talent.included.trim() ? (
        <p className="brief-include">
          <span className="micro">Included</span> {talent.included}
        </p>
      ) : null}
      {talent.overtimeRate.trim() ? (
        <p className="brief-include">
          <span className="micro">Overtime</span> {talent.overtimeRate}
        </p>
      ) : null}
      <h3 className="brief-h">Rider — please answer</h3>
      <ol className="brief-q">
        {RIDER_KEYS.map((key) => (
          <li key={key}>
            <span className="stamp">{talentNeedBadge(key, talent)}</span>
            <strong>{clientQuestion(key, talent)}</strong>
            <span className="brief-need">{talentStatement(key, talent)}</span>
          </li>
        ))}
      </ol>
      {talent.sensoryNotes.trim() ? (
        <p className="brief-include">
          <span className="micro">On-set</span> {talent.sensoryNotes}
        </p>
      ) : null}
      {talent.otherNotes.trim() ? (
        <p className="brief-include">
          <span className="micro">Also</span> {talent.otherNotes}
        </p>
      ) : null}
      <p className="brief-foot">You will add location, dates, and call time. Then both parties conforme.</p>
    </article>
  )
}
