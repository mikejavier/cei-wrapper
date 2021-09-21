import { Expose, Type } from "class-transformer";
import { IsDate, IsDefined, IsNumber, IsString } from "class-validator";

export class FixedIncomeProduct {
  @Expose({ name: "produto" })
  @IsDefined()
  @IsString()
  public readonly name!: string;

  @Expose({ name: "indexador" })
  @IsDefined()
  @IsString()
  public readonly index!: string;

  @Expose({ name: "vencimento" })
  @IsDefined()
  @IsDate()
  @Type(() => Date)
  public readonly expirationDate!: Date;

  @Expose({ name: "quantidade" })
  @IsDefined()
  @IsNumber()
  public readonly amount!: number;

  @Expose({ name: "valorAplicado" })
  @IsDefined()
  @IsNumber()
  public readonly initialValue!: number;

  @Expose({ name: "valorAtualizado" })
  @IsDefined()
  @IsNumber()
  public readonly currentValue!: number;

  @Expose({ name: "valorLiquido" })
  @IsDefined()
  @IsNumber()
  public readonly netValue!: number;

  @Expose({ name: "percRentabilidadeContratada" })
  @IsDefined()
  @IsNumber()
  public readonly initialProfitability!: number;

  @Expose({ name: "instituicao" })
  @IsDefined()
  @IsString()
  public readonly exchange!: string;

  @Expose({ name: "documentoInstituicao" })
  @IsDefined()
  @IsString()
  public readonly exchangeId!: string;

  @Expose({ name: "disponivel" })
  @IsDefined()
  @IsNumber()
  public readonly available!: number;
}
