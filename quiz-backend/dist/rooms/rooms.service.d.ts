import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private roomsRepo;
    constructor(roomsRepo: Repository<Room>);
    private generateRoomCode;
    createRoom(dto: CreateRoomDto, hostUserId?: string): Promise<Room>;
    findByCode(code: string): Promise<Room>;
}
