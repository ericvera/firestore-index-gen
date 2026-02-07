import { findUp } from 'find-up'
import { access, readFile } from 'node:fs/promises'
import * as path from 'node:path'
import { logError } from './logError.js'
import { sortFirestoreIndexes } from './sortFirestoreIndexes.js'
import { FirebaseConfigLike, FirestoreIndexesLike } from './types.js'

export const getFirestoreIndexes = async (
  firebaseConfig: FirebaseConfigLike,
  firebaseConfigPath: string,
): Promise<{
  path: string
  indexes: FirestoreIndexesLike
}> => {
  let indexesPath: string | undefined

  if (firebaseConfig.firestore?.indexes) {
    indexesPath = path.join(
      path.dirname(firebaseConfigPath),
      firebaseConfig.firestore.indexes,
    )
  } else {
    // If not found in firebase.json, try to find firestore.indexes.json in the
    // project root (default)
    indexesPath = await findUp('firestore.indexes.json')
  }

  const exists = indexesPath
    ? await access(indexesPath)
        .then(() => true)
        .catch(() => false)
    : false

  if (!indexesPath || !exists) {
    logError(
      'firestore.indexes.json file not found neither at the location specified in firebase.json nor in the project root',
    )
    process.exit(1)
  }

  const indexesContent = await readFile(indexesPath, 'utf8')
  const parsedIndexes = JSON.parse(
    indexesContent,
  ) as Partial<FirestoreIndexesLike>

  // Ensure arrays are always present
  const indexes: FirestoreIndexesLike = {
    indexes: parsedIndexes.indexes ?? [],
    fieldOverrides: parsedIndexes.fieldOverrides ?? [],
  }

  // Sort all indexes and fieldOverrides for consistent output
  sortFirestoreIndexes(indexes)

  return { path: indexesPath, indexes }
}
