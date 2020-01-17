import Axios from "axios";

const Api = Axios.create({
  //baseURL: "http://localhost:3003"
  baseURL: "http://192.168.0.3:3003"
  //baseURL: "http://127.0.0.1:3003"
});

export default Api;
