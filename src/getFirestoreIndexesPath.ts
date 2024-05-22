import * as path from 'path'

export const getFirestoreIndexesPath = (
  firebaseConfig: unknown,
  firebaseConfigPath: string,
): string | undefined => {
  if (typeof firebaseConfig !== 'object' || firebaseConfig === null) {
    return undefined
  }

  if (
    !('firestore' in firebaseConfig) ||
    typeof firebaseConfig.firestore !== 'object' ||
    firebaseConfig.firestore === null
  ) {
    return undefined
  }

  if (
    !('indexes' in firebaseConfig.firestore) ||
    typeof firebaseConfig.firestore.indexes !== 'string'
  ) {
    return undefined
  }

  return path.join(
    path.dirname(firebaseConfigPath),
    firebaseConfig.firestore.indexes,
  )
}
