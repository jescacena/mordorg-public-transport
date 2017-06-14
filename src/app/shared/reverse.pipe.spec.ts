import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {

  it('should be created', () => {
    let reversePipe = new ReversePipe();
    expect(reversePipe.transform('hello')).toEqual('olleh');
  });
});
