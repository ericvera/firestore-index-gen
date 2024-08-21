import { logError } from './logError.js'
import { EmulatorIndexInfoLike as EmulatorIndexReportLike } from './types.js'

export const getEmulatorIndexReport = async (
  projectId: string,
  port: number,
): Promise<EmulatorIndexReportLike> => {
  const indexesUrl = `http://127.0.0.1:${port.toString()}/emulator/v1/projects/${projectId}:indexUsage?database=projects/${projectId}/databases/(default)`

  let indexesResponse

  try {
    indexesResponse = await fetch(indexesUrl)
  } catch {
    logError(
      `Error fetching indexes. Ensure that the Firestore emulator is running at ${new URL(indexesUrl).origin}`,
    )

    process.exit(1)
  }

  const content = (await indexesResponse.json()) as EmulatorIndexReportLike

  if (
    typeof content !== 'object' ||
    !Array.isArray(content.reports) ||
    content.reports.length === 0
  ) {
    logError('No indexes found in the Firestore emulator report.')
    process.exit(1)
  }

  return content
}
