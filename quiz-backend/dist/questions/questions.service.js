"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./entities/question.entity");
const category_entity_1 = require("./entities/category.entity");
const llm_question_generator_service_1 = require("./llm-question-generator.service");
let QuestionsService = class QuestionsService {
    questionRepo;
    categoryRepo;
    llmGenerator;
    constructor(questionRepo, categoryRepo, llmGenerator) {
        this.questionRepo = questionRepo;
        this.categoryRepo = categoryRepo;
        this.llmGenerator = llmGenerator;
    }
    async getCategories() {
        return this.categoryRepo.find({ order: { name: 'ASC' } });
    }
    async getByCategory(categoryId, limit = 50) {
        return this.questionRepo.find({
            where: { categoryId, validated: true },
            take: limit,
        });
    }
    async generateAndStore(dto) {
        const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!category)
            throw new Error('Category not found');
        const generated = await this.llmGenerator.generate(category.name, dto.difficulty, dto.count);
        const saved = [];
        for (const g of generated) {
            const question = this.questionRepo.create({
                categoryId: dto.categoryId,
                text: g.text,
                options: g.options,
                correctOptionIndex: g.correctOptionIndex,
                difficulty: dto.difficulty,
                source: 'llm_generated',
                validated: true,
            });
            saved.push(await this.questionRepo.save(question));
        }
        return saved;
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        llm_question_generator_service_1.LlmQuestionGeneratorService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map