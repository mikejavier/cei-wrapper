export class AuthenticationContext {
  public readonly cacheId: string;
  public readonly token: string;

  constructor(cacheId: string, token: string) {
    this.cacheId = cacheId;
    this.token = token;
  }
}
