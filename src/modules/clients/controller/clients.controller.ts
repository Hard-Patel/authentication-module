import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ClientCredentialsGuard } from '../../auth/guards/client-credentials.guard';
import { ClientResponseDto } from '../dto/client-response.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { ClientsService } from '../service/clients.service';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new client (third-party app)',
    description:
      'Creates a new OAuth client application. The clientSecret is returned only once - store it securely. Requires JWT authentication.',
  })
  @ApiCreatedResponse({
    description:
      'Client created successfully. clientSecret returned only once.',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - Invalid request body',
  })
  async create(@Body() dto: CreateClientDto, @Req() req: any) {
    const ownerUserId = req.user?.id;
    if (!ownerUserId) {
      throw new UnauthorizedException('User ID not found in JWT token');
    }
    const { client, clientSecret } = await this.clientsService.create(
      dto.name,
      dto.redirectUris,
      ownerUserId,
    );
    return {
      id: client.id,
      clientId: client.clientId,
      clientSecret, // show once
      name: client.name,
      redirectUris: client.redirectUris,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  // Protected route: demonstrates client auth
  @UseGuards(ClientCredentialsGuard)
  @ApiBasicAuth('client-basic')
  @Get('me')
  @ApiOperation({
    summary: 'Get client info (uses client credentials)',
    description:
      'Retrieves the authenticated client information using Basic authentication with clientId:clientSecret.',
  })
  @ApiResponse({
    status: 200,
    description: 'Client information retrieved successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid client credentials',
  })
  async getMe(@Req() req: any) {
    return req.client;
  }

  @Get(':clientId')
  @ApiOperation({
    summary: 'Get client by clientId',
    description:
      'Retrieves public information about a client by its clientId. No authentication required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Client information retrieved successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async getOne(@Param('clientId') clientId: string) {
    const c = await this.clientsService.findByClientId(clientId);
    // map to response dto shape
    return {
      id: c?.id,
      clientId: c?.clientId,
      name: c?.name,
      redirectUris: c?.redirectUris,
      isActive: c?.isActive,
      createdAt: c?.createdAt,
      updatedAt: c?.updatedAt,
    };
  }
}
