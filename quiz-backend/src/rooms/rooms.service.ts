import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
  ) {}

  private generateRoomCode(): string {
    // 6 chars, uppercase letters + digits, no ambiguous chars (0/O, 1/I)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async createRoom(dto: CreateRoomDto, hostUserId?: string): Promise<Room> {
    let code = this.generateRoomCode();
    // ensure uniqueness — rare collision but worth guarding
    while (await this.roomsRepo.findOne({ where: { code } })) {
      code = this.generateRoomCode();
    }

    const room = this.roomsRepo.create({
      code,
      categoryId: dto.categoryId,
      difficulty: (dto.difficulty as any) ?? 'mixed',
      hostUserId,
      status: 'lobby',
    });

    return this.roomsRepo.save(room);
  }

  async findByCode(code: string): Promise<Room> {
    const room = await this.roomsRepo.findOne({ where: { code: code.toUpperCase() } });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}