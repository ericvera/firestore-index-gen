import { getCollectionGroup } from './getCollectionGroup.js'
import { logError } from './logError.js'
import { sortFieldOverrideIndexes } from './sortFieldOverrideIndexes.js'
import { sortFirestoreIndexes } from './sortFirestoreIndexes.js'
import {
  EmulatorIndexInfoLike,
  Field,
  FieldOverride,
  FirestoreIndexesLike,
  FirestoreIndexLike,
} from './types.js'

export const getIndexFromReport = (
  reports: Exclude<EmulatorIndexInfoLike['reports'], undefined>,
) => {
  const newIndexes: FirestoreIndexesLike = {
    indexes: [],
    fieldOverrides: [],
  }

  for (const report of reports) {
    const index = report.index

    if (index === undefined) {
      logError('Index report is missing index information.')
      process.exit(1)
    }

    if (index.fields === undefined || index.fields.length === 0) {
      logError('Index report is missing fields information.')
      process.exit(1)
    }

    const fields = index.fields
      // Apparently the __name__ field is included regardless of it being
      // included in the index file.
      // Ref: https://cloud.google.com/firestore/docs/reference/rest/v1/
      //      projects.databases.collectionGroups.indexes
      // One problem is that when it is included the deployment will fail.
      // Ref: https://github.com/firebase/firebase-tools/issues/1483
      .filter(({ fieldPath }) => fieldPath !== '__name__')
      .map(({ fieldPath, order, arrayConfig, vectorConfig }) => {
        let result: Field | undefined

        if (!fieldPath) {
          throw new Error('Field path is required.')
        }

        if (order) {
          result = { fieldPath, order }
        }

        if (arrayConfig) {
          result = { fieldPath, arrayConfig }
        }

        if (vectorConfig) {
          throw new Error('Vector config is not supported yet.')
        }

        if (!result) {
          throw new Error('Invalid field configuration.')
        }

        return result
      })

    const collectionGroup = getCollectionGroup(index.name)
    const { queryScope } = index

    // Handle single-field indexes with COLLECTION_GROUP scope as fieldOverrides
    if (fields.length === 1 && queryScope === 'COLLECTION_GROUP') {
      const field = fields[0]

      if (!field) {
        continue
      }

      // COLLECTION_GROUP scope requires a collectionGroup to be defined
      if (!collectionGroup) {
        logError(
          `Index with COLLECTION_GROUP scope is missing collectionGroup: ${index.name ?? 'unknown'}`,
        )
        process.exit(1)
      }

      // Check if we already have a fieldOverride for this field and collection
      // group
      const existingOverride = newIndexes.fieldOverrides.find(
        (override) =>
          override.collectionGroup === collectionGroup &&
          override.fieldPath === field.fieldPath,
      )

      if (!existingOverride) {
        // Create a new fieldOverride entry
        const fieldOverride: FieldOverride = {
          collectionGroup,
          fieldPath: field.fieldPath,
          ttl: false,
          indexes: [],
        }

        // Add ALL standard COLLECTION scope indexes (ASC, DESC, CONTAINS)
        // Firebase always includes all of these for fieldOverrides
        fieldOverride.indexes.push(
          { order: 'ASCENDING', queryScope: 'COLLECTION' },
          { order: 'DESCENDING', queryScope: 'COLLECTION' },
          { arrayConfig: 'CONTAINS', queryScope: 'COLLECTION' },
        )

        // Add the COLLECTION_GROUP index based on the actual field type
        if ('order' in field) {
          fieldOverride.indexes.push({
            order: field.order,
            queryScope: 'COLLECTION_GROUP',
          })
        } else if ('arrayConfig' in field) {
          fieldOverride.indexes.push({
            arrayConfig: field.arrayConfig,
            queryScope: 'COLLECTION_GROUP',
          })
        }

        // Sort indexes within the fieldOverride for consistent output
        fieldOverride.indexes.sort(sortFieldOverrideIndexes)

        newIndexes.fieldOverrides.push(fieldOverride)
      }
      continue
    }

    // Skip single-field indexes with COLLECTION scope as Firebase handles
    // these automatically
    if (fields.length <= 1) {
      continue
    }

    // Handle composite indexes (2+ fields)
    // COLLECTION_GROUP scope requires a collectionGroup to be defined
    if (queryScope === 'COLLECTION_GROUP' && !collectionGroup) {
      logError(
        `Index with COLLECTION_GROUP scope is missing collectionGroup: ${index.name ?? 'unknown'}`,
      )
      process.exit(1)
    }

    const nextIndex: FirestoreIndexLike = {}

    if (collectionGroup) {
      nextIndex.collectionGroup = collectionGroup
    }

    if (queryScope) {
      nextIndex.queryScope = queryScope
    }

    if (fields.length > 0) {
      nextIndex.fields = fields
    }

    newIndexes.indexes.push(nextIndex)
  }

  // Sort all indexes and fieldOverrides for consistent output
  sortFirestoreIndexes(newIndexes)

  return newIndexes
}
