import { StatusCode } from "./enums";

// same as the above!!
// Base class for all client errors:
abstract class ClientError {
  public constructor(public status: number, public message: string) {
    this.message = message;
    this.status = status;
  }
}

// Resource (id) not found error:
export class ResourceNotFoundError extends ClientError {
  public constructor(id: number | string) {
    super(StatusCode.NotFound, `id ${id} not found.`);
  }
}

export class RouteNotFoundError extends ClientError {
  public constructor(route: string, method: string) {
    super(StatusCode.NotFound, `Route ${route} on method ${method} not exist.`);
  }
}

export class ValidationError extends ClientError {
  public constructor(message: string) {
    super(StatusCode.BadRequest, message);
  }
}

export class UnauthorizedError extends ClientError {
  public constructor(message: string) {
    super(StatusCode.Unauthorized, message);
  }
}
