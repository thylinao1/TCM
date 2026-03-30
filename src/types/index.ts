export type QuestionType = 'text' | 'choice' | 'scale' | 'checkbox';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export interface SurveyTemplate {
  title: string;
  questions: Question[];
}

export interface SurveyResponse {
  id: string;
  stage: 'pre' | 'end' | 'refresher';
  submittedAt: string;
  answers: Record<string, string | string[]>;
}

export interface Session {
  id: string;
  courseName: string;
  trainerName: string;
  date: string;
  companyTaught: string;
  trainerNotes: string;
  surveysCompleted: { pre: boolean; end: boolean; refresher: boolean };
  surveys: {
    pre: SurveyTemplate;
    end: SurveyTemplate;
    refresher: SurveyTemplate;
  };
  responses: SurveyResponse[];
}

export interface FeedbackScenario {
  id: string;
  scenarioText: string;
  prompt: string;
  rubric: string[];
  managerChecklist: string[];
}
