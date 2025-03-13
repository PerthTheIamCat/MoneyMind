import axios from "axios";

// Define the response interface for both email and username checks
interface CheckExistResponse {
  success: boolean;
  message: string;
}

// Define the error interface
interface CheckExistError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

// Function to check if the email exists
export const CheckEmailExistHandler = async (
  email: string,
  url: string
): Promise<CheckExistResponse | CheckExistError["response"]["data"]> => {
  try {
    // Send a GET request to the backend to check if email exists
    const response = await axios.post<CheckExistResponse>(
      `${url}/auth/checkemail`,
      {
        params: { email },
      }
    );
    return response.data; // Return response data if request is successful
  } catch (error) {
    // Check if it's an Axios error and return the appropriate error response
    if (axios.isAxiosError(error)) {
      return (
        (error.response?.data as CheckExistError["response"]["data"]) || {
          success: false,
          message: "Error occurred while checking email",
        }
      );
    }
    // Handle any unexpected error outside of Axios
    return {
      success: false,
      message: "Unknown error occurred while checking email",
    } as CheckExistError["response"]["data"];
  }
};

// Function to check if the username exists
export const CheckUsernameExistHandler = async (
  username: string,
  url: string
): Promise<CheckExistResponse | CheckExistError["response"]["data"]> => {
  try {
    // Send a GET request to the backend to check if username exists
    console.log(username);
    const response = await axios.post<CheckExistResponse>(
      `${url}/auth/checkusername`,
      { username }
    );
    return response.data; // Return response data if request is successful
  } catch (error) {
    // Check if it's an Axios error and return the appropriate error response
    if (axios.isAxiosError(error)) {
      return (
        (error.response?.data as CheckExistError["response"]["data"]) || {
          success: false,
          message: "Error occurred while checking username",
        }
      );
    }
    // Handle any unexpected error outside of Axios
    return {
      success: false,
      message: "Unknown error occurred while checking username",
    } as CheckExistError["response"]["data"];
  }
};

// Function to handle both email and username check
export const CheckExistHandler = async (
  data: { email: string; username: string },
  url: string
): Promise<CheckExistResponse | CheckExistError["response"]["data"]> => {
  // Check if email exists
  const emailCheck = await CheckEmailExistHandler(data.email, url);
  if (!emailCheck.success) {
    return emailCheck; // If email exists, return email error response
  }

  // Check if username exists
  const usernameCheck = await CheckUsernameExistHandler(data.username, url);
  if (!usernameCheck.success) {
    return usernameCheck; // If username exists, return username error response
  }

  // If both email and username are available
  return {
    success: true,
    message: "Both email and username are available.",
  };
};
