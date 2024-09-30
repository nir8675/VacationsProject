import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from "../Models/CredentialsModel";
import { UserModel } from "../Models/UserModel";
import { store, authActions, userActions } from "../Redux/store";
import { appConfig } from "../Utils/AppConfig";

class UserService {
  public constructor() {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Set token in Axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const container = jwtDecode<{ user: UserModel }>(token);
      const dbUser = container.user;

      // Dispatch the user to redux store
      store.dispatch(userActions.initUser(dbUser));
    } catch (error) {
      console.error("Error decoding token in UserService constructor:", error);
    }
  }

  public async register(user: UserModel) {
    // Notify Redux that the login process is starting
    store.dispatch(authActions.loginStart());
    try {
      // Sending the registration request to the backend
      const response = await axios.post<{ token: string; user: UserModel }>(
        appConfig.registerUrl, // URL for registration
        user // user data sent to the backend
      );

      // Extract the token and user details from the server response
      const { token, user: dbUser } = response.data;

      // Save the token in localStorage for session persistence
      localStorage.setItem("token", token);

      // Set the token in Axios default headers for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Dispatch user information to Redux store
      store.dispatch(userActions.initUser(dbUser));

      // Dispatch success action with the token to mark login completion
      store.dispatch(authActions.loginSuccess(token));
    } catch (error) {
      // If there's an error, dispatch the login failure action
      store.dispatch(authActions.loginFailure());
      throw error;
    }
  }

  public async login(credentials: CredentialsModel): Promise<UserModel> {
    store.dispatch(authActions.loginStart());
    try {
      const response = await axios.post<{ token: string; user: UserModel }>(
        appConfig.loginUrl,
        credentials
      );
      const { token, user: dbUser } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      store.dispatch(userActions.initUser(dbUser));
      store.dispatch(authActions.loginSuccess(token));

      return dbUser;
    } catch (error) {
      store.dispatch(authActions.loginFailure());
      throw error;
    }
  }

  public logout() {
    store.dispatch(userActions.logoutUser());
    store.dispatch(authActions.logout());
    delete axios.defaults.headers.common["Authorization"];
  }
}

export const userService = new UserService();
