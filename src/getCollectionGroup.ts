import { logError } from './logError.js'

export const getCollectionGroup = (indexName: string | undefined): string => {
  const collectionGroup = indexName?.split('/')[5]

  if (collectionGroup === undefined) {
    logError('Index name is missing collection group information.')
    process.exit(1)
  }

  return collectionGroup
}
