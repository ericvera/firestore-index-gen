import chalk from 'chalk'
import { parseArgs } from 'node:util'
import { logError } from './logError.js'
import { printHeader } from './printHeader.js'

interface Options {
  projectId: string
  help: boolean
  overwrite: boolean
  check: boolean
  print: boolean
}

type OptionsInfo = Record<keyof Options, string>

const optionsInfo: OptionsInfo = {
  help: 'Print this help message',
  projectId: 'The Firebase project ID used with the emulator',
  overwrite: 'Overwrite firestore.indexes.json with the new indexes',
  check: 'Check if firestore.indexes.json is up to date with the new indexes',
  print: 'Print the current emulator index content',
}

const printUsage = () => {
  printHeader()

  console.log('Usage:')
  console.log('  fig --projectId <projectId> [--overwrite | --check | --print]')
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
        print: {
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

  const { projectId, help, overwrite, check, print } = args.values

  if (
    help ||
    typeof projectId === 'undefined' ||
    typeof overwrite === 'undefined' ||
    typeof check === 'undefined' ||
    typeof print === 'undefined'
  ) {
    console.log()
    console.log(chalk.bgYellow('WARNING: Missing required options'))

    printUsage()
    process.exit(1)
  }

  const optionCount = [overwrite, check, print].filter(Boolean).length

  if (optionCount > 1) {
    logError('Can only use one of --overwrite, --check, or --print options')

    printUsage()
    process.exit(1)
  }

  if (optionCount === 0) {
    logError('One of --overwrite, --check, or --print is required')

    printUsage()
    process.exit(1)
  }

  return {
    projectId,
    overwrite,
    check,
    print,
  }
}
