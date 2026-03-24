import axios from "axios";
import { showError, showSuccess } from "./message";
const baseUrl = `http://localhost:3001/api/v1`;
export const baseDesigned = `http://localhost:3001`;
export const logInService = async (email: string, password: string) => {
  if (email.trim() === null) {
    alert("You must enter an email");
    return;
  }

  if (password.trim() === null) {
    alert("Password is required");
    return;
  }

  const response = await axios.post(`${baseUrl}/login`, {
    formData: {
      email,
      password,
    },
  });
  // console.log(response);

  if (response.status === 200) {
    showSuccess("Login successfully");
  } else {
    showError("Could't be able to login");
    alert("couldn't login");
  }
};
