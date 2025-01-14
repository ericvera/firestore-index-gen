# firestore-index-gen

**CLI that generates a Firestore Index file from queries executed during a Firestore emulator session.**

[![github license](https://img.shields.io/github/license/ericvera/firestore-index-gen.svg?style=flat-square)](https://github.com/ericvera/firestore-index-gen/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/firestore-index-gen.svg?style=flat-square)](https://npmjs.org/package/firestore-index-gen)

> WARNING: The following CLI is built on undocumented functionality that can break without any advance notice so read below to understand what you are getting into.

## Problem

Some Firebase Firestore queries require indexes to be defined before they can be used, but there is no easy way to figure out what those indexes should look like ahead of time.

Firestore's current solution is to fail any queries that require an index and to log a link that automatically creates said index.

The current solution has some drawbacks:

- no easy way to generate the index entries prior to deploying to Firebase
- requires indexes to be deployed one-by-one
- easy to deploy queries without the index

There is an [issue on Github](https://github.com/firebase/firebase-tools/issues/2027), opened March 2020, to add support for indexes to the emulator. The issue is still open and unresolved.

## "Undocumented Solution"

Within that issue there is [a comment by one of the contributors](https://github.com/firebase/firebase-tools/issues/2027#issuecomment-1533866300) that mentions an undocumented feature of the emulator that generates a report that includes a list of indexes that would have been required in order to execute the queries executed during a Firestore emulator session.

URL of the report:
`http://127.0.0.1:8080/emulator/v1/projects/{projectId}:indexUsage?database=projects/{projectId}/databases/(default)`

The author of the comment also makes the following notes:

    Note that the emulator doesn't know about your application's indexes, it simply attempts to create these from a set of theoretically optimal indexes. If your indexes don't match exactly it's still possible that all of your queries are covered by other indexes and will not fail in production.

    Edit: The queries need to be executed to be stored at runtime and it must be a query that isn't automatically indexed (like a single-field query with no ordering). See https://firebase.google.com/docs/firestore/query-data/indexing for more info.

    Disclaimer: this is unlaunched and the functionality might change in backward-incompatible ways.

## Limitations

- Fields with vector configurations are not currently supported by this tool. Contributions to add support for vector fields are welcome!

## Possible solution for generating the indexes with `firestore-index-gen`

> This assumes that **all** of your queries are executed during your testing.

Generate the index by using a command like `firebase --project=firestore-indexes emulators:exec --only auth,firestore 'yarn test /path/to/tests && fig --projectId firestore-indexes --overwrite'`

> Ensure that the projectId matched the ID used when initializing Firebase in your tests.

`firebase --project=firestore-indexes emulators:exec --only auth,firestore <command>` will launch the auth and firestore emulators and execute the provided command.

`yarn test /path/to/tests` should execute all tests that execute queries against Firestore. It is possible to abstract your queries so that they all live in a sub-directory (e.g. `/util/queries/`) to reduce the execution time.

## Possible solution for checking the indexes during CI with `firestore-index-gen`

Run a command like `firebase --project=firestore-indexes emulators:exec --only auth,firestore 'yarn test /path/to/tests && fig --projectId firestore-indexes --check'`

This works just like the command above, except that instead of overwriting the content of `firestore.indexes.json` it compares the indexes from the emulator report and generates a diff. Also, the exit code is set to `1` (or fail) which would block your CI if there are differences.

## CLI

### Install

To install globally (can also be added as a dev dependency to your project):

`npm install --global firestore-index-gen`

### Usage

```console
Usage:
  fig --projectId <projectId> [--overwrite | --check]

Options:
  --help         Print this help message
  --projectId    The Firebase project ID used with the emulator
  --overwrite    Overwrite firestore.indexes.json with the new indexes
  --check        Check if firestore.indexes.json is up to date with the new indexes
```

### `check`

Using `fig --projectId <projectId> --check` within your project, the CLI will printout a diff between the report and your current `firestore.indexes.json` and exit with `1`. If there are no differences the CLI will just print a success message and exit with `0`. This can be used as part of your CI to ensure no code makes it to production without the proper indexes.

### `overwrite`

Using `fig --projectId <projectId> --overwrite` will overwrite your current `firestore.indexes.json` with the indexes reported by the emulator.

v.0
