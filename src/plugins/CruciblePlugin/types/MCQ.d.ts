type QuizMode = "Timed" | "Tutor";

export interface StartQuizConfig {
  questionAmount: number;
  mode: QuizMode;
  timeLimit: number;
}

export interface MCQQuiz {
  questions: MCQuestion[];
}

export interface MCQuestion {
  _id: { $oid: string };
  statement: string;
  tags: tags;
  optionsList: MCQOptions[];
  link: string;
  className?: string;
}

export interface MCQuestionProp
  extends Omit<MCQuestion, "tags" | "link" | "_id"> {}

export interface MCQOptions {
  optionValue: string;
  optionCorrect?: boolean;
}

export interface MCQButton {
  submitted: boolean;
  selectedOption: string | null;
  hideSkip: boolean;
}

export interface MCQRadioOption {
  optionKey: string;
  checked: boolean;
  option: MCQOptions;
  submitted: boolean;
}

export interface MCQResult {
  quizStatus: QuestionState[];
  workQuiz: number;
}

export interface QuestionState {
  question: MCQuestion;
  correct: number;
  skipped: number;
  attempts: number;
  selectedValue: string;
}

export interface tags {
  course: string;
  subject: string;
  system: string;
  animal: string;
}

export interface SelectedTags {
  course: string[];
  subject: string[];
  system: string[];
  animal: string[];
}