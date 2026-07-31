"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEvents = void 0;
var MatchEvents;
(function (MatchEvents) {
    MatchEvents["ROOM_JOIN"] = "room:join";
    MatchEvents["ROOM_PLAYER_JOINED"] = "room:player-joined";
    MatchEvents["ROOM_PLAYER_LEFT"] = "room:player-left";
    MatchEvents["ROOM_ASSIGN_TEAM"] = "room:assign-team";
    MatchEvents["ROOM_TEAM_ASSIGNED"] = "room:team-assigned";
    MatchEvents["ROOM_START_MATCH"] = "room:start-match";
    MatchEvents["MATCH_STARTED"] = "match:started";
    MatchEvents["QUESTION_PUSH"] = "question:push";
    MatchEvents["ANSWER_SUBMIT"] = "answer:submit";
    MatchEvents["ANSWER_ACK"] = "answer:ack";
    MatchEvents["QUESTION_PLAYER_ANSWERED"] = "question:player-answered";
    MatchEvents["QUESTION_REVEAL"] = "question:reveal";
    MatchEvents["SCOREBOARD_UPDATE"] = "scoreboard:update";
    MatchEvents["MATCH_NEXT_QUESTION"] = "match:next-question";
    MatchEvents["MATCH_ENDED"] = "match:ended";
    MatchEvents["PLAYER_DISCONNECTED"] = "player:disconnected";
    MatchEvents["PLAYER_RECONNECTED"] = "player:reconnected";
    MatchEvents["MATCH_STATE_SYNC"] = "match:state-sync";
})(MatchEvents || (exports.MatchEvents = MatchEvents = {}));
//# sourceMappingURL=match-events.enum.js.map