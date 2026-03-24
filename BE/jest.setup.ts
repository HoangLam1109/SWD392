jest.mock('nanoid', () => ({
  customAlphabet: (_: any, size: number) => () =>
    Math.random()
      .toString(36)
      .substring(2, 2 + size),
}));
