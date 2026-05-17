import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrder } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AccessTokenPayload } from '../auth/types';
import { FindOrderDto } from './dto/find-order.dto';
import { CreateDeliveryMethod } from './dto/create-delivery-method';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() body: CreateOrder,
    @Req() req: Request & { user: AccessTokenPayload },
  ) {
    return this.orderService.create(
      body.total,
      body.subtotal,
      req.user.sub,
      body.shippingMethodId,
      body.items,
    );
  }

  @Get('')
  findOne(@Query() query: FindOrderDto) {
    return this.orderService.find(query.orderId);
  }

  @Get('/all')
  findAll(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.orderService.findAllForUser(req.user.sub);
  }

  @Get('/complete')
  findCompete(@Query() query: FindOrderDto) {
    return this.orderService.findComplete(query.orderId);
  }

  @Get('/delivery-methods')
  getDeliveryMethods() {
    return this.orderService.findAllShippingMethods();
  }

  @Post('/delivery-methods')
  createDeliveryMethods(@Body() body: CreateDeliveryMethod) {
    return this.orderService.createShippingMethod(body);
  }
}
