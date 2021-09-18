import { Expose, Transform } from "class-transformer";
import { IsDefined, IsNumber, IsString } from "class-validator";

export class VariableIncomeProduct {
  @Expose({ name: "razaoSocial" })
  @IsDefined()
  @IsString()
  @Transform((arg) => arg.value.trim())
  public readonly company!: string;

  @Expose({ name: "codigoNegociacao" })
  @IsDefined()
  @IsString()
  public readonly code!: string;

  @Expose({ name: "tipo" })
  @IsDefined()
  @IsString()
  public readonly type!: string;

  @Expose({ name: "quantidade" })
  @IsDefined()
  @IsNumber()
  public readonly amount!: number;

  @Expose({ name: "precoFechamento" })
  @IsDefined()
  @IsNumber()
  public readonly price!: number;

  @Expose({ name: "instituicao" })
  @IsDefined()
  @IsString()
  public readonly exchange!: string;

  @Expose({ name: "documentoInstituicao" })
  @IsDefined()
  @IsString()
  public readonly exchangeId!: string;

  @Expose({ name: "escriturador" })
  @IsDefined()
  @IsString()
  public readonly bookkeeper!: string;

  @Expose({ name: "disponivel" })
  @IsDefined()
  @IsNumber()
  public readonly available!: number;
}
