import client from "./client";

export const createUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/create", userInfo);
    return data;
  } catch (error) {
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};

export const verifyUserEmail = async (userInfo) => {
  try {
    const { data } = await client.post("/user/verify-email", userInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};

export const signInUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/sign-in", userInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};

export const getIsAuth = async (token) => {
  try {
    const { data } = await client.get("/user/is-auth", {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};

export const forgetPassword = async (email) => {
  try {
    const { data } = await client.post("/user/forget-password", { email });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};
export const verifyPasswordResetToken = async (token, userId) => {
  try {
    const { data } = await client.post("/user/verify-pass-reset-token", {
      token,
      userId,
    });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};
export const resetPassword = async (passwordInfo) => {
  try {
    const { data } = await client.post("/user/reset-password", passwordInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};
