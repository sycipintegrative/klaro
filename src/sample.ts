import { mergeClient, mergeTalent } from './defaults'
import type { ClientBooking, TalentTerms } from './types'

export function sampleTalent(): TalentTerms {
  return mergeTalent({
    id: 'sample-jordan-cruz',
    talentName: 'Jordan Cruz',
    role: 'On-camera talent',
    fee: '18000',
    discountType: 'none',
    discountValue: '',
    paymentPreset: 'fifty_fifty',
    included:
      'Full-day on-camera appearance, scheduled fitting, and campaign stills for this job only. Extended buyout billed separately.',
    overtimeRate:
      '₱2,500 / hour after hard stop, billed in 30-minute increments, confirmed in writing before call.',
    maxHours: '10',
    hardStopNote:
      '10-hour day including makeup and wait. Hard stop 10 hours from call time.',
    restroom: {
      need: 'required',
      note: 'Restroom access within a short walk of set is required. Confirm on the call sheet.',
    },
    holding: {
      need: 'required',
      note: 'A holding or quiet room is required for resets — not an open bay or hallway.',
    },
    food: {
      need: 'production_provides',
      note: 'Meals provided on set. Breakfast if call is before 7:00 AM; lunch by 12:00 NN. No shellfish.',
    },
    water: {
      need: 'production_provides',
      note: 'Drinking water provided on set and in holding throughout the day.',
    },
    assistant: {
      need: 'required',
      note: 'Handler or PA assigned to talent from call through wrap.',
    },
    sensoryNotes:
      'Avoid continuous loud playback in holding. Flag crowd or wait times longer than 45 minutes.',
    otherNotes:
      'Confirm a chair and power for hair-makeup. Call sheet at least 24 hours before call.',
    talentSignature: 'Jordan Cruz',
    issuedDate: '2026-08-18',
  })
}

export function sampleClient(): ClientBooking {
  return mergeClient({
    clientName: 'Tala Production House for SM Lifestyle',
    jobTitle: 'SM Women — “Handa sa Umaga”',
    jobType: 'shoot',
    city: 'Makati City',
    venue: 'The Picasso Boutique Serviced Residences, 2/F penthouse',
    dateStart: '2026-08-25',
    dateEnd: '2026-08-25',
    callTime: '06:00',
    wrapTime: '16:00',
    bookingHours: '10',
    hoursNote: 'Hard stop 4:00 PM. Overtime only if confirmed in writing before call.',
    restroom: {
      answer: 'yes',
      note: 'Restroom on the same floor, about 15 meters from set.',
    },
    holding: {
      answer: 'yes',
      note: 'Bedroom 2 is holding. Door closes; not a pass-through.',
    },
    food: {
      answer: 'yes',
      note: 'Craft: breakfast at 6:00 AM, lunch at 12:00 NN. No shellfish on the table.',
    },
    water: {
      answer: 'yes',
      note: 'Water station in holding and on set.',
    },
    assistant: {
      answer: 'yes',
      note: 'PA Nina Reyes assigned to talent from call to wrap.',
    },
    hours: {
      answer: 'yes',
      note: '10-hour day. Hard stop 4:00 PM.',
    },
    clientSignature: 'Rica Villanueva, Producer',
    clientSignedDate: '2026-08-20',
  })
}
