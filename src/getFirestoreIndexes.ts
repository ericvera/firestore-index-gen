import { findUp, pathExists } from 'find-up'
import { readFile } from 'node:fs/promises'
import * as path from 'node:path'
import { jsonCompare } from './jsonCompare.js'
import { logError } from './logError.js'
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

  if (!indexesPath || !(await pathExists(indexesPath))) {
    logError(
      'firestore.indexes.json file not found neither at the location specified in firebase.json nor in the project root',
    )
    process.exit(1)
  }

  const indexesContent = await readFile(indexesPath, 'utf8')
  const indexes = JSON.parse(indexesContent) as FirestoreIndexesLike

  // Sort indexes by collectionGroup and fields
  indexes.indexes?.sort(jsonCompare)
  indexes.fieldOverrides?.sort(jsonCompare)

  return { path: indexesPath, indexes }
}
