import { Expose, Type } from "class-transformer";
import { IsDate } from "class-validator";

export class LatestProcessingDates {
  @Expose({ name: "dataDerivativos" })
  @IsDate()
  @Type(() => Date)
  public readonly derivatives!: Date;

  @Expose({ name: "dataGeral" })
  @IsDate()
  @Type(() => Date)
  public readonly generalDate!: Date;

  @Expose({ name: "dataRendaFixa" })
  @IsDate()
  @Type(() => Date)
  public readonly fixedIncome!: Date;

  @Expose({ name: "dataRendaVariavel" })
  @IsDate()
  @Type(() => Date)
  public readonly variableIncome!: Date;

  @Expose({ name: "dataTesouroDireto" })
  @IsDate()
  @Type(() => Date)
  public readonly treasuryDirectDate!: Date;
}
