import type { DiscountType, PaymentPreset } from './types'
import { formatPhp } from './format'

export function parseAmount(value: string): number {
  const n = Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : 0
}

export function computeNet(
  fee: string,
  discountType: DiscountType,
  discountValue: string,
): { fee: number; discount: number; net: number } {
  const feeN = Math.max(0, parseAmount(fee))
  const raw = Math.max(0, parseAmount(discountValue))
  let discount = 0
  if (discountType === 'amount') discount = raw
  if (discountType === 'percent') discount = feeN * (raw / 100)
  discount = Math.min(discount, feeN)
  return { fee: feeN, discount, net: feeN - discount }
}

export function paymentLabel(preset: PaymentPreset, custom: string): string {
  switch (preset) {
    case 'fifty_fifty':
      return '50% down / 50% before call time'
    case 'full_before_call':
      return 'Full payment before call time'
    case 'net_15':
      return 'Net 15'
    case 'net_30':
      return 'Net 30'
    case 'gcash_day':
      return 'GCash on the day'
    case 'custom':
      return custom.trim() || 'Custom terms'
    default:
      return '—'
  }
}

export function moneyLines(
  fee: string,
  discountType: DiscountType,
  discountValue: string,
): { feeLine: string; discountLine: string | null; netLine: string } {
  const { fee: feeN, discount, net } = computeNet(fee, discountType, discountValue)
  const feeLine = formatPhp(feeN)
  let discountLine: string | null = null
  if (discountType === 'percent' && parseAmount(discountValue) > 0) {
    discountLine = `Less ${parseAmount(discountValue)}% (${formatPhp(discount)})`
  } else if (discountType === 'amount' && discount > 0) {
    discountLine = `Less ${formatPhp(discount)}`
  }
  return { feeLine, discountLine, netLine: formatPhp(net) }
}
