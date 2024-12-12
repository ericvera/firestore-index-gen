export const jsonCompare = (a: unknown, b: unknown) => {
  return JSON.stringify(a) < JSON.stringify(b) ? -1 : 1
}
