import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { PatchUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard/jwt.guard.js';
import { AccessTokenPayload } from '../auth/types.js';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findUser(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.userService.findUser(req.user.email);
  }

  @Patch('')
  patchUser(
    @Body() patchUserDto: PatchUserDto,
    @Req() req: Request & { user: AccessTokenPayload },
  ) {
    return this.userService.patchUser(req.user.email, patchUserDto);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: AccessTokenPayload },
  ) {
    return await this.userService.updateAvatar(req.user.email, file);
  }
}
