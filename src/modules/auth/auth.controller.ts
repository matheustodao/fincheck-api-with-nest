import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  @UsePipes()
  authenticate(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  @IsPublic()
  @UsePipes()
  signUp(@Body() signUpUserDto: SignUpDto) {
    return this.authService.signUp(signUpUserDto);
  }
}
