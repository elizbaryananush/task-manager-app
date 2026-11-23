import {
  Body,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUsersRepository } from '../database/repositories/auth_user.repository';
import type { CheckUsernameDto } from './dtos/payloads/check-username.dto';
import type { LoginDto } from './dtos/payloads/login.dto';
import { LoginResponseDto } from './dtos/responses/login.response.dto';
import type { RegisterDto } from './dtos/payloads/register.dto';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { AuthSessionResponse } from './dtos/responses/auth-session.response.dto';
import { AuthController } from './auth.controller';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authUserRepository: AuthUsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly pepper = Buffer.from(process.env.ORGON_SECRET!);

  async check_username(body: CheckUsernameDto): Promise<boolean> {
    const authUser = await this.authUserRepository.findOneBy({
      username: body.username,
    });

    if (!authUser) return false;

    return true;
  }

  async login(body: LoginDto): Promise<AuthSessionResponse<LoginResponseDto>> {
    const authUser = await this.authUserRepository.findOneBy({
      username: body.identifier,
    });

    if (!authUser) {
      throw new UnauthorizedException();
    }

    const verify = await this.verifyJwt(body.password, authUser.passwordHash);

    if (!verify) {
      this.logger.warn(`Unautharized`);
      throw new UnauthorizedException();
    }

    const { auth_id, username } = authUser;

    const refreshToken = await this.refreshToken(auth_id, username);

    const hashedRefreshToken = await this.hashJwt(refreshToken);
    await this.authUserRepository.update(auth_id, {
      refreshToken: hashedRefreshToken,
    });

    const accessToken = await this.accessToken(auth_id, username);

    const { passwordHash, refreshToken: _, ...safeUser } = authUser;

    this.logger.log('success');

    return {
      response: {
        statusCode: 201,
        message: 'Successfully logged in',
        user: safeUser,
        accessToken: accessToken,
      },
      refreshToken,
    };
  }

  async register(
    body: RegisterDto,
  ): Promise<AuthSessionResponse<LoginResponseDto>> {
    const { username, email, password } = body;
    const authUser = await this.authUserRepository.findOneBy({
      username,
    });

    if (authUser)
      throw new InternalServerErrorException('Credantials are in use');

    const passwordHash = await this.hashJwt(password);

    const newAuthUser = this.authUserRepository.create({
      username,
      email,
      passwordHash,
    });

    await this.authUserRepository.save(newAuthUser);

    return this.login({ identifier: username, password: password });
  }

  async refresh() {}

  async logout() {}

  async hashJwt(subject: string): Promise<string> {
    return argon2.hash(subject, { secret: this.pepper });
  }

  async verifyJwt(subject: string, hashSubject: string): Promise<boolean> {
    try {
      return await argon2.verify(hashSubject, subject, {
        secret: this.pepper,
      });
    } catch {
      return false;
    }
  }

  async accessToken(auth_id: string, username: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: auth_id, username },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async refreshToken(auth_id: string, username: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: auth_id, username },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }
}
