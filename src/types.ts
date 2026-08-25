export const JOB_TYPES = ['shoot', 'engagement', 'workshop', 'other'] as const
export type JobType = (typeof JOB_TYPES)[number]

export const PAYMENT_PRESETS = [
  'fifty_fifty',
  'full_before_call',
  'net_15',
  'net_30',
  'gcash_day',
  'custom',
] as const
export type PaymentPreset = (typeof PAYMENT_PRESETS)[number]

export const DISCOUNT_TYPES = ['none', 'amount', 'percent'] as const
export type DiscountType = (typeof DISCOUNT_TYPES)[number]

export const NEED_LEVELS = ['required', 'preferred', 'not_needed'] as const
export type NeedLevel = (typeof NEED_LEVELS)[number]

export const FOOD_NEEDS = ['production_provides', 'talent_brings', 'flexible'] as const
export type FoodNeed = (typeof FOOD_NEEDS)[number]

export const WATER_NEEDS = ['production_provides', 'talent_brings'] as const
export type WaterNeed = (typeof WATER_NEEDS)[number]

export const ASSISTANT_NEEDS = ['required', 'not_needed'] as const
export type AssistantNeed = (typeof ASSISTANT_NEEDS)[number]

export const RESTROOM_ANSWERS = ['yes', 'arrange', 'no'] as const
export type RestroomAnswer = (typeof RESTROOM_ANSWERS)[number]

export const HOLDING_ANSWERS = ['yes', 'arrange', 'no'] as const
export type HoldingAnswer = (typeof HOLDING_ANSWERS)[number]

export const FOOD_ANSWERS = ['yes', 'talent_brings', 'arrange', 'none'] as const
export type FoodAnswer = (typeof FOOD_ANSWERS)[number]

export const WATER_ANSWERS = ['yes', 'talent_brings', 'arrange'] as const
export type WaterAnswer = (typeof WATER_ANSWERS)[number]

export const ASSISTANT_ANSWERS = ['yes', 'no', 'na'] as const
export type AssistantAnswer = (typeof ASSISTANT_ANSWERS)[number]

export const HOURS_ANSWERS = ['yes', 'overtime_written', 'no'] as const
export type HoursAnswer = (typeof HOURS_ANSWERS)[number]

export type TalentTerms = {
  id: string
  updatedAt: string
  talentName: string
  role: string
  fee: string
  discountType: DiscountType
  discountValue: string
  paymentPreset: PaymentPreset
  paymentCustom: string
  included: string
  overtimeRate: string
  maxHours: string
  hardStopNote: string
  restroom: { need: NeedLevel; note: string }
  holding: { need: NeedLevel; note: string }
  food: { need: FoodNeed; note: string }
  water: { need: WaterNeed; note: string }
  assistant: { need: AssistantNeed; note: string }
  sensoryNotes: string
  otherNotes: string
  talentSignature: string
  issuedDate: string
}

export type ClientBooking = {
  clientName: string
  jobTitle: string
  jobType: JobType
  jobTypeOther: string
  city: string
  venue: string
  dateStart: string
  dateEnd: string
  callTime: string
  wrapTime: string
  bookingHours: string
  hoursNote: string
  restroom: { answer: RestroomAnswer | ''; note: string }
  holding: { answer: HoldingAnswer | ''; note: string }
  food: { answer: FoodAnswer | ''; note: string }
  water: { answer: WaterAnswer | ''; note: string }
  assistant: { answer: AssistantAnswer | ''; note: string }
  hours: { answer: HoursAnswer | ''; note: string }
  clientSignature: string
  clientSignedDate: string
}

export type Conforme = {
  talent: TalentTerms
  client: ClientBooking
}

export const TALENT_SECTIONS = [
  { id: 'you', label: 'You' },
  { id: 'fee', label: 'Fee' },
  { id: 'hours', label: 'Hours' },
  { id: 'rider', label: 'Rider' },
  { id: 'send', label: 'Send' },
] as const

export const CLIENT_SECTIONS = [
  { id: 'production', label: 'Production' },
  { id: 'job', label: 'Job' },
  { id: 'when', label: 'When & where' },
  { id: 'rider', label: 'Rider' },
  { id: 'sign', label: 'Conforme' },
] as const
