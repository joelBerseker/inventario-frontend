import { store } from "@/store";
import axios from "axios";

const url = import.meta.env.VITE_APP_RUTA_API;

export default new (class {
  async obtain_token(credentials) {
    const response = await axios.post(url + "user/token/", credentials);

    store.commit("SET_TOKEN", response.data.access);
    store.commit("SET_REFRESH", response.data.refresh);
    store.commit("SET_ID", response.data.user_id);

    return response.data;
  }

  async refresh_token(token) {
    const response = await axios.post(url + "user/refresh-token/", token);

    store.commit("SET_TOKEN", response.data.access);
    store.commit("SET_REFRESH", response.data.refresh);

    return response.data;
  }

  async register(credentials) {
    const response = await axios.post(url + "user/register/", credentials);
    return response;
  }

  async getUser() {
    const id =
      store.state.id ??
      store.state.Id ??
      store.getters?.getId ??
      JSON.parse(localStorage.getItem("id") || "null");

    const response = await axios.get(url + "user/api/" + id + "/");
    const user = response.data;

    store.commit("SET_USER", user);
    localStorage.setItem("User", JSON.stringify(user));

    return user;
  }

  async setUser(data) {
    store.commit("SET_USER", data);
    localStorage.setItem("User", JSON.stringify(data));
  }

  getCurrentUser() {
    const fromState =
      store.state.user ??
      store.state.User ??
      null;

    if (fromState) return fromState;

    const fromGetter =
      store.getters?.getUser ??
      null;

    if (fromGetter) return fromGetter;

    const fromLocalStorage = localStorage.getItem("User");
    if (fromLocalStorage) {
      try {
        return JSON.parse(fromLocalStorage);
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  getCurrentRole() {
    const user = this.getCurrentUser();

    if (!user) return null;
    if (user.is_superuser || user.is_admin) return "admin";
    if (user.is_staff) return "seller";

    return "user";
  }

  isLoggedIn() {
    return !!(
      store.state.token ??
      store.state.Token ??
      store.getters?.getToken ??
      localStorage.getItem("token")
    );
  }

  logout() {
    store.commit("SET_TOKEN", null);
    store.commit("SET_REFRESH", null);
    store.commit("SET_ID", null);
    store.commit("SET_USER", null);

    localStorage.removeItem("User");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("id");

    delete axios.defaults.headers.common["Authorization"];
  }
})();