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
    const { response } = error; // We need to send error from sendError() => res.json
    if (response?.data) return response.data;

    return { error: error.message || error }; // If no error data, return error message.
  }
};
