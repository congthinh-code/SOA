import { HashCheckMiddleware } from './hash-check.middleware';

describe('HashCheckMiddleware', () => {
  it('should be defined', () => {
    expect(new HashCheckMiddleware()).toBeDefined();
  });
});
