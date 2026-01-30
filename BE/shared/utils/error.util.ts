export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// export const asyncHandler =
//   (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(fn(req, res, next)).catch(next);

