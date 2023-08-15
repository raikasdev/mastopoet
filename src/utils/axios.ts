import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    "User-Agent": `mastopoet/${__APP_VERSION__}`,
  },
});
