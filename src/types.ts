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
export type ArrayConfig = 'CONTAINS'

export interface OrderField {
  fieldPath: string
  order: Order
  arrayConfig?: never
  vectorConfig?: never
}

export interface ArrayField {
  fieldPath: string
  arrayConfig: ArrayConfig
  vectorConfig?: never
  order?: never
}

export interface VectorField {
  fieldPath: string
  vectorConfig: unknown
  arrayConfig?: never
  order?: never
}

export type Field = OrderField | ArrayField | VectorField

export interface FirestoreIndexLike {
  collectionGroup?: string
  queryScope?: QueryScope
  fields?: Field[]
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
      fields?: Field[]
    }
    numQueries?: number
  }[]
}
