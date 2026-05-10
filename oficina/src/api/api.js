import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.101.134:8080",
  timeout: 20000,
});

export default api;