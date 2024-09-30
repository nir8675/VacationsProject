import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { errorHandler } from "../../../Services/errorHandler";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./Register.css";

export function Register(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModel>();
  const navigate = useNavigate(); // Initialize navigate hook

  async function send(user: UserModel) {
    try {
      // Register the user and automatically log them in
      await userService.register(user);
      notify.success("Welcome " + user.firstName);

      // Redirect the user after successful registration
      navigate("/login");
    } catch (err: any) {
      notify.error(errorHandler.getError(err));
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(send)}>
        <h2>Register</h2>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", {
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters long",
              },
              maxLength: {
                value: 30,
                message: "First name cannot exceed 30 characters",
              },
            })}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", {
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters long",
              },
              maxLength: {
                value: 30,
                message: "Last name cannot exceed 30 characters",
              },
            })}
          />
          {errors.lastName && (
            <span className="error">{errors.lastName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Email must be a valid email address and include '@'",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters long",
              },
              pattern: {
                value: /[A-Z]/, // At least one uppercase letter
                message: "Password must include at least one capital letter",
              },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="member-area">
          <p>Already a member?</p>
          <NavLink to="/login">Login</NavLink>
        </div>
      </form>
    </div>
  );
}
