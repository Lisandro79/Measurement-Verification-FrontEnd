import client from "./axios"

export const model = (data) =>
  client
    .post("/home", data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        }
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });