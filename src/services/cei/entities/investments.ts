import { Expose, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDefined, IsNumber, ValidateNested } from "class-validator";
import { InvestmentType } from "./investment-type";

export class Investments {
  @Expose({ name: "paginaAtual" })
  @IsDefined()
  @IsNumber()
  public readonly currentPage!: number;

  @Expose({ name: "totalPaginas" })
  @IsDefined()
  @IsNumber()
  public readonly totalPages!: number;

  @Expose({ name: "itens" })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => InvestmentType)
  public readonly types!: InvestmentType[];
}
