const DefaultPort = 8080

export const getFirestoreEmulatorPort = (firebaseConfig: unknown): number => {
  if (typeof firebaseConfig !== 'object' || firebaseConfig === null) {
    return DefaultPort
  }

  if (
    !('emulators' in firebaseConfig) ||
    typeof firebaseConfig.emulators !== 'object' ||
    firebaseConfig.emulators === null
  ) {
    return DefaultPort
  }

  if (
    !('firestore' in firebaseConfig.emulators) ||
    typeof firebaseConfig.emulators.firestore !== 'object' ||
    firebaseConfig.emulators.firestore === null
  ) {
    return DefaultPort
  }

  if (
    !('port' in firebaseConfig.emulators.firestore) ||
    typeof firebaseConfig.emulators.firestore.port !== 'number'
  ) {
    return DefaultPort
  }

  return firebaseConfig.emulators.firestore.port
}
