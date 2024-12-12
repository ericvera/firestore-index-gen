import chalk from 'chalk'
import { parseArgs } from 'node:util'
import { logError } from './logError.js'
import { printHeader } from './printHeader.js'

interface Options {
  projectId: string
  help: boolean
  overwrite: boolean
  check: boolean
}

type OptionsInfo = Record<keyof Options, string>

const optionsInfo: OptionsInfo = {
  help: 'Print this help message',
  projectId: 'The Firebase project ID used with the emulator',
  overwrite: 'Overwrite firestore.indexes.json with the new indexes',
  check: 'Check if firestore.indexes.json is up to date with the new indexes',
}

const printUsage = () => {
  printHeader()

  console.log('Usage:')
  // One of --overwrite or --check is required
  console.log('  fig --projectId <projectId> [--overwrite | --check]')
  console.log()
  console.log('Options:')

  const longestOption =
    Math.max(...Object.keys(optionsInfo).map((option) => option.length)) + 2

  for (const [option, description] of Object.entries(optionsInfo)) {
    console.log(`  --${option.padEnd(longestOption)}  ${description}`)
  }

  console.log()
}

export const getOptions = (): Omit<Options, 'help'> => {
  let args

  try {
    args = parseArgs({
      options: {
        help: {
          type: 'boolean',
          default: false,
        },
        projectId: {
          type: 'string',
        },
        overwrite: {
          type: 'boolean',
          default: false,
        },
        check: {
          type: 'boolean',
          default: false,
        },
      },
    })
  } catch (error) {
    logError(error)

    printUsage()
    process.exit(1)
  }

  const { projectId, help, overwrite, check } = args.values

  if (
    help ||
    typeof projectId === 'undefined' ||
    typeof overwrite === 'undefined' ||
    typeof check === 'undefined'
  ) {
    console.log()
    console.log(chalk.bgYellow('WARNING: Missing required options'))

    printUsage()
    process.exit(1)
  }

  if (overwrite && check) {
    logError('Cannot use both --overwrite and --check options')

    printUsage()
    process.exit(1)
  }

  if (!overwrite && !check) {
    logError('One of --overwrite or --check is required')

    printUsage()
    process.exit(1)
  }

  return {
    projectId,
    overwrite,
    check,
  }
}
