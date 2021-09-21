export class LoginParameters {
  public readonly username: string;
  public readonly password: string;
  public readonly captchaSolvingServiceKey: string;

  constructor(data: LoginParameters) {
    this.username = data.username;
    this.password = data.password;
    this.captchaSolvingServiceKey = data.captchaSolvingServiceKey;
  }
}
