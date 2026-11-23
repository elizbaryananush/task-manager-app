import { Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register() {
        return
    }

    @Post('login')
    login() {
        return
    }

    @Post('check-username')
    check_username() {
        return
    }

    @Post('refresh')
    refresh() {
        return
    }

    @Get('logout')
    logout() {
        return
    }
}
