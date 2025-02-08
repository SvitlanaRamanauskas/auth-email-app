export const registerUser = async (userData: { username: string, name: string, password: string }) => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      if (response.status === 201) {
        return { message: "User registered successfully" };
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const loginUser = async (credentials: { username: string, name: string, password: string }) => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      if(data.message === "User not found" || data.message === "Invalid credentials") {
        throw new Error("User not registered. Please check your credentials or sign up.");
      }
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


export const testAuthApi = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};
