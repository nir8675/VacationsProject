import { OkPacketParams } from "mysql2";
import { cyber } from "../2-utils/cyber";
import { dal } from "../2-utils/dal";
import { UnauthorizedError } from "../3-models/client-errors";
import { CredentialsModel } from "../3-models/credentials-model";
import { Role } from "../3-models/enums";
import { UsersModel } from "../3-models/users-model";

// Deals with users:
class UserService {
  // Check if email is already taken:
  public async isEmailTaken(email: string): Promise<boolean> {
    const sql = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const values = [email];
    const result = await dal.execute(sql, values);
    return result[0].count > 0;
  }

  // Register new user:
  public async register(user: UsersModel) {
    // Validation...
    user.validate();

    // Check if the email is already taken
    const emailExists = await this.isEmailTaken(user.email);
    if (emailExists) {
      throw new Error("Email is already taken");
    }

    // SQL query for inserting the user
    const sql = "insert into users values(default,?,?,?,?,?)";

    // Set role as regular user and not something else:
    user.roleId = Role.User;

    // Hash password:
    user.password = cyber.hash(user.password);

    // Values for the SQL query:
    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.roleId,
    ];

    // Execute the SQL query:
    const info: OkPacketParams = await dal.execute(sql, values);

    // Set back id:
    user.id = info.insertId;

    // Create JWT (Json Web Token) - we remove the password from the token:
    const token = cyber.generateNewToken(user);

    // Return:
    return token;
  }

  // Login user:
  public async login(
    credentials: CredentialsModel
  ): Promise<{ token: string; user: UsersModel }> {
    // Validate credentials:
    credentials.validate();

    // SQL query for login:
    const sql = "select * from users where email = ? and password = ?";

    // Hash password:
    credentials.password = cyber.hash(credentials.password);

    // Values for the SQL query:
    const values = [credentials.email, credentials.password];

    // Execute the SQL query:
    const users = await dal.execute(sql, values);

    // Extract user:
    const user = users[0];

    // If no user found:
    if (!user) throw new UnauthorizedError("Incorrect email or password.");

    // Create JWT (Json Web Token):
    const token = cyber.generateNewToken(user);

    // Return the token and user:
    return { token, user };
  }
}

export const userService = new UserService();
