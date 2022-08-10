import client from "./axios";

export const model = async (data) =>
  client
    .post("/model", data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
