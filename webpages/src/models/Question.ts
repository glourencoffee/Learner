export enum QuestionType {
  BOOLEAN         = 'boolean',
  MULTIPLE_CHOICE = 'multiple-choice'
}

export enum DifficultyLevel {
  EASY   = 'easy',
  MEDIUM = 'medium',
  HARD   = 'hard'
}

export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: QuestionOption[];
  correctOptionIndex?: number;
  difficultyLevel: DifficultyLevel;
  topicIds: number[];
  explanationText: string;
}

export interface QuestionWithoutId extends Omit<Question, 'id'> {}

/**
 * Returns whether a string case-insensitively matches the words
 * `'true'` or `'false'`.
 * 
 * @param value A string.
 * @returns Whether it matches a boolean string.
 */
export function isBooleanString(value: string): boolean {
  const lc = value.toLowerCase();

  return (lc === 'true' || lc === 'false');
}

/**
 * Returns a question type from a list of question options.
 * 
 * If `options` has exactly 2 items which case-insensitively match
 * "True" and "False", in any order, returns `QuestionType.BOOLEAN`.
 * Otherwise, returns `QuestionType.MULTIPLE_CHOICE`.
 *
 * @param options A question options.
 * @returns A question type.
 * @see `isBooleanString`
 */
export function getQuestionType(options: string[]): QuestionType {
  return (
    ((options.length === 2) &&
     (isBooleanString(options[0])) &&
     (isBooleanString(options[1])))
    ? QuestionType.BOOLEAN
    : QuestionType.MULTIPLE_CHOICE
  );
}