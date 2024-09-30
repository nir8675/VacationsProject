import express, { Request, Response, NextFunction } from "express";
import { UsersModel } from "../3-models/users-model";
import { userService } from "../4-services/user-service";
import { StatusCode } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";

class UserController {
  public readonly router = express.Router();

  public constructor() {
    // Routes for user registration and login are set up here
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
  }

  // Registers a new user by accepting user details from the request body,
  // calling the user service, and returning a token upon successful registration.
  private async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const user = new UsersModel(request.body);
      const token = await userService.register(user);
      response.status(StatusCode.Created).json(token); // Responds with a 201 status and a token
    } catch (err: any) {
      next(err); // Passes any errors to the error handling middleware
    }
  }

  // Logs in a user by accepting login credentials, authenticating them,
  // and returning a token upon successful login.
  private async login(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const credentials = new CredentialsModel(request.body);
      const token = await userService.login(credentials);
      response.json(token); // Responds with the authentication token
    } catch (err: any) {
      next(err); // Passes any errors to the error handling middleware
    }
  }
}

export const userController = new UserController();
