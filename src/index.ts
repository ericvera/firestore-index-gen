#! /usr/bin/env node
import { findUp } from 'find-up'

const indexPath = await findUp('firebase.index.json')

console.log('Hello!')
console.log('process.cwd()', process.cwd())
console.log('indexPath:', indexPath)
console.log('Bye!')
