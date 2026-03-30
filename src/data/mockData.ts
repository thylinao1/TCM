import type { Session, SurveyTemplate } from '../types';

export const tcmServicesList = [
  'The Investigation Company',
  'The Mediation Company',
  'Resolution Framework',
  'The TCM Academy',
  'The People and Culture Association',
  'Engage Leadership',
  'Engage Coaching',
  'People and Culture',
  'Other:'
];

export const preSessionTemplate: SurveyTemplate = {
  title: 'Pre-Session Preparation form',
  questions: [
    { id: '1', type: 'text', text: 'What motivated you to attend this course?' },
    { id: '2', type: 'text', text: 'Describe a recent situation related to this course topic that you had to deal with. What did you do?' },
    { id: '3', type: 'choice', text: 'Which statement best describes your current confidence in handling situations related to this course?', options: [
      'I handle these situations effectively',
      'I manage some aspects but struggle with others',
      'I often feel unsure or avoid these situations',
      'I have little or no experience with these situations'
    ]},
    { id: '4', type: 'text', text: 'What is one situation in your role at work, where you would most like to improve your approach related to this course?' },
    { id: '5', type: 'text', text: 'What skills, behavior or capabilities do you hope to achieve from this training course?' },
    { id: '6', type: 'text', text: 'Is there anything else you feel the trainer needs to know to help ensure your experience meets your needs?' },
    { id: '7', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please don’t use'] },
    { id: '8', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: tcmServicesList }
  ]
};

export const endSessionTemplate: SurveyTemplate = {
  title: 'Learner Reflection Form',
  questions: [
    { id: '1', type: 'text', text: 'What is one concept, tool, or idea from today that you understand clearly and could explain to someone else?' },
    { id: '2', type: 'text', text: 'Imagine you’re back at work tomorrow. Which situation would you apply this training to first, and what would you do differently?' },
    { id: '3', type: 'choice', text: 'Choose the statement that best describes your readiness to apply what you learned:', options: [
      'I can confidently apply the tools in real situations',
      'I can apply some tools but would like more practice',
      'I understand the concepts but don’t yet feel ready to use them',
      'I’m unclear on how to apply the tools'
    ]},
    { id: '4', type: 'choice', text: 'During the session, you practised scenarios or role-plays. Which statement best reflects your performance?', options: [
      'I demonstrated the behaviors effectively',
      'I partially demonstrated them and know what to improve',
      'I struggled to demonstrate the behaviors',
      'We didn’t do a scenario/role-play'
    ]},
    { id: '5', type: 'text', text: 'What positive outcome do you expect this training to help you achieve in your role?' },
    { id: '6', type: 'text', text: 'What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '7', type: 'choice', text: 'Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '8', type: 'text', text: 'TCM loves celebrating our customers’ successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '9', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please don’t use'] },
    { id: '10', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: tcmServicesList },
    { id: '11', type: 'scale', text: 'Overall, how would you rate the course? (Please shade in the stars with 1 being very poor and 5 being very good)' }
  ]
};

export const refresherTemplate: SurveyTemplate = {
  title: 'Learning Transfer Report',
  questions: [
    { id: '1', type: 'text', text: 'List the situations where you felt like you had an opportunity to apply the training at work, in the past month.' },
    { id: '2', type: 'text', text: 'Describe a real situation where you applied something from the training at work. What was the situation? Which specific skill or method did you use? What did you do step-by-step? What happened as a result?' },
    { id: '3', type: 'text', text: 'Which parts of the training felt difficult to apply in real work? Why?' },
    { id: '4', type: 'text', text: 'Since the training, what have you done differently at work?' },
    { id: '5', type: 'text', text: 'What support, tools, or conditions helped you apply what you learnt?' },
    { id: '6', type: 'text', text: 'What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '7', type: 'choice', text: 'Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '8', type: 'text', text: 'TCM loves celebrating our customers’ successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '9', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please don’t use'] },
    { id: '10', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: tcmServicesList },
    { id: '11', type: 'scale', text: 'Overall, how would you rate the usefulness of the course? (Please shade in the stars with 1 being very poor and 5 being very good)' }
  ]
};


export const initialSessions: Session[] = [
  {
    id: 'b6e83',
    courseName: 'Leadership Q3',
    date: '2026-04-10',
    companyTaught: 'ACME Corp',
    trainerNotes: 'Needs focus on remote communication.',
    surveysCompleted: { pre: true, end: false, refresher: false },
    surveys: {
      pre: JSON.parse(JSON.stringify(preSessionTemplate)),
      end: JSON.parse(JSON.stringify(endSessionTemplate)),
      refresher: JSON.parse(JSON.stringify(refresherTemplate))
    }
  },
  {
    id: 'f9a21',
    courseName: 'Management Basics 101',
    date: '2026-04-15',
    companyTaught: 'Globex Inc',
    trainerNotes: '',
    surveysCompleted: { pre: false, end: false, refresher: false },
    surveys: {
      pre: JSON.parse(JSON.stringify(preSessionTemplate)),
      end: JSON.parse(JSON.stringify(endSessionTemplate)),
      refresher: JSON.parse(JSON.stringify(refresherTemplate))
    }
  }
];

export const mockAiScenario = {
  scenarioText: 'A team member is continuously late to morning standups but delivers high-quality work.',
  prompt: 'Based on the LTEM principles, how do you address this without demotivating them?',
  rubric: ['Success: Addresses the lateness privately.', 'Red Flag: Punishes them publicly.', 'Red Flag: Ignores the issue.'],
  managerChecklist: ['Observe next 3 standups', 'Check 1-on-1 meeting notes to verify conversation happened']
};
