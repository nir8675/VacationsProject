import Joi from "joi";
import { Role } from "./enums";

export class UsersModel {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public roleId: Role;

  private static schema = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required()
      .messages({
        "string.email": "email must be a valid email address and include '@'",
      }),
    password: Joi.string().min(4).regex(/[A-Z]/).required().messages({
      "string.pattern.base":
        "password must include at least one capital letter",
    }),
    roleId: Joi.number()
      .valid(...Object.values(Role))
      .required(),
  });

  public constructor(user: UsersModel) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.roleId = user.roleId;
  }

  public validate(): Joi.ValidationResult {
    return UsersModel.schema.validate(this, { abortEarly: false });
  }
}
