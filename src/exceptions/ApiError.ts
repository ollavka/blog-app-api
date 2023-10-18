type ErrorObj = Record<string, any>;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors: ErrorObj = {},
  ) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message: string, errors: ErrorObj = {}) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized() {
    return new ApiError(401, 'User is not authorized');
  }

  static NotFound() {
    return new ApiError(404, 'Not found');
  }
}
