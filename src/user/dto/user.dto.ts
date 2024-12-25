import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class createUserDto {
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number must be a string' })
  mobile_number: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
