export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}
export interface MailOptions {
  cc?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface IOneEmail {
  email: string;
  subjectOrTemplateId: string;
  htmlOrTemplate?: any;
  options?: MailOptions;
  attachments?: any[];
}
