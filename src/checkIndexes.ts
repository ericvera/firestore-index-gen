import chalk from 'chalk'
import { diff } from 'jest-diff'
import { FirestoreIndexesLike } from './types.js'

export const checkIndexes = (
  currentIndex: FirestoreIndexesLike,
  newIndex: FirestoreIndexesLike,
) => {
  const differences = diff(currentIndex, newIndex, {
    aAnnotation: 'In firestore.indexes.json but not in emulator report',
    bAnnotation: 'In emulator report but not in firestore.indexes.json',
  })

  if (differences?.includes('Compared values have no visual difference')) {
    console.log(
      `${chalk.bgGreen('MATCH:')} ${chalk.green(
        'No differences found between firestore.indexes.json and the Firestore emulator report.',
      )}`,
    )
    console.log()

    process.exit(0)
  }

  if (differences) {
    console.error(
      `${chalk.bgRed('NOT A MATCH:')} ${chalk.red(
        'There were differences found between firestore.indexes.json and the Firestore emulator report. Update the indexes using the --overwrite flag in the firestore-indexes-gen CLI.',
      )}`,
    )
    console.error()
    console.error(differences)
    console.error()

    process.exit(1)
  }
}
