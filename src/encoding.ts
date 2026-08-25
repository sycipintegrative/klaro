import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { mergeClient, mergeTalent } from './defaults'
import type { ClientBooking, Conforme, TalentTerms } from './types'

const PREFIX = 'k1.'

type EncodedTerms = {
  v: 1
  type: 'terms'
  talent: TalentTerms
}

type EncodedConforme = {
  v: 1
  type: 'conforme'
  talent: TalentTerms
  client: ClientBooking
}

function pack(data: unknown): string {
  return PREFIX + compressToEncodedURIComponent(JSON.stringify(data))
}

function unpack(payload: string): unknown | null {
  const raw = payload.startsWith(PREFIX) ? payload.slice(PREFIX.length) : payload
  try {
    const json = decompressFromEncodedURIComponent(raw)
    if (!json) return null
    return JSON.parse(json) as unknown
  } catch {
    return null
  }
}

export function encodeTerms(talent: TalentTerms): string {
  const data: EncodedTerms = { v: 1, type: 'terms', talent }
  return pack(data)
}

export function encodeConforme(conforme: Conforme): string {
  const data: EncodedConforme = {
    v: 1,
    type: 'conforme',
    talent: conforme.talent,
    client: conforme.client,
  }
  return pack(data)
}

export function decodeTerms(payload: string): TalentTerms | null {
  const data = unpack(payload) as EncodedTerms | EncodedConforme | null
  if (!data || typeof data !== 'object') return null
  if (data.type === 'terms' || data.type === 'conforme') {
    return mergeTalent(data.talent)
  }
  return null
}

export function decodeConforme(payload: string): Conforme | null {
  const data = unpack(payload) as EncodedConforme | null
  if (!data || data.type !== 'conforme') return null
  return {
    talent: mergeTalent(data.talent),
    client: mergeClient(data.client),
  }
}

export function payloadFromLocation(search: string, hash: string): {
  terms: string | null
  conforme: string | null
  sample: boolean
} {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const hashValue = hash.startsWith('#') ? hash.slice(1) : hash
  const hashParams = new URLSearchParams(hashValue.includes('=') ? hashValue : '')
  const sample = params.get('sample') === '1' || hashParams.get('sample') === '1'
  const terms =
    params.get('t') || hashParams.get('t') || (hashValue && !hashValue.includes('=') ? hashValue : null)
  const conforme = params.get('b') || hashParams.get('b')
  return { terms, conforme, sample }
}

export function clientLink(origin: string, talent: TalentTerms): string {
  return `${origin}/c?t=${encodeTerms(talent)}`
}

export function conformeLink(origin: string, conforme: Conforme): string {
  return `${origin}/conforme?b=${encodeConforme(conforme)}`
}
