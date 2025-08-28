// src/services/register.service.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5227/api", // your backend base URL
});

export const registerUser = (data) => {
  return API.post("/Auth/register", data);
};
