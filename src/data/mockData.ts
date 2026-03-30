import { Session, FeedbackScenario } from '../types';

export const initialSessions: Session[] = [
  {
    id: '1',
    courseName: 'Leadership Q3',
    date: '2026-04-10',
    companyTaught: 'ACME Corp',
    trainerNotes: 'Needs focus on remote communication.',
    surveysCompleted: { pre: true, end: false, refresher: false }
  },
  {
    id: '2',
    courseName: 'Management Basics 101',
    date: '2026-04-15',
    companyTaught: 'Globex Inc',
    trainerNotes: '',
    surveysCompleted: { pre: false, end: false, refresher: false }
  }
];

export const mockAiScenario = {
  scenarioText: 'A team member is continuously late to morning standups but delivers high-quality work.',
  prompt: 'Based on the LTEM principles, how do you address this without demotivating them?',
  rubric: ['Success: Addresses the lateness privately.', 'Red Flag: Punishes them publicly.', 'Red Flag: Ignores the issue.'],
  managerChecklist: ['Observe next 3 standups', 'Check 1-on-1 meeting notes to verify conversation happened']
};
