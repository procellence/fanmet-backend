import { replaceRange } from './utils';

describe('Replace range test', () => {

  it('case 1', () => {
    expect(replaceRange('abcdefghij', 2, 3, 'xy')).toBe('axydefghij');
  });

  it('case 2', () => {
    expect(replaceRange('abcdefghij', 1, 3, 'xy')).toBe('xydefghij');
  });

  it('case 3', () => {
    expect(replaceRange('abcdefghij', 1, 9, 'xy')).toBe('xyj');
  });
});
