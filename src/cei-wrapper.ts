import "reflect-metadata";
import { Result } from "./application/contracts/result/result";
import { createContainer } from "./infrastructure/configurations/container";
import { ISettings } from "./infrastructure/configurations/settings";
import { AuthenticationService } from "./services/authentication/authentication-service";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";

export class CeiWrapper {
  private readonly authenticationService: AuthenticationService;
  private readonly ceiService: CeiService;

  constructor(settings: ISettings) {
    const container = createContainer(settings);

    this.authenticationService = container.get(AuthenticationService);
    this.ceiService = container.get(CeiService);
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    const authenticationResult = await this.authenticationService.login();

    if (authenticationResult.isError) {
      return authenticationResult;
    }

    return await this.ceiService.getConsolidatedValues(authenticationResult.data);
  }
}
