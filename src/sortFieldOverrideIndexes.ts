import { FieldOverrideIndex } from './types.js'

/**
 * Sort fieldOverride indexes for consistent output
 */
export const sortFieldOverrideIndexes = (
  a: FieldOverrideIndex,
  b: FieldOverrideIndex,
): number => {
  // First sort by queryScope (COLLECTION before COLLECTION_GROUP)
  if (a.queryScope !== b.queryScope) {
    return a.queryScope === 'COLLECTION' ? -1 : 1
  }

  // Then sort by type (order fields before array fields)
  if ('order' in a && 'arrayConfig' in b) {
    return -1
  }

  if ('arrayConfig' in a && 'order' in b) {
    return 1
  }

  // Then sort by the specific value
  if ('order' in a && 'order' in b) {
    return a.order === 'ASCENDING' ? -1 : 1
  }

  return 0
}
