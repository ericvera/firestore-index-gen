#! /usr/bin/env node
import { findUp } from 'find-up'

const indexPath = findUp('firebase.index.json')

console.log('Hello!')
console.log('@:', __dirname)
console.log('indexPath:', indexPath)
console.log('Bye!')
