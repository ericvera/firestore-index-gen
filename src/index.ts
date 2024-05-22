#! /usr/bin/env node
import { findUp, pathExists } from 'find-up'
import { readFile } from 'fs/promises'
import { getFirestoreEmulatorPort } from './getFirestoreEmulatorPort.js'
import { getFirestoreIndexesPath } from './getFirestoreIndexesPath.js'

const projectId = process.argv[2]

if (!projectId) {
  console.error('Project ID is required')
  console.error('Usage: firestore-index-gen <project-id>')
  process.exit(1)
}

// Find firebase.json as path to firestore.indexes.json may be defined there
const firebasaeConfigPath = await findUp('firebase.json')

if (firebasaeConfigPath) {
  console.log('firebase.json found at:', firebasaeConfigPath)
} else {
  console.error('firebase.json not found')
  process.exit(1)
}

const firebaseConfigRaw = await readFile(firebasaeConfigPath, 'utf8')

if (!firebaseConfigRaw) {
  console.error('firebase.json is empty')
  process.exit(1)
}

const firebaseConfig: unknown = JSON.parse(firebaseConfigRaw)
const indexesPath =
  getFirestoreIndexesPath(firebaseConfig, firebasaeConfigPath) ??
  // If not found in firebase.json, try to find firestore.indexes.json in the
  // project root
  (await findUp('firestore.indexes.json'))

const indexesFileExist =
  indexesPath !== undefined && (await pathExists(indexesPath))

const indexesContent = indexesFileExist
  ? await readFile(indexesPath, 'utf8')
  : undefined

const firestoreEmulatorPort = getFirestoreEmulatorPort(firebaseConfig)

const indexesUrl = `http://127.0.0.1:${firestoreEmulatorPort.toString()}/emulator/v1/projects/${projectId}:indexUsage?database=projects/${projectId}/databases/(default)`

let indexesResponse
try {
  indexesResponse = await fetch(indexesUrl)
} catch (e) {
  console.error('Error fetching indexes:', e)
}

console.log('Hello!')
console.log('process.cwd()', process.cwd())
console.log('indexedPath:', indexesPath)
console.log('indexedPath exists:', indexesFileExist)
console.log('indexedPath content:', indexesContent)
console.log('indexes url:', indexesUrl)
console.log('indexes response:', await indexesResponse?.json())
console.log('Bye!')
