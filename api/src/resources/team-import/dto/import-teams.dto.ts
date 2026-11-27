import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import {
  MAX_ABBREVIATION_LENGTH,
  MAX_CITY_LENGTH,
  MAX_NAME_LENGTH,
  MIN_ABBREVIATION_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export const MAX_IMPORT_TEAMS = 300;

function trimText({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class ImportTeamRowDto {
  @IsUUID('4', { message: VALIDATION_MESSAGES.categoryId })
  public categoryId!: string;

  @Transform(trimText)
  @IsString({ message: VALIDATION_MESSAGES.groupNameRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.groupNameRequired })
  @MaxLength(MAX_NAME_LENGTH, { message: VALIDATION_MESSAGES.groupNameTooLong })
  public group!: string;

  @Transform(trimText)
  @RequiredName()
  public name!: string;

  @Transform(trimText)
  @IsString({ message: VALIDATION_MESSAGES.cityRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.cityRequired })
  @MaxLength(MAX_CITY_LENGTH, { message: VALIDATION_MESSAGES.cityTooLong })
  public city!: string;

  @IsOptional()
  @Transform(trimText)
  @IsString({ message: VALIDATION_MESSAGES.abbreviation })
  @Length(MIN_ABBREVIATION_LENGTH, MAX_ABBREVIATION_LENGTH, {
    message: VALIDATION_MESSAGES.abbreviation,
  })
  public abbreviation?: string;
}

export class ImportTeamsDto {
  @IsArray({ message: VALIDATION_MESSAGES.teamImportRows })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.teamImportRows })
  @ArrayMaxSize(MAX_IMPORT_TEAMS, { message: VALIDATION_MESSAGES.teamImportRows })
  @ValidateNested({ each: true })
  @Type(() => ImportTeamRowDto)
  public rows!: ImportTeamRowDto[];
}
