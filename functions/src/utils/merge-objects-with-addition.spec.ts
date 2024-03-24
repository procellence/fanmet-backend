import { mergeObjectsWithAddition } from './merge-objects-with-addition';


describe('mergeObjectsWithAddition', () => {
  it('should handle two empty objects', () => {
    const obj1 = {};
    const obj2 = {};
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle one empty object', () => {
    const obj1 = { a: 1 };
    const obj2 = {};
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle objects with no overlapping keys', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle objects with overlapping keys but non-number values', () => {
    const obj1 = { a: 'hello' };
    const obj2 = { a: 'world' };
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle overlapping number keys', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle nested objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { b: 2, c: 3 } };
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });

  it('should handle mixed data types', () => {
    const obj1 = { a: 1, b: 'hello', c: { d: 3 } };
    const obj2 = { a: 2, b: 'world', c: { e: 4 } };
    const result = mergeObjectsWithAddition(obj1, obj2);
    expect(result).toMatchSnapshot();
  });
});
