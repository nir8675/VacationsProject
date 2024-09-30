import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { errorHandler } from "../../../Services/errorHandler";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { AppState } from "../../../Redux/store";
import "./Login.css";

export function Login(): JSX.Element {
  const { register, handleSubmit } = useForm<CredentialsModel>();
  const navigate = useNavigate();

  const loading = useSelector((state: AppState) => state.auth.loading);

  async function send(credentials: CredentialsModel) {
    try {
      await userService.login(credentials);
      notify.success("Welcome back!");

      if (!loading) {
        navigate("/vacations");
      }
    } catch (err: any) {
      const errorMessage = errorHandler.getError(err);
      notify.error(errorMessage);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(send)}>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input type="email" id="email" {...register("email")} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" id="password" {...register("password")} />
        </div>
        {/* Disable the button when loading */}
        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="register-area">
          <span>Don't have an account? </span>
          <NavLink to="/register">Register</NavLink>
        </div>
      </form>
    </div>
  );
}
