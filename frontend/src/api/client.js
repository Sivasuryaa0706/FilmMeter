import axios from "axios";

const client = axios.create({ baseURL: "https://localhost:8000/api" });

export default client;
