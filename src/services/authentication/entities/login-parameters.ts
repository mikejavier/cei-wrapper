export class LoginParameters {
  public readonly username: string;
  public readonly password: string;
  public readonly anticaptchaServiceKey: string;

  constructor(data: LoginParameters) {
    this.username = data.username;
    this.password = data.password;
    this.anticaptchaServiceKey = data.anticaptchaServiceKey;
  }
}
