import { TruncatingPipe } from './truncating.pipe';

describe('TruncatingPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatingPipe();
    expect(pipe).toBeTruthy();
  });
});
