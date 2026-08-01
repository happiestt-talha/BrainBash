"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchModule = void 0;
Now;
update;
MatchModule;
to;
wire in all;
the;
repositories;
match.service.ts;
actually;
needs;
this;
replaces;
the;
earlier;
version: quiz - backend / src / match / match.module.ts;
typescript;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const match_gateway_1 = require("./match.gateway");
const match_service_1 = require("./match.service");
const match_state_store_1 = require("./match-state.store");
const scoring_module_1 = require("../scoring/scoring.module");
const match_entity_1 = require("./entities/match.entity");
const match_participant_entity_1 = require("./entities/match-participant.entity");
const match_question_entity_1 = require("./entities/match-question.entity");
const match_answer_entity_1 = require("./entities/match-answer.entity");
const room_entity_1 = require("../rooms/entities/room.entity");
const question_entity_1 = require("../questions/entities/question.entity");
let MatchModule = class MatchModule {
};
exports.MatchModule = MatchModule;
exports.MatchModule = MatchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([match_entity_1.Match, match_participant_entity_1.MatchParticipant, match_question_entity_1.MatchQuestion, match_answer_entity_1.MatchAnswer, room_entity_1.Room, question_entity_1.Question]),
            scoring_module_1.ScoringModule,
        ],
        providers: [match_gateway_1.MatchGateway, match_service_1.MatchService, match_state_store_1.MatchStateStore],
    })
], MatchModule);
//# sourceMappingURL=match.module.js.map