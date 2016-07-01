import * as _ from 'lodash';

export function replace<T>(o: T): T {
    return _.merge(o, {__replace: true});
}

export function remove(): any {
    return null;
}

export function merge<T>(
    src1: T,
    ...srcN: any[]
): T 
{
    return (_ as any).mergeWith({}, src1, ...srcN, (dest: any, src: any, key: any) => {
        if (src) {
            if (src.__replace) {
                delete src.__replace;
                return src;
            }
        }
        return undefined;
    })
}
