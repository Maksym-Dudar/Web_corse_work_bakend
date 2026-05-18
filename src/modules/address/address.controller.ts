import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { AccessTokenPayload } from "../auth/types.js";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async findAll(@Req() req: Request & { user: AccessTokenPayload }) {
    return await this.addressService.getAllUserAddress(req.user.sub);
  }

  @Post()
  async create(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() address: CreateAddressDto,
  ) {
    return await this.addressService.createAddress(address, req.user.sub);
  }

  @Put()
  async update(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() address: UpdateAddressDto,
  ) {
    return await this.addressService.updateAddress(address, req.user.sub);
  }
}
