import { injectable } from "inversify";

export interface ISettings {
  username: string;
  password: string;
  ceiApiUrl?: string;
}

@injectable()
export class Settings {
  public readonly username: string;
  public readonly password: string;
  public readonly ceiApiUrl: string;

  constructor(settings: ISettings) {
    this.username = settings.username;
    this.password = settings.password;
    this.ceiApiUrl = settings.ceiApiUrl ?? "https://investidor.b3.com.br/api";
  }
}
