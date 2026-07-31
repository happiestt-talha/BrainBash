import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    create(dto: CreateRoomDto): Promise<import("./entities/room.entity").Room>;
    findByCode(code: string): Promise<import("./entities/room.entity").Room>;
}
