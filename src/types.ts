export interface FirebaseConfigLike {
  firestore?: {
    indexes?: string
  }
  emulators?: {
    firestore?: {
      port?: number
    }
  }
}

type QueryScope = 'COLLECTION' | 'COLLECTION_GROUP'
type Order = 'ASCENDING' | 'DESCENDING'

export interface FirestoreIndexLike {
  collectionGroup?: string | undefined
  queryScope?: QueryScope | undefined
  fields?: {
    fieldPath?: string | undefined
    order?: Order | undefined
  }[]
}

export interface FirestoreIndexesLike {
  indexes?: FirestoreIndexLike[]
  fieldOverrides?: unknown[]
}

export interface EmulatorIndexInfoLike {
  reports: {
    index?: {
      name?: string
      queryScope?: QueryScope
      fields?: {
        fieldPath?: string
        order?: Order
      }[]
    }
    numQueries?: number
  }[]
}
