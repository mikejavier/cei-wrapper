import { Expose, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDefined, IsNumber, IsString, ValidateNested } from "class-validator";
import { FixedIncomeProduct } from "./fixed-income-product";
import { VariableIncomeProduct } from "./variable-income-product";

export class InvestmentType {
  @Expose({ name: "categoriaProduto" })
  @IsDefined()
  @IsString()
  public readonly category!: string;

  @Expose({ name: "tipoProduto" })
  @IsDefined()
  @IsString()
  public readonly name!: string;

  @Expose({ name: "posicoes" })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type((arg) => (arg?.object.categoriaProduto === "RendaVariavel" ? VariableIncomeProduct : FixedIncomeProduct))
  public readonly products!: Array<FixedIncomeProduct | VariableIncomeProduct>;

  @Expose({ name: "totalPosicao" })
  @IsDefined()
  @IsNumber()
  public readonly totalAmount!: number;
}
