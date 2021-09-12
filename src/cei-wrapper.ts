import { Result } from "./application/contracts/result/result";
import { CeiService } from "./services/cei/cei-service";
import { ConsolidatedValues } from "./services/cei/entities/consolidated-value";

export class CeiWrapper {
  private readonly ceiService: CeiService;

  constructor(ceiService: CeiService) {
    this.ceiService = ceiService;
  }

  public async getConsolidatedValues(): Promise<Result<ConsolidatedValues>> {
    return await this.ceiService.getConsolidatedValues({ cacheId: "", token: "" });
  }
}
