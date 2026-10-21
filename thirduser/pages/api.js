export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const request = async (path, token, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Cannot reach PrepHired. Check the API URL and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
};

export const loginThirdUser = (email, password) =>
  request("/thirduser/auth/login", null, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getSession = () => {
  const token = localStorage.getItem("thirduser.token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("thirduser.user") || "null");
  } catch {
    localStorage.removeItem("thirduser.user");
  }
  return { token, user };
};

export const signOut = (navigate) => {
  localStorage.removeItem("thirduser.token");
  localStorage.removeItem("thirduser.user");
  navigate("/login");
};