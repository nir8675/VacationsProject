import jwt, { SignOptions } from "jsonwebtoken";
import { UsersModel } from "../3-models/users-model";
import { Role } from "../3-models/enums";
import crypto from "crypto";

class Cyber {
  // Secret key:
  private secretKey = "TheAmazing4578-99Students!";

  private hashingSalt = "MakeThingsGoRight!!!";

  // Function to hash plain text:
  public hash(plainText: string): string {
    // Hash with salt
    return crypto
      .createHmac("sha512", this.hashingSalt)
      .update(plainText)
      .digest("hex"); // Returns 128 chars string
  }

  // Generate a new JWT token:
  public generateNewToken(user: UsersModel): string {
    const userCopy = { ...user }; // Create a copy of user object
    delete userCopy.password; // Remove password from user copy

    const container = { user: userCopy }; // Container with user data

    const options: SignOptions = { expiresIn: "3h" }; // Token expiration time

    const token = jwt.sign(container, this.secretKey, options); // Generate the token

    return token;
  }

  // Check if token is valid:
  public isTokenValid(token: string): boolean {
    try {
      if (!token) return false; // Ensure token exists

      jwt.verify(token, this.secretKey);
      return true;
    } catch (err: any) {
      console.error("Token validation error:", err.message); // Error validating token
      return false;
    }
  }

  // Decode token to extract user information (userId, roleId, etc.)
  public decodeToken(token: string): UsersModel | null {
    try {
      const container = jwt.verify(token, this.secretKey) as {
        user: UsersModel;
      }; // Decode token
      return container.user; // Return the user information from the token
    } catch (err: any) {
      console.error("Error decoding token:", err.message); // Error decoding token
      return null;
    }
  }

  // Check if user is an admin:
  public isAdmin(token: string): boolean {
    try {
      if (!this.isTokenValid(token)) {
        console.error("Invalid token provided for admin check.");
        return false;
      }

      const container = jwt.verify(token, this.secretKey) as {
        user: UsersModel;
      }; // Verify and decode token
      const user = container.user;

      // Convert roleId to a number to ensure correct comparison
      return Number(user.roleId) === Role.Admin;
    } catch (err: any) {
      console.error("Error decoding token:", err.message); // Error decoding token
      return false;
    }
  }
}

export const cyber = new Cyber();
