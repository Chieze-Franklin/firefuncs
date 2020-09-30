export function composeFunctionName(target: any, propertyKey: string) {
    return `${target.constructor.name}_${propertyKey}`;
}
