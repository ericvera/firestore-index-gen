import { FirestoreIndexesLike } from './types.js'
import { jsonCompare } from './jsonCompare.js'
import { sortFieldOverrides } from './sortFieldOverrides.js'
import { sortFieldOverrideIndexes } from './sortFieldOverrideIndexes.js'

/**
 * Sort all indexes and fieldOverrides in a FirestoreIndexesLike object
 */
export const sortFirestoreIndexes = (indexes: FirestoreIndexesLike): void => {
  // Sort composite indexes by collectionGroup and fields
  indexes.indexes.sort(jsonCompare)

  // Sort fieldOverrides by collectionGroup and fieldPath
  indexes.fieldOverrides.sort(sortFieldOverrides)

  // Sort indexes within each fieldOverride for consistent output
  indexes.fieldOverrides.forEach((override) => {
    override.indexes.sort(sortFieldOverrideIndexes)
  })
}
