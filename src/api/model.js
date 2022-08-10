import client from "./axios";

export const model = async (data) =>
  client
    .post("/model", data, console.log(process.env.REACT_APP_API_URL), {
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
