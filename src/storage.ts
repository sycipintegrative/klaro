import type { TalentTerms } from './types'

const KEY = 'klaro.v1'

export type KlaroStore = {
  schema: 1
  currentUserId: null
  talentTerms: Record<string, TalentTerms>
  activeTermsId: string | null
}

function emptyStore(): KlaroStore {
  return {
    schema: 1,
    currentUserId: null,
    talentTerms: {},
    activeTermsId: null,
  }
}

export function loadStore(): KlaroStore {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as KlaroStore
    if (parsed.schema !== 1) return emptyStore()
    return {
      ...emptyStore(),
      ...parsed,
      talentTerms: parsed.talentTerms ?? {},
    }
  } catch {
    return emptyStore()
  }
}

export function saveStore(store: KlaroStore): void {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function saveTalent(terms: TalentTerms): void {
  const store = loadStore()
  store.talentTerms[terms.id] = { ...terms, updatedAt: new Date().toISOString() }
  store.activeTermsId = terms.id
  saveStore(store)
}

export function loadActiveTalent(): TalentTerms | null {
  const store = loadStore()
  if (!store.activeTermsId) return null
  return store.talentTerms[store.activeTermsId] ?? null
}

export function hasSavedTalent(): boolean {
  return loadActiveTalent() !== null
}
