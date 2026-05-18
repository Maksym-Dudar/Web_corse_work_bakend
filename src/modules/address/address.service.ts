import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { AddressRepository } from "./address.repository";

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
    const { id, ...addressData } = address;
    const updatedAddress = await this.addressRepo.update(id, userId, {
      ...addressData,
    });

    if (!updatedAddress) {
      throw new NotFoundException("Address not found");
    }

    return updatedAddress;
  }
  async getAllUserAddress(id: number) {
    return this.addressRepo.findAllUserAddress(id);
  }
}
