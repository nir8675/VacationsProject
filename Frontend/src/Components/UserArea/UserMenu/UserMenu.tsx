import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { AppState } from "../../../Redux/store";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./UserMenu.css";

export function UserMenu(): JSX.Element {
  const user = useSelector<AppState, UserModel>((store) => store.user);

  function logout() {
    userService.logout();
    notify.success("Bye bye");
  }

  return (
    <div className="UserMenu">
      {!user && (
        <>
          <span className="guest-text">Hello Guest</span>
          <NavLink to="/register">Register</NavLink>
          <span>|</span>
          <NavLink to="/login">Login</NavLink>
        </>
      )}

      {user && (
        <>
          <span>
            Hello {user.firstName} {user.lastName}
          </span>
          <span>|</span>
          <NavLink to="/vacations" onClick={logout}>
            Logout
          </NavLink>
        </>
      )}
    </div>
  );
}
