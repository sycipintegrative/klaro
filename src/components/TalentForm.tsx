import { RadioCards, TextArea, TextField } from './Field'
import type { TalentTerms } from '../types'
import { TALENT_SECTIONS } from '../types'
import { moneyLines, paymentLabel } from '../money'

type Props = {
  talent: TalentTerms
  onChange: (next: TalentTerms) => void
}

export function TalentForm({ talent, onChange }: Props) {
  const patch = (partial: Partial<TalentTerms>) => onChange({ ...talent, ...partial })
  const money = moneyLines(talent.fee, talent.discountType, talent.discountValue)

  return (
    <form className="stack-form" onSubmit={(event) => event.preventDefault()}>
      <section id="you" className="form-section">
        <h2>
          <span>01</span> You
        </h2>
        <p className="lede">Who the client is booking. Production fills the job details on their side.</p>
        <div className="grid-2">
          <TextField
            id="talent-name"
            label="Your name"
            value={talent.talentName}
            placeholder="e.g. Jordan Cruz"
            autoComplete="name"
            onChange={(talentName) => patch({ talentName })}
          />
          <TextField
            id="talent-role"
            label="Role"
            hint="How you should be listed on the call sheet."
            value={talent.role}
            placeholder="e.g. On-camera talent"
            onChange={(role) => patch({ role })}
          />
        </div>
      </section>

      <section id="fee" className="form-section">
        <h2>
          <span>02</span> Fee
        </h2>
        <p className="lede">₱ rates, what is included, and how you get paid.</p>
        <div className="grid-2">
          <TextField
            id="fee"
            label="Fee (₱)"
            hint="Whole job or day rate — say which in “what’s included.”"
            value={talent.fee}
            inputMode="decimal"
            placeholder="18000"
            onChange={(fee) => patch({ fee })}
          />
          <RadioCards
            legend="Discount"
            name="discount-type"
            value={talent.discountType}
            onChange={(discountType) =>
              patch({
                discountType: discountType as TalentTerms['discountType'],
                discountValue: discountType === 'none' ? '' : talent.discountValue,
              })
            }
            options={[
              { value: 'none', label: 'None' },
              { value: 'amount', label: '₱ amount' },
              { value: 'percent', label: 'Percent' },
            ]}
          />
        </div>
        {talent.discountType !== 'none' ? (
          <TextField
            id="discount-value"
            label={talent.discountType === 'percent' ? 'Discount %' : 'Discount ₱'}
            value={talent.discountValue}
            inputMode="decimal"
            onChange={(discountValue) => patch({ discountValue })}
          />
        ) : null}
        <p className="money-live" aria-live="polite">
          Fee {money.feeLine}
          {money.discountLine ? ` · ${money.discountLine}` : ''} · <strong>Net {money.netLine}</strong>
        </p>
        <RadioCards
          legend="Payment terms"
          name="payment"
          value={talent.paymentPreset}
          onChange={(paymentPreset) =>
            patch({ paymentPreset: paymentPreset as TalentTerms['paymentPreset'] })
          }
          options={[
            { value: 'fifty_fifty', label: '50% / 50%' },
            { value: 'full_before_call', label: 'Full before call' },
            { value: 'net_15', label: 'Net 15' },
            { value: 'net_30', label: 'Net 30' },
            { value: 'gcash_day', label: 'GCash on the day' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {talent.paymentPreset === 'custom' ? (
          <TextField
            id="payment-custom"
            label="Custom payment terms"
            value={talent.paymentCustom}
            placeholder="e.g. 40% GCash to hold the date"
            onChange={(paymentCustom) => patch({ paymentCustom })}
          />
        ) : (
          <p className="field-hint">{paymentLabel(talent.paymentPreset, talent.paymentCustom)}</p>
        )}
        <TextArea
          id="included"
          label="What’s included"
          maxLength={280}
          rows={3}
          placeholder="e.g. Full-day appearance, fitting, campaign stills for this job only."
          value={talent.included}
          onChange={(included) => patch({ included })}
        />
        <TextArea
          id="overtime"
          label="Overtime / extra-hour rate"
          maxLength={200}
          rows={2}
          placeholder="e.g. ₱2,500 / hour after hard stop, billed in 30-minute increments."
          value={talent.overtimeRate}
          onChange={(overtimeRate) => patch({ overtimeRate })}
        />
      </section>

      <section id="hours" className="form-section">
        <h2>
          <span>03</span> Hours
        </h2>
        <p className="lede">
          Your day cap — not the call time. Production will enter call, wrap, and location on their form.
        </p>
        <TextField
          id="max-hours"
          label="Expected hours (day cap)"
          hint="A number. First-class on the rider, not a footnote."
          value={talent.maxHours}
          inputMode="decimal"
          placeholder="10"
          onChange={(maxHours) => patch({ maxHours })}
        />
        <TextArea
          id="hard-stop"
          label="Hard stop"
          maxLength={200}
          rows={2}
          placeholder="e.g. 10 hours from call, including makeup and wait."
          value={talent.hardStopNote}
          onChange={(hardStopNote) => patch({ hardStopNote })}
        />
      </section>

      <section id="rider" className="form-section">
        <h2>
          <span>04</span> Rider
        </h2>
        <p className="lede">
          Working conditions for this booking. These become questions production must answer — not a medical form.
        </p>

        <RadioCards
          legend="Restroom nearby"
          name="restroom-need"
          hint="Producer-facing line: restroom access within a short walk of set."
          value={talent.restroom.need}
          onChange={(need) =>
            patch({ restroom: { ...talent.restroom, need: need as TalentTerms['restroom']['need'] } })
          }
          options={[
            { value: 'required', label: 'Required' },
            { value: 'preferred', label: 'Preferred' },
            { value: 'not_needed', label: 'Not needed' },
          ]}
        />
        <TextArea
          id="restroom-note"
          label="Restroom note"
          maxLength={160}
          rows={2}
          value={talent.restroom.note}
          onChange={(note) => patch({ restroom: { ...talent.restroom, note } })}
        />

        <RadioCards
          legend="Holding / quiet room"
          name="holding-need"
          value={talent.holding.need}
          onChange={(need) =>
            patch({ holding: { ...talent.holding, need: need as TalentTerms['holding']['need'] } })
          }
          options={[
            { value: 'required', label: 'Required' },
            { value: 'preferred', label: 'Preferred' },
            { value: 'not_needed', label: 'Not needed' },
          ]}
        />
        <TextArea
          id="holding-note"
          label="Holding note"
          maxLength={160}
          rows={2}
          value={talent.holding.note}
          onChange={(note) => patch({ holding: { ...talent.holding, note } })}
        />

        <RadioCards
          legend="Food"
          name="food-need"
          value={talent.food.need}
          onChange={(need) =>
            patch({ food: { ...talent.food, need: need as TalentTerms['food']['need'] } })
          }
          options={[
            { value: 'production_provides', label: 'Production provides' },
            { value: 'talent_brings', label: 'I bring my own' },
            { value: 'flexible', label: 'Flexible' },
          ]}
        />
        <TextArea
          id="food-note"
          label="Food note"
          maxLength={160}
          rows={2}
          placeholder="e.g. Lunch by 12:00 NN. No shellfish."
          value={talent.food.note}
          onChange={(note) => patch({ food: { ...talent.food, note } })}
        />

        <RadioCards
          legend="Water"
          name="water-need"
          value={talent.water.need}
          onChange={(need) =>
            patch({ water: { ...talent.water, need: need as TalentTerms['water']['need'] } })
          }
          options={[
            { value: 'production_provides', label: 'Production provides' },
            { value: 'talent_brings', label: 'I bring my own' },
          ]}
        />
        <TextArea
          id="water-note"
          label="Water note"
          maxLength={160}
          rows={2}
          value={talent.water.note}
          onChange={(note) => patch({ water: { ...talent.water, note } })}
        />

        <RadioCards
          legend="Assistant"
          name="assistant-need"
          value={talent.assistant.need}
          onChange={(need) =>
            patch({
              assistant: { ...talent.assistant, need: need as TalentTerms['assistant']['need'] },
            })
          }
          options={[
            { value: 'required', label: 'Required' },
            { value: 'not_needed', label: 'Not needed' },
          ]}
        />
        <TextArea
          id="assistant-note"
          label="Assistant note"
          hint={talent.assistant.need === 'required' ? 'Who or what role — handler, PA, photo assistant.' : undefined}
          maxLength={160}
          rows={2}
          placeholder="e.g. Handler or PA from call through wrap."
          value={talent.assistant.note}
          onChange={(note) => patch({ assistant: { ...talent.assistant, note } })}
        />

        <TextArea
          id="sensory"
          label="On-set notes (optional)"
          hint="Noise, lighting, crowd, wait times. Optional — skip if you have nothing to add."
          maxLength={240}
          rows={3}
          value={talent.sensoryNotes}
          onChange={(sensoryNotes) => patch({ sensoryNotes })}
        />
        <TextArea
          id="other-notes"
          label="Other rider notes"
          hint="Tech, wardrobe, access, call sheet timing."
          maxLength={240}
          rows={3}
          value={talent.otherNotes}
          onChange={(otherNotes) => patch({ otherNotes })}
        />
      </section>

      <section id="send" className="form-section">
        <h2>
          <span>05</span> Send
        </h2>
        <p className="lede">
          Optional name and date. Production countersigns on the conforme after they fill the job.
        </p>
        <div className="grid-2">
          <TextField
            id="talent-sig"
            label="Sign as (optional)"
            value={talent.talentSignature}
            placeholder={talent.talentName || 'Your name'}
            onChange={(talentSignature) => patch({ talentSignature })}
          />
          <TextField
            id="issued"
            label="Date issued"
            type="date"
            value={talent.issuedDate}
            onChange={(issuedDate) => patch({ issuedDate })}
          />
        </div>
        <p className="field-hint">
          Copy the client link. Fee, hours, and rider go over in black and white — they add production name,
          location, call time, and answers.
        </p>
      </section>

      <p className="section-skip">
        {TALENT_SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </p>
    </form>
  )
}
