import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { CheckUsernameDto } from './dtos/payloads/check-username.dto';
import type { LoginDto } from './dtos/payloads/login.dto';
import type { RegisterDto } from './dtos/payloads/register.dto';
import { LoginResponseDto } from './dtos/responses/login.response.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('check-username')
  async check_username(@Body() body: CheckUsernameDto) {
    return;
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    try {
      const result = await this.authService.login(body);

      this.setCookie(res, result.refreshToken);

      this.logger.log(
        `POST /auth/register -> ${result.response.statusCode} (username: ${result.response.user?.username})`,
      );

      return result.response;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    try {
      const result = await this.authService.register(body);

      this.setCookie(res, result.refreshToken);

      return result.response;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Post('refresh')
  async refresh() {
    return;
  }

  @Get('logout')
  logout() {
    return;
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 100,
    });
  }
}
