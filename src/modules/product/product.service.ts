import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Sorts } from '@/common/enums/sorts.enum';
import { mapSortToPrisma } from '@/common/utils/map-sort-to-prisma';
import { DIRECTORY } from '@/configs/directory.config';
import { Category, Prisma } from '@prisma/client';

const RAW_IMAGE_BASE_URL =
  process.env.IMAGE_BASE_URL ?? 'https://localhost:4200';
const IMAGE_BASE_URL = RAW_IMAGE_BASE_URL.endsWith('/')
  ? RAW_IMAGE_BASE_URL.slice(0, -1)
  : RAW_IMAGE_BASE_URL;

const buildImageUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return path[0] === '/'
    ? `${IMAGE_BASE_URL}${path}`
    : `${IMAGE_BASE_URL}/${path}`;
};

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async findManyShop(params: {
    skip: number;
    take: number;
    sort?: Sorts;
    category?: Category | 'ALL';
    maxPrice?: number;
    minPrice?: number;
    groupId?: number[];
  }) {
    const {
      skip,
      take,
      maxPrice,
      minPrice = 0,
      category = 'ALL',
      sort = Sorts.newest,
      groupId,
    } = params;

    const where: any = {
      price: { gte: minPrice, ...(maxPrice ? { lte: maxPrice } : {}) },
      ...(groupId ? { productGroupId: { in: groupId } } : {}),
      ...(category !== 'ALL' ? { category: { hasSome: [category] } } : {}),
    };
    const orderBy = mapSortToPrisma(sort);

    const products = await this.productRepo.findManyShopCards({
      skip,
      take,
      where,
      orderBy,
    });

    return products.map((p) => ({
      ...p,
      title: p.productGroup.title,
      image: buildImageUrl(p.image[0]),
      priceWithSale: Number(p.price) - Number(p.price) * Number(p.sale),
    }));
  }

  async findManySearch(query: string) {
    const groups = await this.productRepo.findManyGroup();

    const words = query.trim().toLowerCase().split(/\s+/).slice(0, 2);

    return groups.filter((val) =>
      words.every((word) => val.title.toLowerCase().includes(word)),
    );
  }

  async findManyCart(ids: number[]) {
    console.log(ids);
    const data = await this.productRepo.findManyCartCards(ids);
    return data.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: buildImageUrl(val.image[0]),
    }));
  }

  async findManyWishlist(ids: number[]) {
    const data = await this.productRepo.findManyWishlistCards(ids);
    return data.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: buildImageUrl(val.image[0]),
    }));
  }

  async create(data: CreateProductDto, files: Express.Multer.File[]) {
    if (!files || files.length == 0) {
      throw new BadRequestException("Files don't found");
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Incorrect image format');
      }
    }

    const { title, productGroupId, ...rest } = data;
    let productGroupIdFinal = productGroupId;
    if (productGroupId == -1) {
      const group = await this.productRepo.createProductGroup(title);
      productGroupIdFinal = group.id;
    }

    const productInput: Prisma.ProductCreateInput = {
      ...rest,
      image: [],
      rating: 5,
      reviews: 0,
      productGroup: { connect: { id: productGroupIdFinal } },
    };

    const product = await this.productRepo.createProduct(productInput);

    const imagePath: string[] = [];

    for (const file of files) {
      const uploadDir = path.join(
        process.cwd(),
        DIRECTORY.PRODUCT,
        `${product.id}`,
      );
      await fs.mkdir(uploadDir, { recursive: true });
      const extension = path.extname(file.originalname).toLowerCase();
      const safeExtension = extension.replace(/[^a-z0-9.]/gi, '');
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExtension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      imagePath.push(`${DIRECTORY.PRODUCT}/${product.id}/${fileName}`);
    }
    return await this.productRepo.updateProduct(product.id, {
      image: imagePath,
    });
  }

  async findManyGroup() {
    return await this.productRepo.findManyGroup();
  }

  async findDetail(id: number) {
    const details = await this.productRepo.findDetail(id);

    if (!details) throw new NotFoundException('Product not found');

    const { productGroup, image, ...res } = details;
    const { title, product } = productGroup;

    const imageUrl = image.map((val) => buildImageUrl(val));
    const sameProduct = product.map((val) => ({
      color: val.color,
      id: val.id,
      image: buildImageUrl(val.image[0]),
      isActive: val.quantityWarehouse > 0,
    }));
    return {
      ...res,
      title,
      sameProduct,
      image: imageUrl,
      priceWithSale: Number(res.price) - Number(res.price) * Number(res.sale),
    };
  }
}
