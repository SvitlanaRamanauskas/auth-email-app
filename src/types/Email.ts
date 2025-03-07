export type EmailType = {
  id: number;
  sender: number;
  recipient: string;
  subject: string;
  message: string;
}

export type EmailResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmailType[];
}
