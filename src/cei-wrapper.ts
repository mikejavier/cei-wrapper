import { Result } from "./application/contracts/result/result";
import { createContainer } from "./infrastructure/configurations/container";
import { ISettings } from "./infrastructure/configurations/settings";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";

export class CeiWrapper {
  private readonly ceiService: CeiService;

  constructor(settings: ISettings) {
    this.ceiService = createContainer(settings).get(CeiService);
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    return await this.ceiService.getConsolidatedValues({ cacheId: "", token: "" });
  }
}
