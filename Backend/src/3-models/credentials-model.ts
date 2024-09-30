import Joi from "joi";

export class CredentialsModel {
  public email: string;
  public password: string;

  private static schema = Joi.object({
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
  });

  public constructor(credentials: CredentialsModel) {
    this.email = credentials.email;
    this.password = credentials.password;
  }

  public validate(): Joi.ValidationResult {
    return CredentialsModel.schema.validate(this, { abortEarly: false });
  }
}
