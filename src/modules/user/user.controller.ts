import { JwtProtectedRequest } from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import { UserService } from '@Module/user/user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Get own user profile' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUser(@Req() req: JwtProtectedRequest) {
    const { password, ...user } = await this.userService.getExists({
      where: {
        id: req.user.id,
      },
    });

    return user;
  }
}
