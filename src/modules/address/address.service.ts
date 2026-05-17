import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepository) {}

  async createAddress(address: CreateAddressDto, userId: number) {
    return this.addressRepo.create({
      ...address,
      user: { connect: { id: userId } },
    });
  }
  async updateAddress(address: UpdateAddressDto, userId: number) {
    return this.addressRepo.update(address.id, {
      ...address,
      user: { connect: { id: userId } },
    });
  }
  async getAllUserAddress(id: number) {
    return this.addressRepo.findAllUserAddress(id);
  }
}
