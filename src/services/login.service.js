
import axios from "axios";

export function loginAPICall(loginModel)
{
    return axios.post("http://localhost:5227/api/Auth/login",loginModel)
}