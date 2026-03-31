import type { Session, SurveyResponse, FeedbackScenario, SurveyTemplate } from '../types';

export const mockAiScenariosLibrary: FeedbackScenario[] = [
  {
    id: 'ai-req-1',
    scenarioText: "A vendor calls you furious that their invoice hasn't been paid for 60 days. They are threatening to halt all services tomorrow, which would stop production.",
    prompt: "Write exactly what you would say on the phone right now to de-escalate this vendor.",
    rubric: [
      "Success: Acknowledged the vendor's frustration and urgency.",
      "Success: Committed to investigating the payment immediately.",
      "Fail: Defended the company's accounting department.",
      "Fail: Made a hard promise on a specific payment time without checking."
    ],
    managerChecklist: [
      "Remains calm under fire",
      "Avoids placing internal blame",
      "Focuses on process resolution"
    ]
  },
  {
    id: 'ai-req-2',
    scenarioText: "Your top-performing employee sends an email at 10pm saying they are 'burned out' and need to take 2 weeks of leave immediately starting tomorrow.",
    prompt: "Draft an email response to this employee.",
    rubric: [
      "Success: Prioritizes employee well-being over coverage gaps.",
      "Success: Approves the immediate time off unconditionally.",
      "Fail: Asks them to finish their current project first.",
      "Fail: Mentions the hardship this will put on the rest of the team."
    ],
    managerChecklist: [
      "Empathy first communication",
      "Decisive crisis management",
      "Protects psychological safety"
    ]
  }
];

export const preSessionTemplate: SurveyTemplate = {
  title: 'Learning Preparation Form',
  questions: [
    { id: '1', type: 'choice', text: 'A1. Sarah, a team leader in Finance, comes to you after a meeting. She is visibly upset because her colleague Tom publicly dismissed her proposal in front of the whole team. She wants you, as her manager, to speak to Tom and \'sort him out.\' What do you do?', options: [
      '[3] Listen to Sarah, acknowledge how she feels, and ask her what outcome she would ideally want from this situation before deciding on any action',
      '[2] Arrange a meeting with both Sarah and Tom together so they can talk it through, and mediate the conversation yourself',
      '[1] Speak to Tom privately and ask him to apologise to Sarah to prevent the situation from escalating',
      '[0] Tell Sarah that disagreements happen in meetings and she should try not to take professional feedback personally'
    ] },
    { id: '2', type: 'choice', text: 'A2. You have noticed that James, one of your direct reports in Operations, has been arriving late and missing deadlines over the past three weeks. His work quality has also dropped. Other team members have started commenting on it. You need to address this. What do you do?', options: [
      '[3] Schedule a private one-to-one with James, open with curiosity by asking how he is doing, and explore whether there are underlying issues before discussing the performance concerns',
      '[2] Send James an email outlining the specific instances of lateness and missed deadlines, and ask him to respond with an explanation and an improvement plan',
      '[1] Mention it casually at your next regular catch-up and hope the issue resolves itself once he knows you have noticed',
      '[0] Raise it at the next team meeting as a general reminder about punctuality and deadlines, without naming James, to avoid an awkward conversation'
    ] },
    { id: '3', type: 'text', text: 'B1. What motivated you to attend this course?' },
    { id: '4', type: 'text', text: 'B2. Describe a recent situation related to this course topic that you had to deal with. What did you do, and what was the result?' },
    { id: '5', type: 'choice', text: 'B3. Which statement best describes how you currently handle situations related to this course topic?', options: [
      '[4] I handle these situations effectively and get consistent positive results',
      '[3] I manage most aspects but still struggle with some',
      '[2] I often feel unsure or avoid these situations',
      '[1] I have little or no experience with these situations'
    ] },
    { id: '6', type: 'text', text: 'B4. What is one situation at work where you would most like to improve your approach related to this course?' },
    { id: '7', type: 'text', text: 'B5. What skills, behaviours, or capabilities do you hope to develop from this training?' },
    { id: '8', type: 'text', text: 'B6. Is there anything else the trainer needs to know to ensure this course meets your needs?' },
    { id: '9', type: 'text', text: 'Optional: Would you like to share a testimonial about your TCM experience?' },
    { id: '10', type: 'choice', text: 'Optional: May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please do not use'] },
    { id: '11', type: 'choice', text: 'Optional: Would you like information about other TCM services?', options: ['Yes, please get in touch', 'No, thank you'] },
    { id: '12', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] }
  ]
};

export const endSessionTemplate: SurveyTemplate = {
  title: 'Learner Reflection Form',
  questions: [
    { id: '1', type: 'choice', text: 'A1. Priya, a project coordinator in Marketing, sends you an urgent message after a client call. She is angry because her colleague Daniel interrupted her repeatedly during the presentation and took credit for her ideas in front of the client. She wants you to formally reprimand Daniel. What do you do?', options: [
      '[3] Meet with Priya privately, listen to her account, validate her frustration, and ask what resolution she would consider fair before taking any steps',
      '[2] Set up a three-way meeting with Priya and Daniel so they can air their perspectives, and facilitate the conversation yourself',
      '[1] Have a quiet word with Daniel and tell him to be more respectful of Priya\'s contributions in future meetings',
      '[0] Explain to Priya that client calls can be fast-paced and competitive, and suggest she be more assertive next time rather than relying on you to intervene'
    ] },
    { id: '2', type: 'choice', text: 'A2. Over the past month, you have noticed that Aisha, a team member in Customer Service, has been making more errors in her case notes and has seemed disengaged during team meetings. Two colleagues have separately mentioned to you that they are picking up extra work because of it. You need to address this. What do you do?', options: [
      '[3] Book a private conversation with Aisha, start by checking in on how she is feeling generally, and explore what might be behind the change before raising the specific performance concerns',
      '[2] Document the specific errors and instances of disengagement in an email to Aisha, and request a written improvement plan from her within one week',
      '[1] Wait until her next performance review, which is in six weeks, and raise it then along with other feedback points',
      '[0] Ask one of her closer colleagues to have a friendly word with her about picking up the pace, to keep it informal and avoid putting her on the spot'
    ] },
    { id: '3', type: 'choice', text: 'B1. Which statement best describes how you now feel about handling situations related to this course topic?', options: [
      '[4] I handle these situations effectively and get consistent positive results',
      '[3] I manage most aspects but still struggle with some',
      '[2] I often feel unsure or avoid these situations',
      '[1] I have little or no experience with these situations'
    ] },
    { id: '4', type: 'text', text: 'B2. What is one concept, tool, or idea from today that you understand clearly and could explain to a colleague?' },
    { id: '5', type: 'text', text: 'B3. What is the first thing you will do differently at work as a result of this training? With whom, and by when?' },
    { id: '6', type: 'choice', text: 'B4. If you practised scenarios or role-plays during the session, which statement best reflects your experience?', options: [
      '[4] I demonstrated the target behaviours effectively and received positive feedback',
      '[3] I partially demonstrated them and I know what to improve',
      '[2] I struggled to demonstrate the behaviours in the scenario',
      '[N/A] We did not do a scenario or role-play in this session'
    ] },
    { id: 'v', type: 'choice', text: 'B5. Which statement best describes the value of this course for your role?', options: [
      '[4] Highly valuable: I gained practical tools I will use immediately',
      '[3] Valuable: I learned useful concepts I expect to apply over time',
      '[2] Somewhat valuable: some content was relevant but much was not new',
      '[1] Limited value: the content did not connect to my real work challenges'
    ] },
    { id: '7', type: 'choice', text: 'Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '8', type: 'text', text: 'B6. What would have made this course even more useful for you?' },
    { id: '9', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] },
    { id: '11', type: 'scale', text: 'Overall, how would you rate the usefulness of the course? (1 being very poor and 5 being very good)', options: ['1','2','3','4','5'] }
  ]
};

export const refresherTemplate: SurveyTemplate = {
  title: 'Learning Transfer Report',
  questions: [
    { id: '1', type: 'choice', text: 'A1. Marcus, a senior analyst in the Risk team, calls you in frustration after a strategy meeting. He says his colleague Elena openly contradicted his analysis in front of the department head and made him look incompetent. He wants you to escalate the matter. What do you do?', options: [
      '[3] Sit down privately with Marcus, let him share his full perspective, recognise how the experience affected him, and explore together what a constructive resolution might look like before involving anyone else',
      '[2] Bring Marcus and Elena together for a structured conversation where each can share their view of what happened, and guide them toward an agreement on how to work together going forward',
      '[1] Speak to Elena separately and explain that publicly contradicting a colleague is unprofessional and ask her to be more diplomatic in future meetings',
      '[0] Reassure Marcus that disagreements over analysis are normal in a risk team and suggest he prepare more thoroughly for future meetings so his work speaks for itself'
    ] },
    { id: '2', type: 'choice', text: 'A2. Over the past few weeks, you have observed that Liam, a team member in Product Development, has stopped contributing ideas during sprint planning, has missed two internal deadlines, and appears withdrawn. What do you do?', options: [
      '[3] Arrange a private, unhurried conversation with Liam, begin by genuinely asking how he is, and create space for him to share what is going on before discussing the specific work concerns',
      '[2] Put together a summary of the missed deadlines and reduced participation, share it with Liam by email, and ask him to propose a plan to get back on track within the next five working days',
      '[1] Decide to wait and see if things improve naturally over the next sprint cycle, since raising it now might add pressure when he is already struggling',
      '[0] Mention it to the whole team during the next retrospective as a general point about the importance of meeting deadlines and contributing, without singling Liam out'
    ] },
    { id: '3', type: 'choice', text: 'B1. Which statement best describes how you now handle situations related to this course topic?', options: [
      '[4] I handle these situations effectively and get consistent positive results',
      '[3] I manage most aspects but still struggle with some',
      '[2] I often feel unsure or avoid these situations',
      '[1] I have little or no experience with these situations'
    ] },
    { id: '4', type: 'choice', text: 'B2. How often have you applied skills or methods from this training in your work?', options: [
      '[4] Regularly: I use what I learned at least weekly',
      '[3] Occasionally: I have applied it several times in the past few months',
      '[2] Rarely: I have applied it once or twice',
      '[1] Not yet: I have not had the opportunity or felt ready to apply it'
    ] },
    { id: '5', type: 'text', text: 'B3. Describe a real situation where you applied something from the training at work. (What was the situation? Which specific skill? What did you do step by step? What happened?)' },
    { id: '6', type: 'text', text: 'B4. Which parts of the training felt difficult to apply in real work? Why?' },
    { id: '7', type: 'text', text: 'B5. Since the training, what have you done differently at work?' },
    { id: '8', type: 'text', text: 'B6. Have you noticed any measurable changes in your team or work environment that may relate to what you learned?' },
    { id: '9', type: 'text', text: 'B7. What support, tools, or conditions helped (or would have helped) you apply what you learned?' },
    { id: '10', type: 'text', text: 'B8. What improvements would make this course even more useful?' },
    { id: '11', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] }
  ]
};

const robustEndSessionTemplate = JSON.parse(JSON.stringify(endSessionTemplate));
robustEndSessionTemplate.questions.unshift({
  id: 'dynamic-ai-2',
  type: 'text',
  text: `[AI Scenario 2]: ${mockAiScenariosLibrary[1].scenarioText}\n\nQuestion: ${mockAiScenariosLibrary[1].prompt}` 
});
robustEndSessionTemplate.questions.unshift({
  id: 'dynamic-ai-1',
  type: 'text',
  text: `[AI Scenario 1]: ${mockAiScenariosLibrary[0].scenarioText}\n\nQuestion: ${mockAiScenariosLibrary[0].prompt}` 
});

export const mockPopulatedResponses: SurveyResponse[] = [
  // Pre-session answers mapped to the NEW template
  {
    id: 'resp-pre-1',
    stage: 'pre',
    participantName: 'Alex Stanton',
    participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': '[2] Arrange a meeting with both Sarah and Tom together so they can talk it through, and mediate the conversation yourself', 
      '2': '[2] Send James an email outlining the specific instances of lateness and missed deadlines, and ask him to respond with an explanation and an improvement plan', 
      '3': 'Mandatory HR mandate', 
      '4': 'Had a blowout with ops over scheduling, just avoided them.', 
      '5': '[2] I often feel unsure or avoid these situations' 
    }
  },
  {
    id: 'resp-pre-2',
    stage: 'pre',
    participantName: 'Mia Rojas',
    participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': '[3] Listen to Sarah, acknowledge how she feels, and ask her what outcome she would ideally want from this situation before deciding on any action', 
      '2': '[1] Mention it casually at your next regular catch-up and hope the issue resolves itself once he knows you have noticed', 
      '3': 'Wanting to improve communication', 
      '4': 'Tried to mediate between two junior devs, went poorly.', 
      '5': '[3] I manage most aspects but still struggle with some' 
    }
  },
  // End session answers mapped to the NEW template
  {
    id: 'resp-end-1',
    stage: 'end',
    participantName: 'Alex Stanton',
    participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "I would calmly assert we are checking the systems immediately and taking the vendor seriously.",
      'dynamic-ai-2': "I'd approve their time off instantly, HR policies can be handled retrospectively.",
      '1': '[3] Meet with Priya privately, listen to her account, validate her frustration, and ask what resolution she would consider fair before taking any steps', 
      '2': '[3] Book a private conversation with Aisha, start by checking in on how she is feeling generally, and explore what might be behind the change before raising the specific performance concerns', 
      '3': '[4] I handle these situations effectively and get consistent positive results', 
      '4': 'The structured empathy mechanism.', 
      '5': 'I will hold weekly 1-on-1s without an agenda to just listen.', 
      'v': '[4] Highly valuable: I gained practical tools I will use immediately',
      '7': 'Yes',
      '11': '5' 
    }
  },
  {
    id: 'resp-end-2',
    stage: 'end',
    participantName: 'David Chen',
    participantEmail: 'dchen@acme.corp',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "Inform the vendor that threatening to halt services breaches our Master Service Agreement.",
      'dynamic-ai-2': "Ask them to finish the sprint tomorrow, then take off.",
      '1': '[2] Set up a three-way meeting with Priya and Daniel so they can air their perspectives, and facilitate the conversation yourself', 
      '2': '[2] Document the specific errors and instances of disengagement in an email to Aisha, and request a written improvement plan from her within one week', 
      '3': '[3] I manage most aspects but still struggle with some', 
      '4': 'Using active listening.', 
      '5': 'I will try to not interrupt in meetings.', 
      'v': '[3] Valuable: I learned useful concepts I expect to apply over time',
      '7': 'Maybe',
      '11': '4' 
    }
  },
  {
    id: 'resp-end-3',
    stage: 'end',
    participantName: 'Mia Rojas',
    participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': '[3] Meet with Priya privately, listen to her account, validate her frustration, and ask what resolution she would consider fair before taking any steps', 
      '2': '[3] Book a private conversation with Aisha, start by checking in on how she is feeling generally, and explore what might be behind the change before raising the specific performance concerns', 
      '3': '[4] I handle these situations effectively and get consistent positive results', 
      'v': '[4] Highly valuable: I gained practical tools I will use immediately',
      '7': 'Yes',
      '11': '5' 
    }
  },
  {
    id: 'resp-end-4',
    stage: 'end',
    participantName: 'Sam Wilson',
    participantEmail: 'samw@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': '[3] Meet with Priya privately, listen to her account, validate her frustration, and ask what resolution she would consider fair before taking any steps', 
      '2': '[2] Document the specific errors and instances of disengagement in an email to Aisha, and request a written improvement plan from her within one week', 
      '3': '[3] I manage most aspects but still struggle with some', 
      'v': '[4] Highly valuable: I gained practical tools I will use immediately',
      '7': 'Yes',
      '11': '4' 
    }
  },
  {
    id: 'resp-end-5',
    stage: 'end',
    participantName: 'Jordan Lee',
    participantEmail: 'jlee@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': '[1] Have a quiet word with Daniel and tell him to be more respectful of Priya\'s contributions in future meetings',
      '2': '[0] Ask one of her closer colleagues to have a friendly word with her about picking up the pace, to keep it informal and avoid putting her on the spot',
      '3': '[2] I often feel unsure or avoid these situations', 
      'v': '[3] Valuable: I learned useful concepts I expect to apply over time',
      '7': 'No',
      '11': '2' 
    }
  },
  // Refresher session answers mapped to the NEW template
  {
    id: 'resp-ref-1',
    stage: 'refresher',
    participantName: 'Alex Stanton',
    participantEmail: 'astanton@globex.com',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': '[3] Sit down privately with Marcus, let him share his full perspective, recognise how the experience affected him, and explore together what a constructive resolution might look like before involving anyone else', 
      '2': '[3] Arrange a private, unhurried conversation with Liam, begin by genuinely asking how he is, and create space for him to share what is going on before discussing the specific work concerns', 
      '3': '[4] I handle these situations effectively and get consistent positive results', 
      '4': '[3] Occasionally: I have applied it several times in the past few months', 
      '5': 'I used the resolution framework to handle a dispute between QA and dev teams without resorting to HR.', 
      '6': 'Hard to remember the exact framework steps when stressed.', 
      '7': 'I count to 3 before responding to aggressive emails.' 
    }
  }
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
      pre: preSessionTemplate,
      end: robustEndSessionTemplate,
      refresher: refresherTemplate
    },
    responses: mockPopulatedResponses,
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
      pre: preSessionTemplate,
      end: endSessionTemplate,
      refresher: refresherTemplate
    },
    responses: []
  }
];
