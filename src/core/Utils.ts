export class Utils {
  static flatObject(input: Record<string, any>): Record<string, any> {
    function flat(res: any, key: string, val: any, pre = ''): Record<string, any> {
      const prefix = [pre, key].filter((v) => v).join('.');

      return val && typeof val === 'object'
        ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
        : Object.assign(res, { [prefix]: val });
    }

    return Object.keys(input).reduce((prev: object, curr: string) => flat(prev, curr, input[curr]), {});
  }
}
