import { Expose, Type } from "class-transformer";
import { IsArray, IsDefined, IsNumber, IsString, ValidateNested } from "class-validator";

class ConsolidatedValue {
  @Expose({ name: "categoriaProduto" })
  @IsString()
  @IsDefined()
  public readonly product!: string;

  @Expose({ name: "totalPosicao" })
  @IsNumber()
  @IsDefined()
  public readonly totalAmount!: number;

  @Expose({ name: "percentual" })
  @IsNumber()
  @IsDefined()
  public readonly percentage!: number;
}

export class ConsolidatedValues {
  @IsNumber()
  @IsDefined()
  public readonly total!: number;

  @Expose({ name: "subTotais" })
  @IsArray()
  @Type(() => ConsolidatedValue)
  @ValidateNested()
  public readonly values!: ConsolidatedValue[];
}
