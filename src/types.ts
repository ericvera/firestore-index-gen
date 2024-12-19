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
export type Order = 'ASCENDING' | 'DESCENDING'

export interface FirestoreIndexLike {
  collectionGroup?: string
  queryScope?: QueryScope
  fields?: {
    fieldPath?: string
    order?: Order
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
