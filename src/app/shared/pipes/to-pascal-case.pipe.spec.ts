import { ToPascalCasePipe } from './to-pascal-case.pipe';

describe('ToPascalCasePipe', () => {
  it('create an instance', () => {
    const pipe = new ToPascalCasePipe();
    expect(pipe).toBeTruthy();
  });
});
