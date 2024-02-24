/**
 * generate groups of 4 random characters
 *
 * @example getUniqueId(1) : 607f
 * @example getUniqueId(2) : 95ca-361a
 * @example getUniqueId(4) : 6a22-a5e6-3489-896b
 */
export function getUniqueId(parts: number = 4): string {
  const stringArr = [];
  for (let i = 0; i < parts; i++) {
    // tslint:disable-next-line:no-bitwise
    const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    stringArr.push(S4);
  }
  return stringArr.join('-');
}
