import { todayManila } from './format'
import type { ClientBooking, TalentTerms } from './types'

export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `k_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function blankTalent(): TalentTerms {
  return {
    id: newId(),
    updatedAt: new Date().toISOString(),
    talentName: '',
    role: 'On-camera talent',
    fee: '',
    discountType: 'none',
    discountValue: '',
    paymentPreset: 'fifty_fifty',
    paymentCustom: '',
    included: '',
    overtimeRate: '',
    maxHours: '10',
    hardStopNote: 'Hard stop at the hour cap, counted from call time. Overtime only if confirmed in writing before call.',
    restroom: {
      need: 'required',
      note: 'Restroom access within a short walk of set is required.',
    },
    holding: {
      need: 'preferred',
      note: 'A holding or quiet room is preferred for resets between setups.',
    },
    food: {
      need: 'production_provides',
      note: '',
    },
    water: {
      need: 'production_provides',
      note: 'Drinking water provided on set throughout the day.',
    },
    assistant: {
      need: 'not_needed',
      note: '',
    },
    sensoryNotes: '',
    otherNotes: '',
    talentSignature: '',
    issuedDate: todayManila(),
  }
}

export function blankClient(): ClientBooking {
  return {
    clientName: '',
    jobTitle: '',
    jobType: 'shoot',
    jobTypeOther: '',
    city: '',
    venue: '',
    dateStart: '',
    dateEnd: '',
    callTime: '',
    wrapTime: '',
    bookingHours: '',
    hoursNote: '',
    restroom: { answer: '', note: '' },
    holding: { answer: '', note: '' },
    food: { answer: '', note: '' },
    water: { answer: '', note: '' },
    assistant: { answer: '', note: '' },
    hours: { answer: '', note: '' },
    clientSignature: '',
    clientSignedDate: todayManila(),
  }
}

export function mergeTalent(partial?: Partial<TalentTerms> | null): TalentTerms {
  const base = blankTalent()
  if (!partial) return base
  return {
    ...base,
    ...partial,
    restroom: { ...base.restroom, ...partial.restroom },
    holding: { ...base.holding, ...partial.holding },
    food: { ...base.food, ...partial.food },
    water: { ...base.water, ...partial.water },
    assistant: { ...base.assistant, ...partial.assistant },
  }
}

export function mergeClient(partial?: Partial<ClientBooking> | null): ClientBooking {
  const base = blankClient()
  if (!partial) return base
  return {
    ...base,
    ...partial,
    restroom: { ...base.restroom, ...partial.restroom },
    holding: { ...base.holding, ...partial.holding },
    food: { ...base.food, ...partial.food },
    water: { ...base.water, ...partial.water },
    assistant: { ...base.assistant, ...partial.assistant },
    hours: { ...base.hours, ...partial.hours },
  }
}
