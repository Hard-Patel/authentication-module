import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { RefreshResponseDto } from '../dtos/refresh-response.dto';
import { LogoutResponseDto } from '../dtos/logout-response.dto';
import { SanitizedUserDto } from '../dtos/sanitized-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: SanitizedUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates user and returns access token, refresh token, and user information',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    return this.authService.login(loginDto, deviceInfo);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token and refresh token pair using a valid refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Request() req) {
    const deviceInfo = req.headers['user-agent'] || 'unknown';
    return this.authService.refresh(refreshTokenDto.refreshToken, deviceInfo);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidates the refresh token, effectively logging out the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: SanitizedUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getProfile(
    @Request() req,
  ): Promise<Omit<User, 'passwordHash' | 'refreshTokens'>> {
    const user = req.user as User;
    const { passwordHash, refreshTokens, ...sanitized } = user;
    return sanitized;
  }
}
