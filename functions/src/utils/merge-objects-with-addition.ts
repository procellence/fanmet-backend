/**
 * It will merge two objects and if there is common property,
 * it will add the value of the two properties in the output object
 * @param obj1
 * @param obj2
 */
export function mergeObjectsWithAddition(obj1: any, obj2: any): any {
  if (!obj1) return obj2 || null;
  if (!obj2) return obj1;

  const result = {} as any;

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of keys) {
    if (typeof obj1[key] === 'object' && obj1[key] !== null && obj2[key]) {
      result[key] = mergeObjectsWithAddition(obj1[key], obj2[key]);
    } else if (key in obj1 && key in obj2 && typeof obj1[key] === typeof obj2[key]) {
      result[key] = (obj1[key]) + (obj2[key]);
    } else {
      result[key] = obj1[key] || obj2[key];
    }
  }

  return result;
}
