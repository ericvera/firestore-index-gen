#! /usr/bin/env node
import { findUp } from 'find-up'
import { fileURLToPath } from 'node:url'

const indexPath = findUp('firebase.index.json')

console.log('Hello!')
console.log('@:', fileURLToPath(import.meta.url))
console.log('indexPath:', indexPath)
console.log('Bye!')
