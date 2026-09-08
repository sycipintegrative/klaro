import { formatDate, formatDateRange, formatTime, jobTypeLabel } from '../format'
import { moneyLines, paymentLabel } from '../money'
import {
  clientAnswerLine,
  RIDER_KEYS,
  RIDER_LABELS,
  talentNeedBadge,
  talentStatement,
} from '../rider'
import type { Conforme } from '../types'

type Props = {
  conforme: Conforme
}

export function ConformeDoc({ conforme }: Props) {
  const { talent, client } = conforme
  const money = moneyLines(talent.fee, talent.discountType, talent.discountValue)
  const location = [client.city, client.venue].filter((part) => part.trim()).join(' · ') || 'Location to be added'
  const hours =
    client.bookingHours.trim() || talent.maxHours.trim()
      ? `${client.bookingHours.trim() || talent.maxHours} hours`
      : 'Hours to be added'

  return (
    <article className="conforme-doc" id="conforme-doc">
      <header className="doc-top">
        <div>
          <p className="doc-brand">Klaro</p>
          <p className="doc-sub">Booking conforme</p>
        </div>
        <div className="doc-top-right">
          <p className="doc-kicker">Working agreement</p>
          <p>{formatDate(client.dateStart || talent.issuedDate)}</p>
        </div>
      </header>

      <div className="doc-who">
        <div>
          <p className="micro">Talent</p>
          <h1 className="doc-name">{talent.talentName.trim() || 'Talent name'}</h1>
          <p className="doc-role">{talent.role.trim() || 'Role'}</p>
        </div>
        <div>
          <p className="micro">Production</p>
          <p className="doc-client">{client.clientName.trim() || 'Production name'}</p>
        </div>
      </div>

      <p className="doc-title">
        <span className="stamp">{jobTypeLabel(client.jobType, client.jobTypeOther)}</span>
        {client.jobTitle.trim() || 'Working title'}
      </p>

      <div className="doc-triad">
        <section>
          <h2>When</h2>
          <p className="doc-lead">{formatDateRange(client.dateStart, client.dateEnd)}</p>
          <p>
            Call {formatTime(client.callTime)}
            {client.wrapTime ? ` · Wrap ${formatTime(client.wrapTime)}` : ''}
          </p>
          <p>{hours}</p>
        </section>
        <section>
          <h2>Fee</h2>
          <p className="doc-lead">{money.netLine}</p>
          {money.discountLine ? <p>{money.discountLine}</p> : <p>Fee {money.feeLine}</p>}
          <p>{paymentLabel(talent.paymentPreset, talent.paymentCustom)}</p>
        </section>
        <section>
          <h2>Place</h2>
          <p className="doc-lead">{client.city.trim() || 'City'}</p>
          <p>{client.venue.trim() || 'Venue / site'}</p>
        </section>
      </div>

      {(talent.included.trim() || talent.overtimeRate.trim()) && (
        <div className="doc-include">
          {talent.included.trim() ? (
            <p>
              <span className="micro">Included</span> {talent.included}
            </p>
          ) : null}
          {talent.overtimeRate.trim() ? (
            <p>
              <span className="micro">Overtime</span> {talent.overtimeRate}
            </p>
          ) : null}
        </div>
      )}

      <section className="doc-rider">
        <h2>Rider</h2>
        <ul>
          {RIDER_KEYS.map((key) => {
            const answer = clientAnswerLine(key, client)
            return (
              <li key={key}>
                <div className="doc-rider-meta">
                  <span className="doc-rider-name">{RIDER_LABELS[key]}</span>
                  <span className="stamp">{talentNeedBadge(key, talent)}</span>
                </div>
                <p className="doc-rider-need">{talentStatement(key, talent)}</p>
                <p className={`doc-rider-ans is-${answer.tone}`}>{answer.label}</p>
              </li>
            )
          })}
        </ul>
        {talent.sensoryNotes.trim() ? (
          <p className="doc-extra">
            <span className="micro">On-set</span> {talent.sensoryNotes}
          </p>
        ) : null}
        {talent.otherNotes.trim() ? (
          <p className="doc-extra">
            <span className="micro">Also</span> {talent.otherNotes}
          </p>
        ) : null}
      </section>

      <section className="doc-sign">
        <h2>Conforme</h2>
        <p className="doc-sign-lede">I agree to these terms as the working agreement for this booking.</p>
        <div className="doc-sign-grid">
          <div>
            <p className="micro">Talent</p>
            <p className="sign-line">{talent.talentSignature.trim() || talent.talentName.trim() || '\u00a0'}</p>
            <p>{formatDate(talent.issuedDate)}</p>
          </div>
          <div>
            <p className="micro">Production</p>
            <p className="sign-line">
              {client.clientSignature.trim() || client.clientName.trim() || '\u00a0'}
            </p>
            <p>{formatDate(client.clientSignedDate)}</p>
          </div>
        </div>
      </section>

      <footer className="doc-foot">
        <p>This booking summary is the working agreement unless replaced in writing.</p>
        <p className="doc-foot-meta">
          Klaro · {location} · {formatDateRange(client.dateStart, client.dateEnd)}
        </p>
      </footer>
    </article>
  )
}
