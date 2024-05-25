import chalk from 'chalk'

export const logError = (error: unknown) => {
  console.log()

  if (error instanceof Error) {
    console.error(chalk.bgRed(`ERROR: ${error.message}`))
  } else {
    console.error(chalk.bgRed('ERROR:', error))
  }
}
