import type { HTMLAttributes, ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  hint?: string
  children: ReactNode
}

export function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type InputProps = {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
  autoComplete?: string
}

export function TextField({
  id,
  label,
  hint,
  value,
  onChange,
  type = 'text',
  placeholder,
  inputMode,
  maxLength,
  autoComplete,
}: InputProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

type AreaProps = {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  maxLength?: number
  placeholder?: string
}

export function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 3,
  maxLength,
  placeholder,
}: AreaProps) {
  const remaining = maxLength ? maxLength - value.length : null
  return (
    <Field
      id={id}
      label={label}
      hint={hint ?? (remaining !== null ? `${remaining} characters left` : undefined)}
    >
      <textarea
        id={id}
        className="input input-area"
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-describedby={`${id}-hint`}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

type Option = { value: string; label: string; hint?: string }

type RadiosProps = {
  legend: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  hint?: string
}

export function RadioCards({ legend, name, value, onChange, options, hint }: RadiosProps) {
  return (
    <fieldset className="radio-fieldset">
      <legend className="field-label">{legend}</legend>
      {hint ? <p className="field-hint">{hint}</p> : null}
      <div className="radio-row" role="radiogroup" aria-label={legend}>
        {options.map((option) => {
          const id = `${name}-${option.value || 'empty'}`
          return (
            <label key={option.value} className={`radio-card${value === option.value ? ' is-on' : ''}`} htmlFor={id}>
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="radio-card-label">{option.label}</span>
              {option.hint ? <span className="radio-card-hint">{option.hint}</span> : null}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
