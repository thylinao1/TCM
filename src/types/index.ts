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
  participantName?: string;
  participantEmail?: string;
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

export const mapDbSession = (db: any): Session => ({
  id: db.id,
  courseName: db.course_name,
  trainerName: db.trainer_name,
  date: db.date,
  companyTaught: db.company_taught,
  trainerNotes: db.trainer_notes || '',
  surveysCompleted: db.surveys_completed || { pre: false, end: false, refresher: false },
  surveys: db.surveys,
  responses: [] 
});

export const mapDbResponse = (db: any): SurveyResponse => ({
  id: db.id,
  stage: db.stage,
  submittedAt: db.submitted_at,
  participantName: db.participant_name,
  participantEmail: db.participant_email,
  answers: db.answers
});
