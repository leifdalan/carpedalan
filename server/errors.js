export class BadRequestError extends Error {
  constructor(message = 'There was an issue with your request') {
    super(message);
    this.message = message;
    this.status = 400;
  }
}
export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.message = message;
    this.status = 403;
    this.errors = [
      {
        type: 'Unauthorized',
        message: 'You are not authorized to make this request',
      },
    ];
  }
}
export class UnauthenticatedError extends Error {
  constructor(message = 'Unauthenticated') {
    super(message);
    this.message = message;
    this.status = 401;
    this.errors = [
      {
        type: 'Unauthorized',
        message: 'You are not authenticated',
      },
    ];
  }
}
export class NotFoundError extends Error {
  constructor(id) {
    super('Not Found');
    this.message = 'Not Found';
    this.status = 404;
    this.errors = [
      {
        resource: id,
        type: 'Not Found',
        message: 'The requested resource was not found',
      },
    ];
  }
}

export class PGError extends BadRequestError {
  constructor(message = 'PG Error') {
    super(message);
    this.message = message;
    this.errors = [
      {
        type: 'PG Error',
        message,
      },
    ];
  }
}
