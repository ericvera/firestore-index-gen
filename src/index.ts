#! /usr/bin/env node
import chalk from 'chalk'
import { writeFile } from 'fs/promises'
import { checkIndexes } from './checkIndexes.js'
import { getEmulatorIndexReport } from './getEmulatorIndexReport.js'
import { getFirebaseConfig } from './getFirebaseConfig.js'
import { getFirestoreIndexes } from './getFirestoreIndexes.js'
import { getIndexFromReport } from './getIndexFromReport.js'
import { getOptions } from './getOptions.js'
import { printHeader } from './printHeader.js'

const { projectId, check, overwrite } = getOptions()

const { path: configPath, config } = await getFirebaseConfig()

// Get current indexes from firestore.indexes.json in the project
const { path: indexesPath, indexes: currentIndexes } =
  await getFirestoreIndexes(config, configPath)

const indexReport = await getEmulatorIndexReport(
  projectId,
  config.emulators?.firestore?.port ?? 8080,
)

const newIndexes = getIndexFromReport(indexReport.reports)

printHeader()

if (check) {
  checkIndexes(currentIndexes, newIndexes)
}

if (overwrite) {
  await writeFile(indexesPath, JSON.stringify(newIndexes, null, 2))

  console.log(
    `${chalk.bgGreen('DONE:')} ${chalk.green(
      'firestore.indexes.json was overwritten with the indexes identified by the Firestore emulator report.',
    )}`,
  )
  console.log()

  process.exit(0)
}
