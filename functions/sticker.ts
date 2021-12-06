import { Handler } from "@netlify/functions";
import axios from "axios";
const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { searchData, limit, offset } = payload;
  const instance = await axios.create({
    baseURL: "https://api.giphy.com/v1/",
  });
  const API_KEY = process.env.VUE_APP_APIKEY;
  const url = offset
    ? `stickers/search?api_key=${API_KEY}&q=${searchData}&limit=${limit}&rating=g&lang=ko&offset=${offset}`
    : `stickers/search?api_key=${API_KEY}&q=${searchData}&limit=${limit}&rating=g&lang=ko}`;
  try {
    const { data } = await instance.get(url);
    if (data.meta.status === 400 || data.meta.status === 404) {
      return {
        statusCode: 400,
        body: data.meta.msg,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: error.message,
    };
  }
};

export { handler };
