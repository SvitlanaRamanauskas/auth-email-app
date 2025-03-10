import { EmailResponse } from "./types/Email";
export const PAGE_SIZE = 4;

const BASE_URL = "http://68.183.74.14:4005/api";

const getAuthHeader = (): string => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  if (!username || !password) {
    throw new Error("Missing authentication credentials");
  }

  return `Basic ${btoa(`${username}:${password}`)}`;
};

const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  auth: boolean = false,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers["Authorization"] = getAuthHeader();
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json();
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  return apiRequest("/users/", "POST", userData);
};

export const getCurrentUser = async (username: string, password: string) => {
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  return apiRequest("/users/current/", "GET", undefined, true);
};

export const sendEmail = async (emailData: {
  sender: number;
  recipient: string;
  subject: string;
  message: string;
}) => {
  return apiRequest("/emails/", "POST", emailData, true);
};

export const getEmails = async (
  userId: number,
  page: number,
): Promise<EmailResponse> => {
  const offset = (page - 1) * PAGE_SIZE;
  const responseData: EmailResponse = await apiRequest(
    `/emails/?offset=${offset}&limit=${PAGE_SIZE}&userId=${userId}`,
    "GET",
    undefined,
    true,
  );

  return {
    count: responseData.count,
    next: responseData.next,
    previous: responseData.previous,
    results: responseData.results.filter((email) => email.sender === userId),
  };
};
