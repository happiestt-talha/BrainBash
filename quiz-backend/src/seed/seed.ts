import { DataSource } from 'typeorm';
import { Category } from '../questions/entities/category.entity';
import { Question } from '../questions/entities/question.entity';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Category, Question],
  synchronize: false,
});

const CATEGORIES = [
  { name: 'General Knowledge', sourceType: 'curated' as const },
  { name: '2000s Nostalgia', sourceType: 'curated' as const },
  { name: 'Movies & Cartoons', sourceType: 'curated' as const },
  { name: 'Basic Math', sourceType: 'curated' as const },
  { name: 'IQ / Logic', sourceType: 'curated' as const },
];

// A small starter bank so you can actually run a match before the LLM
// generation pipeline is producing validated questions. Expand this as
// you go — 10 questions is enough to test one full match end to end.
const STARTER_QUESTIONS: Record<string, { text: string; options: string[]; correctOptionIndex: number; difficulty: 'easy' | 'medium' | 'hard' }[]> = {
  'General Knowledge': [
    { text: 'What is the capital of Pakistan?', options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'], correctOptionIndex: 2, difficulty: 'easy' },
    { text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctOptionIndex: 1, difficulty: 'easy' },
    { text: 'Who wrote the play Romeo and Juliet?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Leo Tolstoy'], correctOptionIndex: 1, difficulty: 'easy' },
  ],
  '2000s Nostalgia': [
    { text: 'Which cartoon featured a boy who could bend water, earth, fire, and air?', options: ['Ben 10', 'Avatar: The Last Airbender', 'Teen Titans', 'Danny Phantom'], correctOptionIndex: 1, difficulty: 'easy' },
    { text: 'What was the name of the virtual pet craze popular in the early 2000s alongside Tamagotchi?', options: ['Furby', 'Giga Pet', 'Neopets', 'Webkinz'], correctOptionIndex: 2, difficulty: 'medium' },
  ],
  'Movies & Cartoons': [
    { text: 'In Finding Nemo, what type of fish is Nemo?', options: ['Clownfish', 'Angelfish', 'Blue Tang', 'Goldfish'], correctOptionIndex: 0, difficulty: 'easy' },
    { text: 'Which Pixar movie is about emotions inside a girl\'s mind?', options: ['Soul', 'Inside Out', 'Up', 'Coco'], correctOptionIndex: 1, difficulty: 'easy' },
  ],
  'Basic Math': [
    { text: 'What is 12 x 8?', options: ['86', '96', '106', '108'], correctOptionIndex: 1, difficulty: 'easy' },
    { text: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctOptionIndex: 2, difficulty: 'easy' },
  ],
  'IQ / Logic': [
    { text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?', options: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'], correctOptionIndex: 0, difficulty: 'medium' },
  ],
};

async function seed() {
  await dataSource.initialize();
  const categoryRepo = dataSource.getRepository(Category);
  const questionRepo = dataSource.getRepository(Question);

  for (const cat of CATEGORIES) {
    let category = await categoryRepo.findOne({ where: { name: cat.name } });
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create(cat));
      console.log(`Created category: ${cat.name} (${category.id})`);
    } else {
      console.log(`Category already exists: ${cat.name} (${category.id})`);
    }

    const questions = STARTER_QUESTIONS[cat.name] ?? [];
    for (const q of questions) {
      const exists = await questionRepo.findOne({ where: { text: q.text } });
      if (exists) continue;

      await questionRepo.save(
        questionRepo.create({
          categoryId: category.id,
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          difficulty: q.difficulty,
          source: 'curated',
          validated: true,
        }),
      );
    }
    console.log(`Seeded ${questions.length} questions for ${cat.name}`);
  }

  await dataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});