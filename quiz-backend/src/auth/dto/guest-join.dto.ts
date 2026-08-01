import { IsString, MinLength, MaxLength } from 'class-validator';

export class GuestJoinDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  displayName: string;
}