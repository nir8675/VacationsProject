import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { AppState } from "../../../Redux/store";

// ProtectedRoute component restricts access to certain routes.
// If the user is not logged in (no token), it redirects them to the login page and shows an error notification.
// If the user is logged in, it renders the nested route using <Outlet />.
function ProtectedRoute(): JSX.Element {
  const token = useSelector((state: AppState) => state.auth.token);

  console.log("Navigate To Login Page");

  if (!token) {
    notify.error("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}


export default ProtectedRoute;
