import { RadioCards, TextArea, TextField } from './Field'
import type { ClientBooking, JobType, TalentTerms } from '../types'
import { CLIENT_SECTIONS } from '../types'
import { clientOptions, clientQuestion, RIDER_KEYS, talentNeedBadge, talentStatement } from '../rider'

type Props = {
  talent: TalentTerms
  client: ClientBooking
  onChange: (next: ClientBooking) => void
}

export function ClientForm({ talent, client, onChange }: Props) {
  const patch = (partial: Partial<ClientBooking>) => onChange({ ...client, ...partial })

  return (
    <form className="stack-form" onSubmit={(event) => event.preventDefault()}>
      <section id="production" className="form-section">
        <h2>
          <span>01</span> Production
        </h2>
        <p className="lede">Who is booking {talent.talentName || 'this talent'}.</p>
        <TextField
          id="client-name"
          label="Client / production name"
          value={client.clientName}
          placeholder="e.g. Tala Production House for SM Lifestyle"
          onChange={(clientName) => patch({ clientName })}
        />
      </section>

      <section id="job" className="form-section">
        <h2>
          <span>02</span> Job
        </h2>
        <p className="lede">Working title and type — as it should appear on the conforme.</p>
        <TextField
          id="job-title"
          label="Job title / working title"
          value={client.jobTitle}
          placeholder='e.g. SM Women — “Handa sa Umaga”'
          onChange={(jobTitle) => patch({ jobTitle })}
        />
        <RadioCards
          legend="Job type"
          name="job-type"
          value={client.jobType}
          onChange={(jobType) => patch({ jobType: jobType as JobType })}
          options={[
            { value: 'shoot', label: 'Shoot' },
            { value: 'engagement', label: 'Engagement' },
            { value: 'workshop', label: 'Workshop / Training' },
            { value: 'other', label: 'Other' },
          ]}
        />
        {client.jobType === 'other' ? (
          <TextField
            id="job-type-other"
            label="Describe the job type"
            value={client.jobTypeOther}
            onChange={(jobTypeOther) => patch({ jobTypeOther })}
          />
        ) : null}
      </section>

      <section id="when" className="form-section">
        <h2>
          <span>03</span> When & where
        </h2>
        <p className="lede">Call time, wrap, hours, and the location. Asia/Manila on the conforme.</p>
        <div className="grid-2">
          <TextField
            id="city"
            label="City"
            value={client.city}
            placeholder="e.g. Makati City"
            onChange={(city) => patch({ city })}
          />
          <TextField
            id="venue"
            label="Venue / site"
            value={client.venue}
            placeholder="Address or location name"
            onChange={(venue) => patch({ venue })}
          />
        </div>
        <div className="grid-2">
          <TextField
            id="date-start"
            label="Date"
            type="date"
            value={client.dateStart}
            onChange={(dateStart) =>
              patch({
                dateStart,
                dateEnd: !client.dateEnd || client.dateEnd === client.dateStart ? dateStart : client.dateEnd,
              })
            }
          />
          <TextField
            id="date-end"
            label="End date (if multi-day)"
            type="date"
            value={client.dateEnd}
            onChange={(dateEnd) => patch({ dateEnd })}
          />
        </div>
        <div className="grid-2">
          <TextField
            id="call-time"
            label="Call time"
            type="time"
            value={client.callTime}
            onChange={(callTime) => patch({ callTime })}
          />
          <TextField
            id="wrap-time"
            label="Expected wrap"
            type="time"
            value={client.wrapTime}
            onChange={(wrapTime) => patch({ wrapTime })}
          />
        </div>
        <TextField
          id="booking-hours"
          label="Booking hours"
          hint={
            talent.maxHours
              ? `Talent’s day cap is ${talent.maxHours} hours. Put the actual booked hours here.`
              : 'Number of hours this booking covers.'
          }
          value={client.bookingHours}
          inputMode="decimal"
          placeholder={talent.maxHours || '10'}
          onChange={(bookingHours) => patch({ bookingHours })}
        />
        <TextArea
          id="hours-note"
          label="Hours note"
          maxLength={160}
          rows={2}
          placeholder="e.g. Hard stop 4:00 PM."
          value={client.hoursNote}
          onChange={(hoursNote) => patch({ hoursNote })}
        />
      </section>

      <section id="rider" className="form-section">
        <h2>
          <span>04</span> Rider
        </h2>
        <p className="lede">
          Answer each working condition. This is the booking — same weight as fee and call time.
        </p>
        {RIDER_KEYS.map((key) => (
          <div key={key} className="rider-q">
            <p className="rider-q-need">
              <span className="stamp">{talentNeedBadge(key, talent)}</span>
              {talentStatement(key, talent)}
            </p>
            <RadioCards
              legend={clientQuestion(key, talent)}
              name={`client-${key}`}
              value={
                key === 'restroom'
                  ? client.restroom.answer
                  : key === 'holding'
                    ? client.holding.answer
                    : key === 'food'
                      ? client.food.answer
                      : key === 'water'
                        ? client.water.answer
                        : key === 'assistant'
                          ? client.assistant.answer
                          : client.hours.answer
              }
              onChange={(answer) => {
                if (key === 'restroom') patch({ restroom: { ...client.restroom, answer: answer as ClientBooking['restroom']['answer'] } })
                if (key === 'holding') patch({ holding: { ...client.holding, answer: answer as ClientBooking['holding']['answer'] } })
                if (key === 'food') patch({ food: { ...client.food, answer: answer as ClientBooking['food']['answer'] } })
                if (key === 'water') patch({ water: { ...client.water, answer: answer as ClientBooking['water']['answer'] } })
                if (key === 'assistant') {
                  patch({ assistant: { ...client.assistant, answer: answer as ClientBooking['assistant']['answer'] } })
                }
                if (key === 'hours') patch({ hours: { ...client.hours, answer: answer as ClientBooking['hours']['answer'] } })
              }}
              options={clientOptions(key)}
            />
            <TextArea
              id={`${key}-client-note`}
              label="Note for the call sheet"
              maxLength={160}
              rows={2}
              value={
                key === 'restroom'
                  ? client.restroom.note
                  : key === 'holding'
                    ? client.holding.note
                    : key === 'food'
                      ? client.food.note
                      : key === 'water'
                        ? client.water.note
                        : key === 'assistant'
                          ? client.assistant.note
                          : client.hours.note
              }
              onChange={(note) => {
                if (key === 'restroom') patch({ restroom: { ...client.restroom, note } })
                if (key === 'holding') patch({ holding: { ...client.holding, note } })
                if (key === 'food') patch({ food: { ...client.food, note } })
                if (key === 'water') patch({ water: { ...client.water, note } })
                if (key === 'assistant') patch({ assistant: { ...client.assistant, note } })
                if (key === 'hours') patch({ hours: { ...client.hours, note } })
              }}
            />
          </div>
        ))}
      </section>

      <section id="sign" className="form-section">
        <h2>
          <span>05</span> Conforme
        </h2>
        <p className="lede">Your name on the working agreement. Talent’s terms sit beside yours on one page.</p>
        <div className="grid-2">
          <TextField
            id="client-sig"
            label="Sign as"
            value={client.clientSignature}
            placeholder="e.g. Rica Villanueva, Producer"
            onChange={(clientSignature) => patch({ clientSignature })}
          />
          <TextField
            id="client-signed"
            label="Date"
            type="date"
            value={client.clientSignedDate}
            onChange={(clientSignedDate) => patch({ clientSignedDate })}
          />
        </div>
      </section>

      <p className="section-skip">
        {CLIENT_SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </p>
    </form>
  )
}
