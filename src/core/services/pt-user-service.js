import { CONFIG } from "../../config";

export class PtUserService {
  getUsersUrl(nameFilter) {
    let url = `${CONFIG.apiEndpoint}/users`;
    if (nameFilter) {
      url = url + "?name=" + nameFilter;
    }
    return url;
  }

  constructor(store) {
    this.store = store;
  }

  fetchUsers() {
    fetch(this.getUsersUrl())
      .then((response) => response.json())
      .then((data) => {
        data.forEach((u) => {
          u.avatar = `${CONFIG.apiEndpoint}/photo/${u.id}`;
        });
        this.store.set("users", data);
      });
  }
}
