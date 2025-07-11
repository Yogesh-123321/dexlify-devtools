import axios from "axios";

const API = axios.create({
  baseURL: "http://13.201.227.67:5500/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
