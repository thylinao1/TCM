import type { Session, SurveyTemplate, FeedbackScenario, SurveyResponse } from '../types';

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

export const mockAiScenariosLibrary: FeedbackScenario[] = [
  {
    id: 'ai-1',
    scenarioText: 'A team member is continuously late to morning standups but delivers high-quality work.',
    prompt: 'Based on the LTEM principles, how do you address this without demotivating them?',
    rubric: ['Success: Addresses the lateness privately.', 'Red Flag: Punishes them publicly.', 'Red Flag: Ignores the issue.'],
    managerChecklist: ['Observe next 3 standups', 'Check 1-on-1 meeting notes to verify conversation happened']
  },
  {
    id: 'ai-2',
    scenarioText: 'Two colleagues are arguing loudly in an open-plan office over a shared project deliverable.',
    prompt: 'Applying the conflict resolution tools discussed today, outline your immediate next steps.',
    rubric: ['Success: De-escalates the public argument by moving them to a private room.', 'Red Flag: Takes sides in front of the team.', 'Success: Asks open-ended questions to uncover the root cause.'],
    managerChecklist: ['Monitor tension levels over 2 weeks', 'Review post-project feedback from both individuals']
  },
  {
    id: 'ai-3',
    scenarioText: 'A remote employee seems disconnected during meetings and misses minor email deadlines repeatedly.',
    prompt: 'How would you re-engage this employee using the structured empathy framework?',
    rubric: ['Success: Begins a 1-on-1 with a wellness check.', 'Red Flag: Immediately issues a formal warning.', 'Red Flag: Assumes they are looking for a new job without asking.'],
    managerChecklist: ['Track meeting participation rate over 1 month', 'Review weekly deadline hit-rate in Jira/Asana']
  }
];

const robustEndSessionTemplate = JSON.parse(JSON.stringify(endSessionTemplate));
robustEndSessionTemplate.questions.unshift({
  id: 'dynamic-ai-2',
  type: 'text',
  text: `[AI Scenario 1]: ${mockAiScenariosLibrary[1].scenarioText}\n\nQuestion: ${mockAiScenariosLibrary[1].prompt}` 
});
robustEndSessionTemplate.questions.unshift({
  id: 'dynamic-ai-1',
  type: 'text',
  text: `[AI Scenario 2]: ${mockAiScenariosLibrary[0].scenarioText}\n\nQuestion: ${mockAiScenariosLibrary[0].prompt}` 
});

const mockPopulatedResponses: SurveyResponse[] = [
  // ================= PRE SESSION=================
  { id: 'pre-1', stage: 'pre', submittedAt: '2026-04-01T10:00:00Z', answers: {
    '1': 'I struggle to moderate my tone when I get stressed.', '3': 'I manage some aspects but struggle with others'
  }},
  { id: 'pre-2', stage: 'pre', submittedAt: '2026-04-01T11:30:00Z', answers: {
    '1': 'My manager suggested it.', '3': 'I often feel unsure or avoid these situations'
  }},
  { id: 'pre-3', stage: 'pre', submittedAt: '2026-04-02T09:15:00Z', answers: {
    '1': 'Looking for tools to de-escalate cross-departmental arguments.', '3': 'I manage some aspects but struggle with others'
  }},
  { id: 'pre-4', stage: 'pre', submittedAt: '2026-04-02T14:45:00Z', answers: {
    '1': 'I am taking on a new leadership role.', '3': 'I have little or no experience with these situations'
  }},
  { id: 'pre-5', stage: 'pre', submittedAt: '2026-04-03T16:20:00Z', answers: {
    '1': 'Dealing with a difficult client who creates internal team friction.', '3': 'I handle these situations effectively'
  }},

  // ================= END SESSION =================
  { id: 'end-1', stage: 'end', submittedAt: '2026-04-10T16:05:00Z', answers: {
      'dynamic-ai-1': 'I would pull them aside in private after the meeting and ask gently if there are structural barriers preventing them from making the standup on time.',
      'dynamic-ai-2': 'I would approach them calmly and take this into a meeting room so we don\'t disrupt everyone.',
      '1': 'The structured empathy framework. It makes complete sense to focus on emotional reality first.',
      '3': 'I can confidently apply the tools in real situations',
      '4': 'I demonstrated the behaviors effectively',
      '7': 'Yes',
      '11': '5'
  }},
  { id: 'end-2', stage: 'end', submittedAt: '2026-04-10T16:07:30Z', answers: {
      'dynamic-ai-1': 'I would just ignore it because they are a top performer.',
      'dynamic-ai-2': 'I\'d step between them and tell them they are acting unprofessionally and that they need to get back to their desks immediately. Then I would email their manager.',
      '1': 'Active listening and the resolution triangle.',
      '3': 'I can apply some tools but would like more practice',
      '4': 'I partially demonstrated them and know what to improve',
      '7': 'Maybe',
      '11': '3'
  }},
  { id: 'end-3', stage: 'end', submittedAt: '2026-04-10T16:12:00Z', answers: {
      'dynamic-ai-1': 'Set up a private 15 minute call. Ask open ended questions about their morning routine.',
      'dynamic-ai-2': 'Move them to a private space immediately. Use the "seek to understand" method by asking what exactly is blocking the shared deliverable.',
      '1': 'Conflict de-escalation steps using physical barriers and tone matching.',
      '3': 'I can confidently apply the tools in real situations',
      '4': 'I demonstrated the behaviors effectively',
      '7': 'Yes',
      '11': '4'
  }},
  { id: 'end-4', stage: 'end', submittedAt: '2026-04-10T16:20:45Z', answers: {
      'dynamic-ai-1': 'I would bring it up at the very next standup in front of everyone so the whole team knows the standard applied to everyone.',
      'dynamic-ai-2': 'Tell them to stop acting like children and provide them a direct command on how to split the deliverable.',
      '1': 'Honestly I didn\'t learn much that I didn\'t already know as a manager.',
      '3': 'I can confidently apply the tools in real situations',
      '4': 'I demonstrated the behaviors effectively',
      '7': 'No',
      '11': '1'
  }},
  { id: 'end-5', stage: 'end', submittedAt: '2026-04-10T16:25:12Z', answers: {
      'dynamic-ai-1': 'Talk to them in private. Find out if there are childcare or transit issues.',
      'dynamic-ai-2': 'Gently suggest we go grab a coffee in the breakroom to discuss it quietly. Listen actively.',
      '1': 'The "Red Flag vs Success" rubric concept was very good.',
      '3': 'I can confidently apply the tools in real situations',
      '4': 'I partially demonstrated them and know what to improve',
      '7': 'Yes',
      '11': '5'
  }},

  // ================= REFRESHER SESSION (30-day follow up) =================
  { id: 'ref-1', stage: 'refresher', submittedAt: '2026-05-10T09:00:00Z', answers: {
    '1': 'A developer and a designer were clashing over specs.',
    '2': 'I pulled them into a room, used the resolution triangle, and let them both outline their critical path. They resolved it within 15 minutes.',
    '7': 'Yes',
    '11': '5'
  }},
  { id: 'ref-2', stage: 'refresher', submittedAt: '2026-05-11T11:15:00Z', answers: {
    '1': 'I had to fire someone.',
    '2': 'I didn\'t use the tools, I just relied on HR.',
    '7': 'No',
    '11': '2'
  }},
  { id: 'ref-3', stage: 'refresher', submittedAt: '2026-05-12T14:30:00Z', answers: {
    '1': 'A junior team member was constantly missing sprint deadlines.',
    '2': 'Rather than putting them on a PIP, I assumed positive intent and asked open-ended questions. Turns out they were caring for a sick parent. We altered their hours successfully.',
    '7': 'Yes',
    '11': '4'
  }},
  { id: 'ref-4', stage: 'refresher', submittedAt: '2026-05-13T10:00:00Z', answers: {
    '1': 'None. Haven\'t had a chance to apply it.',
    '7': 'Maybe',
    '11': '3'
  }},
  { id: 'ref-5', stage: 'refresher', submittedAt: '2026-05-14T16:45:00Z', answers: {
    '1': 'An aggressive vendor was making unfair demands.',
    '2': 'I maintained tone control and used strategic silence to de-escalate their demands over the phone.',
    '7': 'Yes',
    '11': '5'
  }}
];

export const initialSessions: Session[] = [
  {
    id: 'b6e83',
    courseName: 'Leadership Executive Coaching (Q3)',
    trainerName: 'Sarah Jenkins',
    date: '2026-04-10',
    companyTaught: 'ACME Corp',
    trainerNotes: 'Needs focus on remote communication.',
    surveysCompleted: { pre: true, end: true, refresher: true },
    surveys: {
      pre: JSON.parse(JSON.stringify(preSessionTemplate)),
      end: robustEndSessionTemplate,
      refresher: JSON.parse(JSON.stringify(refresherTemplate))
    },
    responses: mockPopulatedResponses
  },
  {
    id: 'f9a21',
    courseName: 'Management Basics 101',
    trainerName: 'David Lee',
    date: '2026-04-15',
    companyTaught: 'Globex Inc',
    trainerNotes: '',
    surveysCompleted: { pre: false, end: false, refresher: false },
    surveys: {
      pre: JSON.parse(JSON.stringify(preSessionTemplate)),
      end: JSON.parse(JSON.stringify(endSessionTemplate)),
      refresher: JSON.parse(JSON.stringify(refresherTemplate))
    },
    responses: []
  }
];
