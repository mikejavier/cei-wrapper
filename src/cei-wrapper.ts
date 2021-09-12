import { Result } from "./application/contracts/result/result";
import { container } from "./infrastructure/configurations/container";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";

export class CeiWrapper {
  private readonly ceiService: CeiService;

  constructor() {
    this.ceiService = container.get(CeiService);
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    return await this.ceiService.getConsolidatedValues({ cacheId: "", token: "" });
  }
}
