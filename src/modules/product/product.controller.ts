import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { FindManyShopDto } from "./dto/find-many-shop.dto";
import { FindManySearchDto } from "./dto/find-many-search.dto";
import { FindManyBagDto } from "./dto/find-many-bag.dto";
import { FindManyWishlistDto } from "./dto/find-many-wishlist.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { FindDetailsDto } from "./dto/find-details.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("images"))
  createProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ) {
    if (!images || !Array.isArray(images))
      throw new BadRequestException("Images incorect");

    return this.productService.create(body, images);
  }

  @Get("cards")
  findManyShop(@Query() query: FindManyShopDto) {
    const { take, page = 1, ...rest } = query;
    const skip = (page - 1) * take;
    return this.productService.findManyShop({ skip, take: take, ...rest });
  }

  @Get("search")
  findManySearch(@Query() query: FindManySearchDto) {
    return this.productService.findManySearch(query.search);
  }

  @Get("bag")
  findManyCart(@Query() query: FindManyBagDto) {
    return this.productService.findManyCart(query.ids);
  }
  @Get("wishlist")
  findManyWishlist(@Query() query: FindManyWishlistDto) {
    return this.productService.findManyWishlist(query.ids);
  }

  @Get("group")
  findManyGroup() {
    return this.productService.findManyGroup();
  }

  @Get("details")
  findDetail(@Query() query: FindDetailsDto) {
    return this.productService.findDetail(query.id);
  }
}
