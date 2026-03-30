export interface Session {
  id: string;
  courseName: string;
  date: string;
  companyTaught: string;
  trainerNotes: string;
  surveysCompleted: { pre: boolean; end: boolean; refresher: boolean };
}

export interface FeedbackScenario {
  id: string;
  scenarioText: string;
  prompt: string;
  rubric: string[];
  managerChecklist: string[];
}
