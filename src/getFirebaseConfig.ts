import { findUp } from 'find-up'
import { readFile } from 'node:fs/promises'
import { isAbsolute } from 'node:path'
import { logError } from './logError.js'
import { FirebaseConfigLike } from './types.js'

export const getFirebaseConfig = async (
  configPath?: string,
): Promise<{
  path: string
  config: FirebaseConfigLike
}> => {
  // Find firebase.json as path to firestore.indexes.json may be defined there
  const path = configPath
    ? isAbsolute(configPath)
      ? configPath
      : await findUp(configPath)
    : await findUp('firebase.json')

  if (!path) {
    logError(
      'firebase.json not found. Ensure that you are in a directory with Firebase already initialized.',
    )
    process.exit(1)
  }

  const firebaseConfigRaw = await readFile(path, 'utf8')

  if (!firebaseConfigRaw) {
    logError(
      'firebase.json is empty. Ensure that you are in a directory with Firebase already initialized.',
    )
    process.exit(1)
  }

  const config: unknown = JSON.parse(firebaseConfigRaw)

  if (typeof config !== 'object' || config === null) {
    logError(
      'firebase.json is not an object as expected. Ensure that it is valid JSON file.',
    )
    process.exit(1)
  }

  return {
    config,
    path,
  }
}
