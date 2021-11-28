const AUTH_SERVICE = "http://localhost:8080/api/";
const PUBLIC_SERVICE = "http://localhost:8080/api/public/";
const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  if (localStorage.getItem("accessToken")) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("accessToken")
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

function getToken() {
  if (isLogin()) {
    let token = localStorage.getItem("accessToken")
    return token
  }
}

const isLogin = () => {
  return !!localStorage.getItem("accessToken")
}

export function login(loginRequest) {
  return request({
    url: AUTH_SERVICE + "auth/sign-in",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function facebookLogin(facebookLoginRequest) {
  return request({
    url: AUTH_SERVICE + "/facebook/signin",
    method: "POST",
    body: JSON.stringify(facebookLoginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: AUTH_SERVICE + "auth/sign-up",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "users/me",
    method: "GET",
  });
}

export function getUsers(accountId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "accounts/summaries/" + accountId,
    method: "GET",
  });
}

export function countNewMessages(senderId, receiverId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + receiverId + "/count",
    method: "GET",
  });
}

export function findChatMessages(senderId, receiverId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + receiverId,
    method: "GET",
  });
}

export function findChatMessage(id) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + id,
    method: "GET",
  });
}

export function getEmailVerificationMessage(token) {
  return request({
    url: PUBLIC_SERVICE + "active-email?token=" + token,
    method: "GET",
  });
}

export function uploadAvatar(body) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  return fetch(
    AUTH_SERVICE + "accounts/upload-avatar",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      body: body
    })
    .then((response) => response.text())
}

export function getImage(url) {
  return PUBLIC_SERVICE + "images/getImage/" + url
}
