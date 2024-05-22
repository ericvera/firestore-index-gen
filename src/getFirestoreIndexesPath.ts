export const getFirestoreIndexesPath = (
  firebaseConfig: unknown,
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

  return firebaseConfig.firestore.indexes
}
