import { getCollectionGroup } from './getCollectionGroup.js'
import { jsonCompare } from './jsonCompare.js'
import { logError } from './logError.js'
import {
  EmulatorIndexInfoLike,
  FirestoreIndexesLike,
  FirestoreIndexLike,
  Order,
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
      // Apparently the __name__ field is included regardless of it being included in the index file.
      // Ref: https://cloud.google.com/firestore/docs/reference/rest/v1/projects.databases.collectionGroups.indexes
      // One problem is that when it is included the deployment will fail.
      // Ref: https://github.com/firebase/firebase-tools/issues/1483
      .filter(({ fieldPath }) => fieldPath !== '__name__')
      .map(({ fieldPath, order }) => {
        const result: { fieldPath?: string; order?: Order } = {}

        if (fieldPath) {
          result.fieldPath = fieldPath
        }

        if (order) {
          result.order = order
        }

        return result
      })

    const collectionGroup = getCollectionGroup(index.name)

    const { queryScope } = index

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

    newIndexes.indexes?.push(nextIndex)
  }

  // Sort indexes by collectionGroup and fields
  newIndexes.indexes?.sort(jsonCompare)

  // Sort fieldOverrides by collectionGroup
  newIndexes.fieldOverrides?.sort(jsonCompare)

  return newIndexes
}
