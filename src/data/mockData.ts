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
  title: 'What You Know',
  questions: [
    { id: '1', type: 'text', text: 'A1. Sarah, a team leader in Finance, comes to you after a meeting. She is visibly upset because her colleague Tom publicly dismissed her proposal in front of the whole team. She wants you, as her manager, to speak to Tom and \'sort him out.\' What do you do?' },
    { id: '2', type: 'text', text: 'A2. You have noticed that James, one of your direct reports in Operations, has been arriving late and missing deadlines over the past three weeks. His work quality has also dropped. Other team members have started commenting on it. You need to address this. What do you do?' },
    { id: '3', type: 'text', text: '1. What motivated you to attend this course?' },
    { id: '4', type: 'text', text: '2. Describe a recent situation related to this course topic that you had to deal with. What did you do?' },
    { id: '5', type: 'choice', text: '3. Which statement best describes your current confidence in handling situations related to this course?', options: [
      '[4] I handle these situations effectively',
      '[3] I manage some aspects but struggle with others',
      '[2] I often feel unsure or avoid these situations',
      '[1] I have little or no experience with these situations'
    ] },
    { id: '6', type: 'text', text: '4. What is one situation in your role at work, where you would most like to improve your approach related to this course?' },
    { id: '7', type: 'text', text: '5. What skills, behavior or capabilities do you hope to achieve from this training course?' },
    { id: '8', type: 'text', text: '6. Is there anything else you feel the trainer needs to know to help ensure your experience meets your needs?' },
    { id: '10', type: 'checkbox', text: '7. Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] }
  ]
};

export const endSessionTemplate: SurveyTemplate = {
  title: 'What You Learnt',
  questions: [
    { id: '1', type: 'text', text: 'A1. Priya, a project coordinator in Marketing, sends you an urgent message after a client call. She is angry because her colleague Daniel interrupted her repeatedly during the presentation and took credit for her ideas in front of the client. She wants you to formally reprimand Daniel. What do you do?' },
    { id: '2', type: 'text', text: 'A2. Over the past month, you have noticed that Aisha, a team member in Customer Service, has been making more errors in her case notes and has seemed disengaged during team meetings. Two colleagues have separately mentioned to you that they are picking up extra work because of it. You need to address this. What do you do?' },
    { id: '3', type: 'text', text: '1. What is one concept, tool, or idea from today that you understand clearly and could explain to a colleague?' },
    { id: '4', type: 'text', text: '2. Imagine you\'re back at work tomorrow. Which situation would you apply this training to first, and what would you do differently?' },
    { id: '5', type: 'choice', text: '3. Choose the statement that best describes your readiness to apply what you learned:', options: [
      '[4] I can confidently apply the tools in real situations',
      '[3] I can apply some tools but would like more practice',
      '[2] I understand the concepts but don\'t yet feel ready to use them',
      '[1] I\'m unclear on how to apply the tools'
    ] },
    { id: '6', type: 'choice', text: '4. During the session, you practised scenarios or role-plays. Which statement best reflects your performance?', options: [
      '[4] I demonstrated the behaviors effectively',
      '[3] I partially demonstrated them and know what to improve',
      '[2] I struggled to demonstrate the behaviors',
      '[N/A] We didn\'t do a scenario/role-play'
    ] },
    { id: 'val', type: 'text', text: '5. What positive outcome do you expect this training to help you achieve in your role?' },
    { id: '8', type: 'text', text: '6. What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '7', type: 'choice', text: '7. Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '10', type: 'text', text: '8. TCM loves celebrating our customers\' successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '12', type: 'checkbox', text: '9. Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] },
    { id: '11', type: 'scale', text: '11. Overall, how would you rate the course? (Please shade in the stars with 1 being very poor and 5 being very good)', options: ['1','2','3','4','5'] }
  ]
};

export const refresherTemplate: SurveyTemplate = {
  title: 'What You Did',
  questions: [
    { id: '1', type: 'text', text: 'A1. Marcus, a senior analyst in the Risk team, calls you in frustration after a strategy meeting. He says his colleague Elena openly contradicted his analysis in front of the department head and made him look incompetent. He wants you to escalate the matter. What do you do?' },
    { id: '2', type: 'text', text: 'A2. Over the past few weeks, you have observed that Liam, a team member in Product Development, has stopped contributing ideas during sprint planning, has missed two internal deadlines, and appears withdrawn. What do you do?' },
    { id: '3', type: 'text', text: '1. List the situations where you felt like you had an opportunity to apply the training at work, in the past month.' },
    { id: '4', type: 'text', text: '2. Describe a real situation where you applied something from the training at work. (What was the situation? Which specific skill or method did you use? What did you do step-by-step? What happened as a result?)' },
    { id: '5', type: 'text', text: '3. Which parts of the training felt difficult to apply in real work? Why?' },
    { id: '6', type: 'text', text: '4. Since the training, what have you done differently at work?' },
    { id: 'sup', type: 'text', text: '5. What support, tools, or conditions helped you apply what you learnt?' },
    { id: '8', type: 'text', text: '6. What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '7', type: 'choice', text: '7. Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '10', type: 'text', text: '8. TCM loves celebrating our customers\' successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '12', type: 'checkbox', text: '9. Please tick in the other TCM services you would be interested in:', options: [
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
  // ---------------- ALEX STANTON ----------------
  {
    id: 'resp-pre-1', stage: 'pre',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would arrange a meeting with both Sarah and Tom together so we could talk it out. [AI_SCORE: 5]', 
      '2': 'I would send James an email to document his lateness and ask for an explanation. [AI_SCORE: 5]', 
      '3': 'Mandatory HR mandate', '4': 'Had a blowout with ops over scheduling, just avoided them.', '5': '[2] I often feel unsure or avoid these situations' 
    }
  },
  {
    id: 'resp-end-1', stage: 'end',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "I would politely affirm we are checking the systems immediately and value their business deeply. [AI_SCORE: 10]", 
      'dynamic-ai-2': "I'd approve their time off instantly, HR policies can be handled subsequently. Empathy is vital. [AI_SCORE: 10]", 
      '1': 'I would meet with Priya privately, validate her frustration, and ask what resolution she needs before taking any steps. [AI_SCORE: 10]', 
      '2': 'I would book a private conversation with Aisha, check in on how she is feeling generally, and explore what might be behind the change. [AI_SCORE: 10]', 
      '3': 'The structured empathy mechanism.', '4': 'I will hold weekly 1-on-1s without an agenda to just listen.', '5': '[4] I can confidently apply the tools in real situations', '6': '[4] I demonstrated the behaviors effectively', 'val': 'Better team cohesion.', '7': 'Yes', '11': '5' 
    }
  },
  {
    id: 'resp-ref-1', stage: 'refresher',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'I sat down privately with Marcus, let him share his full perspective, and explored what a constructive resolution might look like. [AI_SCORE: 10]', 
      '2': 'Arranged an unhurried conversation with Liam, began by genuinely asking how he was, and created space for him to share. [AI_SCORE: 10]', 
      '3': 'Used framework to handle a dispute between QA and dev teams without resorting to HR.', '4': 'When a dev threatened to quit, I used open questions instead of getting defensive.', '5': 'Hard to remember the exact framework steps when stressed.', '6': 'I count to 3 before responding to aggressive emails.', 'sup': 'My manager checked in with me weekly.', '7': 'Yes' 
    }
  },

  // ---------------- MIA ROJAS ----------------
  {
    id: 'resp-pre-2', stage: 'pre',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'Listen to Sarah, acknowledge how she feels, and ask her what outcome she perfectly wants. [AI_SCORE: 8]', 
      '2': 'I might mention it casually at our next regular catch-up and hope it gets resolved. [AI_SCORE: 3]', 
      '3': 'Wanting to improve communication', '4': 'Tried to mediate between two junior devs, went poorly.', '5': '[3] I manage some aspects but struggle with others' 
    }
  },
  {
    id: 'resp-end-2', stage: 'end',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "Inform the vendor we are looking into the issue, but remind them of our 90-day MSA. [AI_SCORE: 4]", 
      'dynamic-ai-2': "Ask them to finish the sprint tomorrow, then take off for 2 weeks. [AI_SCORE: 3]", 
      '1': 'Meet with Priya privately to validate her frustration before taking any steps. [AI_SCORE: 10]', 
      '2': 'I would document the specific errors in an email to Aisha, and request an improvement plan. [AI_SCORE: 6]', 
      '3': 'Active listening.', '4': 'Waiting before speaking up in meetings.', '5': '[4] I can confidently apply the tools in real situations', '6': '[4] I demonstrated the behaviors effectively', 'val': 'Improved output efficiency.', '7': 'Yes', '11': '4' 
    }
  },
  {
    id: 'resp-ref-2', stage: 'refresher',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'Private sit-down with Marcus to hear his full perspective before doing anything else. [AI_SCORE: 10]', 
      '2': 'Booked an unhurried conversation with Liam to genuinely ask how he is. [AI_SCORE: 10]', 
      '3': 'Two colleagues had a communication breakdown over a delayed project.', '4': 'I set up a facilitated conversation using the structured empathy approach.', '5': 'Nothing felt difficult once I practised it.', '6': 'I proactively check in with team members individually.', 'sup': 'Roleplaying with peers.', '7': 'Yes' 
    }
  },

  // ---------------- DAVID CHEN ----------------
  {
    id: 'resp-pre-3', stage: 'pre',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would speak to Tom privately and ask him to apologise to Sarah so it doesnt escalate. [AI_SCORE: 3]', 
      '2': 'I would raise punctuality issues at the next team meeting without naming James to prevent awkwardness. [AI_SCORE: 0]', 
      '3': 'My manager said I need to improve how I handle team conflict.', '4': 'A team member complained about another in front of the whole office. I told them both to focus on their work.', '5': '[2] I often feel unsure or avoid these situations' 
    }
  },
  {
    id: 'resp-end-3', stage: 'end',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "I would try putting the blame on accounting to buy us some time. [AI_SCORE: 0]", 
      'dynamic-ai-2': "Tell them to prioritize their mental health, take the leave now. [AI_SCORE: 10]", 
      '1': 'Setup a three-way meeting with Priya and Daniel immediately to air their perspectives. [AI_SCORE: 6]', 
      '2': 'Wait until her next performance review and raise it then. [AI_SCORE: 3]', 
      '3': 'Conflict triangles.', '4': 'I will be more direct.', '5': '[3] I can apply some tools but would like more practice', '6': '[3] I partially demonstrated them and know what to improve', 'val': 'Less drama.', '7': 'Maybe', '11': '3' 
    }
  },
  {
    id: 'resp-ref-3', stage: 'refresher',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'Bring Marcus and Elena together for a structured conversation to resolve their dispute. [AI_SCORE: 6]', 
      '2': 'I would email Liam a summary of his missed deadlines and ask for a plan. [AI_SCORE: 6]', 
      '3': 'Issues over remote chat.', '4': 'Tried to use the email templates for conflict.', '5': 'Takes too long to do proper mediation.', '6': 'Delegating the HR matters quicker.', 'sup': 'None really.', '7': 'Maybe' 
    }
  },

  // ---------------- SAM WILSON ----------------
  {
    id: 'resp-pre-4', stage: 'pre',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'Arrange a joint meeting with Sarah and Tom to talk it out. [AI_SCORE: 5]', 
      '2': 'I would mention it casually to James at our catch-up. [AI_SCORE: 3]', 
      '3': 'Build confidence in difficult conversions.', '4': 'Told team member their quality was slipping briefly.', '5': '[2] I often feel unsure or avoid these situations' 
    }
  },
  {
    id: 'resp-end-4', stage: 'end',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "Listen to the vendor's frustration and promise to check the payment log right after the call. [AI_SCORE: 10]", 
      'dynamic-ai-2': "Grant the 2 weeks leave immediately. [AI_SCORE: 10]", 
      '1': 'Meet with Priya privately, listen to her fully, valid her feelings, ask for her desired outcome. [AI_SCORE: 10]', 
      '2': 'Book a private conversation to check in on Aisha personally before talking about the work. [AI_SCORE: 10]', 
      '3': 'Using non-violent communication.', '4': 'Scheduling longer 1-on-1s.', '5': '[4] I can confidently apply the tools in real situations', '6': '[4] I demonstrated the behaviors effectively', 'val': 'Better listening skills.', '7': 'Yes', '11': '4' 
    }
  },
  {
    id: 'resp-ref-4', stage: 'refresher',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'Sit down privately with Marcus, explore constructive resolutions without jumping to HR. [AI_SCORE: 10]', 
      '2': 'Arrange a private unhurried conversation with Liam to find out what is actually wrong. [AI_SCORE: 10]', 
      '3': 'A new team member was struggling to integrate and clashing with a senior colleague.', '4': 'Had separate conversations first, then joint.', '5': 'Staying neutral during high-emotions is hard.', '6': 'Scheduling regular check-ins early.', 'sup': 'Reference cards.', '7': 'Yes' 
    }
  },

  // ---------------- JORDAN LEE ----------------
  {
    id: 'resp-pre-5', stage: 'pre',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'Tell Sarah that disagreements happen and not to take things personally. [AI_SCORE: 0]', 
      '2': 'Mention it casually at our catch up to see if it fixes itself. [AI_SCORE: 3]', 
      '3': 'Mandatory.', '4': 'Avoided a colleague after an argument.', '5': '[1] I have little or no experience with these situations' 
    }
  },
  {
    id: 'resp-end-5', stage: 'end',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      'dynamic-ai-1': "Tell them honestly that I have no idea why it hasn't been paid. [AI_SCORE: 3]", 
      'dynamic-ai-2': "Tell them taking leave tomorrow is unacceptable without notice. [AI_SCORE: 0]", 
      '1': 'Have a quiet word with Daniel to be more respectful. [AI_SCORE: 3]', 
      '2': 'Ask one of her closer colleagues to talk to Aisha to avoid putting her on the spot. [AI_SCORE: 0]', 
      '3': 'A bit on active listening.', '4': 'Nothing much yet.', '5': '[2] I understand the concepts but don\'t yet feel ready to use them', '6': '[2] I struggled to demonstrate the behaviors', 'val': 'Basic awareness.', '7': 'No', '11': '2' 
    }
  },
  {
    id: 'resp-ref-5', stage: 'refresher',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'Speak to Elena separately and tell her contradicting is unprofessional. [AI_SCORE: 3]', 
      '2': 'Decide to wait and see if things improve naturally with Liam. [AI_SCORE: 3]', 
      '3': 'Handled a minor dispute.', '4': 'Suggested they speak to HR.', '5': 'I still feel uncomfortable initiating difficult conversations.', '6': 'More aware when conflicts brew.', 'sup': 'None.', '7': 'No' 
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
