import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.roomsService.findByCode(code);
  }
}