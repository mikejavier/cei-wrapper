import { injectable } from "inversify";

export interface ISettings {
  debug?: boolean;
}

@injectable()
export class Settings {
  public readonly debug: boolean;

  constructor(settings: ISettings) {
    this.debug = settings.debug ?? false;
  }
}
