import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../3-models/enums";
import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";

class SecurityMiddleware {
  // Prevent XSS attack:
  public preventXssAttack(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    for (const prop in request.body) {
      const value = request.body[prop];
      if (typeof value === "string" && value.includes("<script")) {
        response.status(StatusCode.Forbidden).send("Nice try!");
        return;
      }
    }

    next(); // Continue the request to the next middleware.
  }

  // Validate token:
  public validateLogin(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Take header:
    const authorizationHeader = request.headers.authorization;

    // Check if the header exists:
    if (!authorizationHeader) {
      next(new UnauthorizedError("You must be logged in to access this page."));
      return;
    }

    // Extract token: "Bearer the-token..."
    const token = authorizationHeader.substring(7); // Skip "Bearer "

    // Check if token exists:
    if (!token) {
      next(new UnauthorizedError("You must be logged in to access this page."));
      return;
    }

    // Check if valid:
    const isValid = cyber.isTokenValid(token);

    // If not valid:
    if (!isValid) {
      next(new UnauthorizedError("You are not logged in."));
      return;
    }

    // If valid, decode the token to extract user information:
    const userInfo = cyber.decodeToken(token); // Assume this function extracts user info like userId, role, etc.

    if (!userInfo) {
      next(new UnauthorizedError("Invalid token."));
      return;
    }

    // Add user info to the request object:
    (request as any).user = userInfo;

    // Continue to the next middleware or route handler:
    next();
  }

  // Validate admin:
  public validateAdmin(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Take header:
    const authorizationHeader = request.headers.authorization;

    // Check if the header exists:
    if (!authorizationHeader) {
      console.log("Authorization header missing.");
      next(new UnauthorizedError("You must be logged in to access this page."));
      return;
    }

    // Extract token: "Bearer the-token..."
    const token = authorizationHeader.substring(7); // Skip "Bearer "

    // Check if token exists:
    if (!token) {
      console.log("Token is missing.");
      next(new UnauthorizedError("You are not allowed."));
      return;
    }

    // Check if valid:
    const isValid = cyber.isTokenValid(token);

    // If not valid:
    if (!isValid) {
      console.log("Token is not valid.");
      next(new UnauthorizedError("You are not allowed."));
      return;
    }

    // Check if admin:
    const isAdmin = cyber.isAdmin(token);

    // If not admin:
    if (!isAdmin) {
      console.log("User is not an admin.");
      next(new UnauthorizedError("You are not authorized."));
      return;
    }

    next(); // Continue to the next middleware or route handler
  }
}

export const securityMiddleware = new SecurityMiddleware();
