import "reflect-metadata";
import { Result } from "./application/contracts/result/result";
import { createContainer } from "./infrastructure/configurations/container";
import { AuthenticationService } from "./services/authentication/authentication-service";
import { AuthenticationContext } from "./services/authentication/entities/authentication-context";
import { LoginParameters } from "./services/authentication/entities/login-parameters";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";

export class CeiWrapper {
  private readonly authenticationContext: AuthenticationContext;
  private readonly ceiService: CeiService;

  constructor(authenticationContext: AuthenticationContext) {
    this.authenticationContext = authenticationContext;
    this.ceiService = createContainer().get(CeiService);
  }

  static async authenticateUser(parameters: LoginParameters): Promise<Result<AuthenticationContext>> {
    const authenticationService = createContainer().get(AuthenticationService);

    const authenticationResult = await authenticationService.login(parameters);

    if (authenticationResult.isError) {
      return authenticationResult;
    }

    return authenticationResult;
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    return await this.ceiService.getConsolidatedValues(this.authenticationContext);
  }
}
