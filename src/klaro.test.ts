import { describe, expect, it } from 'vitest'
import { decodeConforme, decodeTerms, encodeConforme, encodeTerms } from './encoding'
import { formatDate, formatTime } from './format'
import { computeNet, paymentLabel } from './money'
import { clientQuestion, talentStatement } from './rider'
import { sampleClient, sampleTalent } from './sample'

describe('money', () => {
  it('computes percent discount and never goes negative', () => {
    expect(computeNet('18000', 'percent', '10')).toEqual({
      fee: 18000,
      discount: 1800,
      net: 16200,
    })
    expect(computeNet('1000', 'amount', '5000').net).toBe(0)
  })

  it('labels payment presets', () => {
    expect(paymentLabel('fifty_fifty', '')).toBe('50% down / 50% before call time')
    expect(paymentLabel('custom', 'GCash 40% now')).toBe('GCash 40% now')
  })
})

describe('format', () => {
  it('formats Manila dates and PH times', () => {
    expect(formatDate('2026-08-25')).toBe('25 Aug 2026')
    expect(formatTime('06:00')).toBe('6:00 AM')
    expect(formatTime('12:00')).toBe('12:00 NN')
    expect(formatTime('00:00')).toBe('12:00 MN')
    expect(formatTime('16:00')).toBe('4:00 PM')
  })
})

describe('encoding', () => {
  it('round-trips talent terms', () => {
    const talent = sampleTalent()
    const decoded = decodeTerms(encodeTerms(talent))
    expect(decoded?.talentName).toBe('Jordan Cruz')
    expect(decoded?.restroom.need).toBe('required')
    expect(decoded?.fee).toBe('18000')
  })

  it('round-trips a conforme', () => {
    const packet = { talent: sampleTalent(), client: sampleClient() }
    const decoded = decodeConforme(encodeConforme(packet))
    expect(decoded?.client.city).toBe('Makati City')
    expect(decoded?.client.restroom.answer).toBe('yes')
    expect(decoded?.talent.role).toBe('On-camera talent')
  })

  it('does not treat terms payload as a conforme', () => {
    expect(decodeConforme(encodeTerms(sampleTalent()))).toBeNull()
  })
})

describe('rider copy', () => {
  it('writes producer-facing talent lines and client questions', () => {
    const talent = sampleTalent()
    expect(talentStatement('restroom', talent)).toContain('short walk of set is required')
    expect(clientQuestion('restroom', talent)).toBe(
      'Is there restroom access within a short walk of set?',
    )
    expect(clientQuestion('hours', talent)).toContain('10-hour day')
    const restroom = talentStatement('restroom', talent)
    expect(restroom.match(/required/gi)?.length).toBe(1)
    expect(restroom).toContain('Confirm on the call sheet')
  })
})
