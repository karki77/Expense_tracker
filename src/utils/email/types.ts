export interface IEmailSend {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// register -> username, IRegisterEmailTemplate {fullName: string}
