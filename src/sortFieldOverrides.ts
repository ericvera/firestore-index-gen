import { FieldOverride } from './types.js'

/**
 * Sort fieldOverrides by collectionGroup and fieldPath
 */
export const sortFieldOverrides = (
  a: FieldOverride,
  b: FieldOverride,
): number => {
  // First sort by collectionGroup
  if (a.collectionGroup !== b.collectionGroup) {
    return a.collectionGroup < b.collectionGroup ? -1 : 1
  }
  // Then sort by fieldPath
  return a.fieldPath < b.fieldPath ? -1 : 1
}
