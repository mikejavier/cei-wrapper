import "reflect-metadata";
import { Result } from "./application/contracts/result/result";
import { createContainer } from "./infrastructure/configurations/container";
import { ISettings } from "./infrastructure/configurations/settings";
import { AuthenticationService } from "./services/authentication/authentication-service";
import { AuthenticationContext } from "./services/authentication/entities/authentication-context";
import { LoginParameters } from "./services/authentication/entities/login-parameters";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";
import { Investments } from "./services/cei/entities/investments";

export class CeiWrapper {
  private readonly authenticationContext: AuthenticationContext;
  private readonly ceiService: CeiService;

  constructor(authenticationContext: AuthenticationContext, settings?: ISettings) {
    this.authenticationContext = authenticationContext;
    this.ceiService = createContainer(settings).get(CeiService);
  }

  static async authenticateUser(
    parameters: LoginParameters,
    settings?: ISettings,
  ): Promise<Result<AuthenticationContext>> {
    const authenticationService = createContainer(settings).get(AuthenticationService);

    const authenticationResult = await authenticationService.login(parameters);

    if (authenticationResult.isError) {
      return authenticationResult;
    }

    return authenticationResult;
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    return await this.ceiService.getConsolidatedValues(this.authenticationContext);
  }

  public async getInvestments(date?: Date, page = 1): Promise<Result<Investments>> {
    const latestProcessingDatesResponse = await this.ceiService.getLatestProcessingDates(this.authenticationContext);

    if (latestProcessingDatesResponse.isError) {
      return latestProcessingDatesResponse;
    }

    const defaultDate = latestProcessingDatesResponse.data.generalDate;

    return await this.ceiService.getInvestments(date ?? defaultDate, page, this.authenticationContext);
  }
}
