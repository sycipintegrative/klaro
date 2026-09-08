import type {
  AssistantAnswer,
  AssistantNeed,
  ClientBooking,
  FoodAnswer,
  FoodNeed,
  HoursAnswer,
  NeedLevel,
  TalentTerms,
  WaterAnswer,
  WaterNeed,
} from './types'

export type RiderKey = 'restroom' | 'holding' | 'food' | 'water' | 'assistant' | 'hours'

export type Option = { value: string; label: string }

function join(base: string, note: string): string {
  const trimmed = note.trim()
  if (!trimmed) return base
  const baseLower = base.toLowerCase()
  const noteLower = trimmed.toLowerCase()
  if (baseLower.includes(noteLower)) return base
  if (noteLower.includes(baseLower)) return trimmed
  return `${base} ${trimmed}`
}

function needWord(need: NeedLevel): string {
  if (need === 'required') return 'Required'
  if (need === 'preferred') return 'Preferred'
  return 'Not requested'
}

export function restroomTalentLine(need: NeedLevel, note: string): string {
  const base =
    need === 'required'
      ? 'Restroom access within a short walk of set is required.'
      : need === 'preferred'
        ? 'Restroom access within a short walk of set is preferred.'
        : 'Restroom access is not a condition of this booking.'
  return join(base, note)
}

export function holdingTalentLine(need: NeedLevel, note: string): string {
  const base =
    need === 'required'
      ? 'A holding or quiet room is required for this booking.'
      : need === 'preferred'
        ? 'A holding or quiet room is preferred when the location allows.'
        : 'A holding or quiet room is not required.'
  return join(base, note)
}

export function foodTalentLine(need: FoodNeed, note: string): string {
  const base =
    need === 'production_provides'
      ? 'Meals are provided by production.'
      : need === 'talent_brings'
        ? 'Talent will bring their own meals. A meal break still belongs on the call sheet.'
        : 'Meals may be provided or talent can bring their own — confirm on the call sheet.'
  return join(base, note)
}

export function waterTalentLine(need: WaterNeed, note: string): string {
  const base =
    need === 'production_provides'
      ? 'Drinking water is provided on set throughout the day.'
      : 'Talent will bring their own water.'
  return join(base, note)
}

export function assistantTalentLine(need: AssistantNeed, note: string): string {
  const base =
    need === 'required'
      ? 'An assistant is required for this booking.'
      : 'No assistant is required from production.'
  return join(base, note)
}

export function hoursTalentLine(talent: TalentTerms): string {
  const hours = talent.maxHours.trim()
  const cap = hours ? `${hours}-hour day` : 'Day length to be confirmed'
  const stop = talent.hardStopNote.trim()
  return stop ? `${cap}. ${stop}` : `${cap}.`
}

export function talentNeedBadge(key: RiderKey, talent: TalentTerms): string {
  switch (key) {
    case 'restroom':
      return needWord(talent.restroom.need)
    case 'holding':
      return needWord(talent.holding.need)
    case 'food':
      return talent.food.need === 'production_provides'
        ? 'Required'
        : talent.food.need === 'talent_brings'
          ? 'Talent brings'
          : 'Flexible'
    case 'water':
      return talent.water.need === 'production_provides' ? 'Required' : 'Talent brings'
    case 'assistant':
      return talent.assistant.need === 'required' ? 'Required' : 'Not requested'
    case 'hours':
      return talent.maxHours.trim() ? `${talent.maxHours}h cap` : 'To confirm'
    default:
      return ''
  }
}

export function talentStatement(key: RiderKey, talent: TalentTerms): string {
  switch (key) {
    case 'restroom':
      return restroomTalentLine(talent.restroom.need, talent.restroom.note)
    case 'holding':
      return holdingTalentLine(talent.holding.need, talent.holding.note)
    case 'food':
      return foodTalentLine(talent.food.need, talent.food.note)
    case 'water':
      return waterTalentLine(talent.water.need, talent.water.note)
    case 'assistant':
      return assistantTalentLine(talent.assistant.need, talent.assistant.note)
    case 'hours':
      return hoursTalentLine(talent)
    default:
      return ''
  }
}

export function clientQuestion(key: RiderKey, talent: TalentTerms): string {
  switch (key) {
    case 'restroom':
      return 'Is there restroom access within a short walk of set?'
    case 'holding':
      return talent.holding.need === 'not_needed'
        ? 'Holding / quiet room was not requested. Any note for the call sheet?'
        : 'Will a holding or quiet room be available on site?'
    case 'food':
      if (talent.food.need === 'talent_brings') {
        return 'Talent will bring their own meals. Will a meal break be on the call sheet?'
      }
      if (talent.food.need === 'flexible') {
        return 'Will meals be provided, or should talent plan to bring their own?'
      }
      return 'Will meals be provided on set?'
    case 'water':
      return talent.water.need === 'talent_brings'
        ? 'Talent will bring their own water. Any note for set?'
        : 'Will drinking water be provided on set throughout the day?'
    case 'assistant':
      return talent.assistant.need === 'required'
        ? 'Can production assign the requested assistant?'
        : 'No assistant was requested. Confirm, or add a name if you are assigning one anyway.'
    case 'hours':
      return talent.maxHours.trim()
        ? `Can this booking meet a ${talent.maxHours}-hour day and the hard stop below?`
        : 'Can production meet the day length and hard stop in the rider?'
    default:
      return ''
  }
}

export function clientOptions(key: RiderKey): Option[] {
  switch (key) {
    case 'restroom':
    case 'holding':
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'arrange', label: "We'll arrange" },
        { value: 'no', label: 'No' },
      ]
    case 'food':
      return [
        { value: 'yes', label: 'Yes — meals provided' },
        { value: 'talent_brings', label: 'Talent brings' },
        { value: 'arrange', label: "We'll arrange" },
        { value: 'none', label: 'None planned' },
      ]
    case 'water':
      return [
        { value: 'yes', label: 'Yes — provided' },
        { value: 'arrange', label: "We'll arrange" },
        { value: 'talent_brings', label: 'Talent brings' },
      ]
    case 'assistant':
      return [
        { value: 'yes', label: 'Yes — assigned' },
        { value: 'no', label: 'No' },
        { value: 'na', label: 'Not applicable' },
      ]
    case 'hours':
      return [
        { value: 'yes', label: 'Yes — we can meet it' },
        { value: 'overtime_written', label: 'OT only in writing' },
        { value: 'no', label: 'No' },
      ]
    default:
      return []
  }
}

export function clientAnswerLine(
  key: RiderKey,
  client: ClientBooking,
): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } {
  const noteFor = (note: string, fallback: string) => (note.trim() ? join(fallback, note) : fallback)

  const map = (
    answer: string,
    yes: string,
    arrange: string,
    no: string,
    note: string,
  ): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } => {
    if (!answer) return { label: 'Not yet answered', tone: 'empty' }
    if (answer === 'yes' || answer === 'na') return { label: noteFor(note, yes), tone: 'yes' }
    if (answer === 'arrange' || answer === 'overtime_written' || answer === 'talent_brings') {
      return { label: noteFor(note, arrange), tone: 'arrange' }
    }
    return { label: noteFor(note, no), tone: 'no' }
  }

  switch (key) {
    case 'restroom':
      return map(
        client.restroom.answer,
        'Yes. Restroom access within a short walk of set.',
        'Production will arrange restroom access before call time.',
        'No restroom access near set — this still needs resolving.',
        client.restroom.note,
      )
    case 'holding':
      return map(
        client.holding.answer,
        'Yes. A holding or quiet room will be available.',
        'Production will arrange holding before call time.',
        'No holding room planned — this still needs resolving.',
        client.holding.note,
      )
    case 'food':
      return foodAnswerLine(client.food.answer, client.food.note)
    case 'water':
      return waterAnswerLine(client.water.answer, client.water.note)
    case 'assistant':
      return assistantAnswerLine(client.assistant.answer, client.assistant.note)
    case 'hours':
      return hoursAnswerLine(client.hours.answer, client.hours.note)
    default:
      return { label: 'Not yet answered', tone: 'empty' }
  }
}

function foodAnswerLine(
  answer: FoodAnswer | '',
  note: string,
): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } {
  const extra = note.trim()
  if (!answer) return { label: 'Not yet answered', tone: 'empty' }
  if (answer === 'yes') {
    return { label: extra ? `Meals provided. ${extra}` : 'Meals provided by production.', tone: 'yes' }
  }
  if (answer === 'talent_brings') {
    return {
      label: extra ? `Talent brings meals. ${extra}` : 'Talent brings meals. Meal break still on the call sheet.',
      tone: 'arrange',
    }
  }
  if (answer === 'arrange') {
    return {
      label: extra ? `Meals to be arranged. ${extra}` : 'Meals will be arranged before call time.',
      tone: 'arrange',
    }
  }
  return { label: extra ? `No meals planned. ${extra}` : 'No meals planned.', tone: 'no' }
}

function waterAnswerLine(
  answer: WaterAnswer | '',
  note: string,
): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } {
  const extra = note.trim()
  if (!answer) return { label: 'Not yet answered', tone: 'empty' }
  if (answer === 'yes') {
    return { label: extra ? `Water provided. ${extra}` : 'Drinking water provided on set.', tone: 'yes' }
  }
  if (answer === 'arrange') {
    return {
      label: extra ? `Water to be arranged. ${extra}` : 'Water will be arranged before call time.',
      tone: 'arrange',
    }
  }
  return { label: extra ? `Talent brings water. ${extra}` : 'Talent brings their own water.', tone: 'arrange' }
}

function assistantAnswerLine(
  answer: AssistantAnswer | '',
  note: string,
): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } {
  const extra = note.trim()
  if (!answer) return { label: 'Not yet answered', tone: 'empty' }
  if (answer === 'yes') {
    return { label: extra ? `Assistant assigned. ${extra}` : 'Assistant assigned by production.', tone: 'yes' }
  }
  if (answer === 'na') {
    return { label: extra ? `Not applicable. ${extra}` : 'No assistant required for this booking.', tone: 'yes' }
  }
  return { label: extra ? `No assistant assigned. ${extra}` : 'No assistant assigned.', tone: 'no' }
}

function hoursAnswerLine(
  answer: HoursAnswer | '',
  note: string,
): { label: string; tone: 'yes' | 'arrange' | 'no' | 'empty' } {
  const extra = note.trim()
  if (!answer) return { label: 'Not yet answered', tone: 'empty' }
  if (answer === 'yes') {
    return {
      label: extra ? `Hours confirmed. ${extra}` : 'Production can meet the day length and hard stop.',
      tone: 'yes',
    }
  }
  if (answer === 'overtime_written') {
    return {
      label: extra
        ? `Overtime only if confirmed in writing. ${extra}`
        : 'Day cap stands. Overtime only if confirmed in writing before call.',
      tone: 'arrange',
    }
  }
  return {
    label: extra ? `Hours not yet met. ${extra}` : 'Production cannot meet the stated day cap as written.',
    tone: 'no',
  }
}

export const RIDER_LABELS: Record<RiderKey, string> = {
  restroom: 'Restroom',
  holding: 'Holding / quiet room',
  food: 'Food',
  water: 'Water',
  assistant: 'Assistant',
  hours: 'Hours / hard stop',
}

export const RIDER_KEYS: RiderKey[] = [
  'restroom',
  'holding',
  'food',
  'water',
  'assistant',
  'hours',
]
