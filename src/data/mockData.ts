import type { Session, SurveyResponse, FeedbackScenario, SurveyTemplate } from '../types';

export const mockAiScenariosLibrary: FeedbackScenario[] = [
  // What You Know Scenarios
  {
    id: 'ai-pre-1',
    scenarioText: "You overhear two team members having a heated argument about workload distribution in the breakroom. One is threatening to quit.",
    prompt: "What is your immediate response to this situation?",
    rubric: [
      "Success: Separate the team members safely without taking sides.",
      "Success: Validate the emotions without validating the behavior.",
      "Fail: Attempt to mediate on the spot in front of others.",
      "Fail: Threaten disciplinary action immediately."
    ],
    managerChecklist: [
      "Prioritizes de-escalation over resolution",
      "Maintains neutral tone and body language"
    ]
  },
  {
    id: 'ai-pre-2',
    scenarioText: "A project has fallen behind schedule because two departments are refusing to share data, each blaming the other for the delay.",
    prompt: "How do you approach the department heads to resolve this deadlock?",
    rubric: [
      "Success: Initiate a joint meeting focusing strictly on process, not blame.",
      "Success: Reframe the conversation to highlight shared organizational goals.",
      "Fail: Escalates to executives before attempting peer-to-peer facilitation.",
      "Fail: Takes one department's side based on historical reliability."
    ],
    managerChecklist: [
      "Focuses on systemic issues rather than personalities",
      "Reinforces mutual dependencies"
    ]
  },
  // What You Learnt Scenarios
  {
    id: 'ai-end-1',
    scenarioText: "During a facilitated conversation between two conflicting employees, one suddenly walks out of the room in anger.",
    prompt: "Based on today's mediation training, what should be your next steps?",
    rubric: [
      "Success: Allow a cooling-off period before pursuing them.",
      "Success: Follow up privately to explore what triggered the walk-out.",
      "Fail: Force them back into the room immediately.",
      "Fail: Declare the mediation a failure and move to formal grievance."
    ],
    managerChecklist: [
      "Respects physiological boundaries in conflict",
      "Demonstrates the 'Structured Empathy' technique"
    ]
  },
  {
    id: 'ai-end-2',
    scenarioText: "You must address an employee who has been consistently interrupting and belittling a colleague during team meetings.",
    prompt: "Using the frameworks taught today, outline the structure of your conversation with them.",
    rubric: [
      "Success: Clearly states observable behaviors (e.g. 'You interrupted 3 times').",
      "Success: Asks open questions to understand their perspective.",
      "Fail: Uses labels like 'You have a bad attitude'.",
      "Fail: Tells them exactly how they must behave without securing buy-in."
    ],
    managerChecklist: [
      "Uses non-violent communication methodology",
      "Maintains the adult-to-adult dynamic"
    ]
  },
  // What You Did Scenarios
  {
    id: 'ai-ref-1',
    scenarioText: "Think of a time in the past month where you noticed a potential conflict brewing between colleagues.",
    prompt: "How did you use early intervention mediation techniques to prevent it from escalating?",
    rubric: [
      "Success: Describes specifically spotting an issue before formal complaints arose.",
      "Success: Outlines bringing them together or informally coaching.",
      "Fail: Mentions ignoring it until it became a bigger issue.",
      "Fail: Admits to bypassing mediation and going straight to HR."
    ],
    managerChecklist: [
      "Shows active application of Early Resolution",
      "Evidences sustained behavioral change"
    ]
  },
  {
    id: 'ai-ref-2',
    scenarioText: "Describe a situation since the training where you successfully mediated a dispute using the structured empathy approach.",
    prompt: "How did the participants react, and what was the outcome?",
    rubric: [
      "Success: Explicitly mentions a clear outcome or mutually agreed resolution.",
      "Success: Reflects on the participants' emotional shift.",
      "Fail: Could not provide a real example.",
      "Fail: The outcome resolved the operational issue but damaged the relationship."
    ],
    managerChecklist: [
      "Transforms toxic conflict into constructive dialogue",
      "Achieves 'Win-Win' alignments"
    ]
  }
];

export const preSessionTemplate: SurveyTemplate = {
  title: 'What You Know',
  questions: [
    { id: '1', type: 'text', text: 'You overhear two team members having a heated argument about workload distribution in the breakroom. One is threatening to quit. What is your immediate response to this situation?' },
    { id: '2', type: 'text', text: 'A project has fallen behind schedule because two departments are refusing to share data, each blaming the other for the delay. How do you approach the department heads to resolve this deadlock?' },
    { id: '2a', type: 'choice', text: 'What does the FAIR Model represent?', options: ['Facilitate, Appreciate, Innovate, Resolve', 'Focus, Analyze, Implement, Review', 'Facilitate, Assess, Integrate, Resolve', 'Find, Address, Innovate, Restore'] },
    { id: '2b', type: 'choice', text: 'What is a core principle of "Structured Empathy"?', options: ['Validating emotions without validating behavior', 'Agreeing with the person\'s actions', 'Pointing out the person\'s mistakes immediately', 'Ignoring emotions to focus on facts'] },
    { id: '2c', type: 'choice', text: 'In conflict resolution, what is the primary goal of a "Cooling-off period"?', options: ['To respect physiological boundaries and allow emotions to settle', 'To punish the parties involved', 'To avoid dealing with the conflict', 'To allow time to gather disciplinary evidence'] },
    { id: '2d', type: 'choice', text: 'What characterizes the "Non-violent communication" methodology?', options: ['Stating observable behaviors without labels or judgments', 'Telling people exactly what they must do', 'Using labels to categorize bad attitudes', 'Forcing immediate compromises'] },
    { id: '3', type: 'text', text: 'What motivated you to attend this course?' },
    { id: '4', type: 'text', text: 'Describe a recent situation related to this course topic that you had to deal with. What did you do?' },
    { id: '5', type: 'choice', text: 'Which statement best describes your current confidence in handling situations related to this course?', options: [
      'I handle these situations effectively',
      'I manage some aspects but struggle with others',
      'I often feel unsure or avoid these situations',
      'I have little or no experience with these situations'
    ] },
    { id: '6', type: 'text', text: 'What is one situation in your role at work, where you would most like to improve your approach related to this course?' },
    { id: '7', type: 'text', text: 'What skills, behavior or capabilities do you hope to achieve from this training course?' },
    { id: '8', type: 'text', text: 'Is there anything else you feel the trainer needs to know to help ensure your experience meets your needs?' },
    { id: '9', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please don\'t use'] },
    { id: '10', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] }
  ]
};

export const endSessionTemplate: SurveyTemplate = {
  title: 'What You Learnt',
  questions: [
    { id: '1', type: 'text', text: 'During a facilitated conversation between two conflicting employees, one suddenly walks out of the room in anger. Based on today\'s mediation training, what should be your next steps?' },
    { id: '2', type: 'text', text: 'You must address an employee who has been consistently interrupting and belittling a colleague during team meetings. Using the frameworks taught today, outline the structure of your conversation with them.' },
    { id: '2a', type: 'choice', text: 'What does the FAIR Model represent?', options: ['Facilitate, Appreciate, Innovate, Resolve', 'Focus, Analyze, Implement, Review', 'Facilitate, Assess, Integrate, Resolve', 'Find, Address, Innovate, Restore'] },
    { id: '2b', type: 'choice', text: 'What is a core principle of "Structured Empathy"?', options: ['Validating emotions without validating behavior', 'Agreeing with the person\'s actions', 'Pointing out the person\'s mistakes immediately', 'Ignoring emotions to focus on facts'] },
    { id: '2c', type: 'choice', text: 'In conflict resolution, what is the primary goal of a "Cooling-off period"?', options: ['To respect physiological boundaries and allow emotions to settle', 'To punish the parties involved', 'To avoid dealing with the conflict', 'To allow time to gather disciplinary evidence'] },
    { id: '2d', type: 'choice', text: 'What characterizes the "Non-violent communication" methodology?', options: ['Stating observable behaviors without labels or judgments', 'Telling people exactly what they must do', 'Using labels to categorize bad attitudes', 'Forcing immediate compromises'] },
    { id: '3', type: 'text', text: 'What is one concept, tool, or idea from today that you understand clearly and could explain to a colleague?' },
    { id: '4', type: 'text', text: 'Imagine you’re back at work tomorrow. Which situation would you apply this training to first, and what would you do differently?' },
    { id: '5', type: 'choice', text: 'Choose the statement that best describes your readiness to apply what you learned:', options: [
      'I can confidently apply the tools in real situations',
      'I can apply some tools but would like more practice',
      'I understand the concepts but don’t yet feel ready to use them',
      'I’m unclear on how to apply the tools'
    ] },
    { id: '6', type: 'choice', text: 'During the session, you practised scenarios or role-plays. Which statement best reflects your performance?', options: [
      'I demonstrated the behaviors effectively',
      'I partially demonstrated them and know what to improve',
      'I struggled to demonstrate the behaviors',
      'We didn’t do a scenario/role-play'
    ] },
    { id: '7', type: 'text', text: 'What positive outcome do you expect this training to help you achieve in your role?' },
    { id: '8', type: 'text', text: 'What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '9', type: 'choice', text: 'Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '10', type: 'text', text: 'TCM loves celebrating our customers’ successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '11', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes, happy to use', 'No, please don\'t use'] },
    { id: '12', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] },
    { id: '13', type: 'scale', text: 'Overall, how would you rate the course? (Please shade in the stars with 1 being very poor and 5 being very good.) NOTE: Please also visit TrustPilot after submitting to leave your review via the external link provided by your trainer!', options: ['1','2','3','4','5'] }
  ]
};

export const refresherTemplate: SurveyTemplate = {
  title: 'What You Did',
  questions: [
    { id: '1', type: 'text', text: 'Think of a time in the past month where you noticed a potential conflict brewing between colleagues. How did you use early intervention mediation techniques to prevent it from escalating?' },
    { id: '2', type: 'text', text: 'Describe a situation since the training where you successfully mediated a dispute using the structured empathy approach. How did the participants react, and what was the outcome?' },
    { id: '2a', type: 'choice', text: 'What does the FAIR Model represent?', options: ['Facilitate, Appreciate, Innovate, Resolve', 'Focus, Analyze, Implement, Review', 'Facilitate, Assess, Integrate, Resolve', 'Find, Address, Innovate, Restore'] },
    { id: '2b', type: 'choice', text: 'What is a core principle of "Structured Empathy"?', options: ['Validating emotions without validating behavior', 'Agreeing with the person\'s actions', 'Pointing out the person\'s mistakes immediately', 'Ignoring emotions to focus on facts'] },
    { id: '2c', type: 'choice', text: 'In conflict resolution, what is the primary goal of a "Cooling-off period"?', options: ['To respect physiological boundaries and allow emotions to settle', 'To punish the parties involved', 'To avoid dealing with the conflict', 'To allow time to gather disciplinary evidence'] },
    { id: '2d', type: 'choice', text: 'What characterizes the "Non-violent communication" methodology?', options: ['Stating observable behaviors without labels or judgments', 'Telling people exactly what they must do', 'Using labels to categorize bad attitudes', 'Forcing immediate compromises'] },
    { id: '3', type: 'text', text: 'List the situations where you felt like you had an opportunity to apply the training at work, in the past month.' },
    { id: '4', type: 'text', text: 'Describe a real situation where you applied something from the training at work. What was the situation? Which specific skill or method did you use? What did you do step-by-step? What happened as a result?' },
    { id: '5', type: 'text', text: 'Which parts of the training felt difficult to apply in real work? Why?' },
    { id: '6', type: 'text', text: 'Since the training, what have you done differently at work?' },
    { id: '7', type: 'text', text: 'What support, tools, or conditions helped you apply what you learnt?' },
    { id: '8', type: 'text', text: 'What improvements would make this course even better or more useful for you? (E.g. Training Style, course structure, content relevance, pace, etc.)' },
    { id: '9', type: 'choice', text: 'Would you recommend this course to a colleague?', options: ['Yes', 'Maybe', 'No'] },
    { id: '10', type: 'text', text: 'TCM loves celebrating our customers’ successes and sharing their stories. If you would like to share a testimonial about your experience, please add it here:' },
    { id: '11', type: 'choice', text: 'May TCM use your response in marketing materials?', options: ['Yes', 'happy to use', 'No, please don\'t use'] },
    { id: '12', type: 'checkbox', text: 'Please tick in the other TCM services you would be interested in:', options: [
      'The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other'
    ] }
  ]
};

export const mockPopulatedResponses: SurveyResponse[] = [
  // ---------------- ALEX STANTON ----------------
  {
    id: 'resp-pre-1', stage: 'pre',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would intervene quickly to stop the argument and ask them to separate to cool off before we talk privately. [AI_SCORE: 7]', 
      '2': 'I would schedule a joint meeting with both department heads and force them to map out the delays. [AI_SCORE: 6]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Telling people exactly what they must do',
      '3': 'Mandatory HR mandate', '4': 'Had a blowout with ops over scheduling.', '5': 'I often feel unsure or avoid these situations', '6': 'Handling aggressive emails', '7': 'Patience', '8': '', '9': 'No, please don\'t use', '10': ['Engage Leadership']
    }
  },
  {
    id: 'resp-end-1', stage: 'end',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would allow them to leave, wait an hour, and then follow up with them privately to discuss what triggered them. [AI_SCORE: 9]', 
      '2': 'I would use the structured empathy framework, first acknowledging their drive, then stating the impact of their interruptions. [AI_SCORE: 7]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Stating observable behaviors without labels or judgments',
      '3': 'The structured empathy mechanism.', '4': 'I will hold weekly 1-on-1s without an agenda.', '5': 'I can confidently apply the tools in real situations', '6': 'I demonstrated the behaviors effectively', '7': 'Better team cohesion.', '8': 'More breaks.', '9': 'Yes', '10': 'I feel transformed.', '11': 'Yes, happy to use', '12': ['The Investigation Company'], '13': '5'
    }
  },
  {
    id: 'resp-ref-1', stage: 'refresher',
    participantName: 'Alex Stanton', participantEmail: 'astanton@globex.com',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'I noticed two designers getting short with each other on Slack, so I jumped in a quick huddle with them both to realign. [AI_SCORE: 8]', 
      '2': 'I helped resolve a dispute between QA and dev by establishing ground rules. They eventually compromised. [AI_SCORE: 6]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Stating observable behaviors without labels or judgments',
      '3': 'Used framework to handle QA disputes.', '4': 'A dev threatened to quit, I used open questions instead of getting defensive.', '5': 'Hard to remember the framework steps when stressed.', '6': 'I count to 3 before responding.', '7': 'Manager support.', '8': '', '9': 'Yes', '10': '', '11': 'Yes, happy to use', '12': []
    }
  },

  // ---------------- MIA ROJAS ----------------
  {
    id: 'resp-pre-2', stage: 'pre',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would try to mediate right there in the breakroom so they could hug it out. [AI_SCORE: 3]', 
      '2': 'I would tell my manager to handle it since it is cross-departmental. [AI_SCORE: 3]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Using labels to categorize bad attitudes',
      '3': 'Wanting to improve communication', '4': 'Tried to mediate between two junior devs, went poorly.', '5': 'I manage some aspects but struggle with others', '6': 'Team meetings', '7': 'Active listening', '8': '', '9': 'Yes, happy to use', '10': ['Resolution Framework']
    }
  },
  {
    id: 'resp-end-2', stage: 'end',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would follow them immediately to ensure they were okay and demand they return to the mediation. [AI_SCORE: 3]', 
      '2': 'I would document their behavior, invite them to my office, and issue a formal warning right away. [AI_SCORE: 3]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Telling people exactly what they must do',
      '3': 'Active listening.', '4': 'Waiting before speaking up in meetings.', '5': 'I can confidently apply the tools in real situations', '6': 'I demonstrated the behaviors effectively', '7': 'Improved output efficiency.', '8': '', '9': 'Yes', '10': '', '11': 'No, please don\'t use', '12': [], '13': '4'
    }
  },
  {
    id: 'resp-ref-2', stage: 'refresher',
    participantName: 'Mia Rojas', participantEmail: 'mia.rojas@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'I caught an email chain getting hostile and transitioned it to a phone call before it blew up. [AI_SCORE: 7]', 
      '2': 'Booked an unhurried conversation with Liam to genuinely ask how he is. Everything went smooth. [AI_SCORE: 5]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Telling people exactly what they must do',
      '3': 'Two colleagues had a communication breakdown over a delayed project.', '4': 'I set up a facilitated conversation using the structured empathy approach.', '5': 'Nothing felt difficult once I practised it.', '6': 'I proactively check in with team members individually.', '7': 'Roleplaying with peers.', '8': '', '9': 'Yes', '10': '', '11': 'No, please don\'t use', '12': []
    }
  },

  // ---------------- DAVID CHEN ----------------
  {
    id: 'resp-pre-3', stage: 'pre',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would shout at them to be professional. [AI_SCORE: 2]', 
      '2': 'I would just do the work myself so we hit the deadline. [AI_SCORE: 2]', 
      '2a': 'Find, Address, Innovate, Restore',
      '2b': 'Pointing out the person\'s mistakes immediately',
      '2c': 'To punish the parties involved',
      '2d': 'Forcing immediate compromises',
      '3': 'My manager said I need to improve how I handle team conflict.', '4': 'A team member complained about another in front of the whole office.', '5': 'I often feel unsure or avoid these situations', '6': 'All areas', '7': 'Confidence', '8': '', '9': 'No, please don\'t use', '10': []
    }
  },
  {
    id: 'resp-end-3', stage: 'end',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would inform HR that the mediation failed and give up on the process. [AI_SCORE: 2]', 
      '2': 'I would call them out in the next team meeting to set an example. [AI_SCORE: 2]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To punish the parties involved',
      '2d': 'Telling people exactly what they must do',
      '3': 'Conflict triangles.', '4': 'I will be more direct.', '5': 'I can apply some tools but would like more practice', '6': 'I partially demonstrated them and know what to improve', '7': 'Less drama.', '8': 'Shorter days.', '9': 'Maybe', '10': '', '11': 'Yes, happy to use', '12': [], '13': '3'
    }
  },
  {
    id: 'resp-ref-3', stage: 'refresher',
    participantName: 'David Chen', participantEmail: 'dchen@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'I saw tension and just assigned them to different projects. [AI_SCORE: 4]', 
      '2': 'I tried using structured empathy but ended up just telling them the solution. [AI_SCORE: 4]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Ignoring emotions to focus on facts',
      '2c': 'To avoid dealing with the conflict',
      '2d': 'Using labels to categorize bad attitudes',
      '3': 'Issues over remote chat.', '4': 'Tried to use the email templates for conflict.', '5': 'Takes too long to do proper mediation.', '6': 'Delegating the HR matters quicker.', '7': 'None really.', '8': '', '9': 'Maybe', '10': '', '11': 'No, please don\'t use', '12': []
    }
  },

  // ---------------- SAM WILSON ----------------
  {
    id: 'resp-pre-4', stage: 'pre',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'Pull them into a private room to understand the cause of the outburst. [AI_SCORE: 7]', 
      '2': 'Call a meeting with both sides to review the project blockers logically. [AI_SCORE: 6]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Telling people exactly what they must do',
      '3': 'Build confidence in difficult conversions.', '4': 'Told team member their quality was slipping.', '5': 'I often feel unsure or avoid these situations', '6': 'Giving feedback', '7': 'Frameworks', '8': '', '9': 'Yes, happy to use', '10': ['The TCM Academy']
    }
  },
  {
    id: 'resp-end-4', stage: 'end',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'Respect their boundary, then reach out later expressing empathy and offering to reschedule. [AI_SCORE: 8]', 
      '2': 'Share specific observations of the interruptions, ask for their perspective, and co-create ground rules. [AI_SCORE: 9]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Stating observable behaviors without labels or judgments',
      '3': 'Using non-violent communication.', '4': 'Scheduling longer 1-on-1s.', '5': 'I can confidently apply the tools in real situations', '6': 'I demonstrated the behaviors effectively', '7': 'Better listening skills.', '8': '', '9': 'Yes', '10': 'Highly recommended.', '11': 'Yes, happy to use', '12': [], '13': '4'
    }
  },
  {
    id: 'resp-ref-4', stage: 'refresher',
    participantName: 'Sam Wilson', participantEmail: 'samw@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'Saw passive-aggressive behavior and intervened with a neutral check-in question. [AI_SCORE: 7]', 
      '2': 'Used the framework step by step on a junior staff dispute, leading to mutual understanding. [AI_SCORE: 7]', 
      '2a': 'Facilitate, Appreciate, Innovate, Resolve',
      '2b': 'Validating emotions without validating behavior',
      '2c': 'To respect physiological boundaries and allow emotions to settle',
      '2d': 'Stating observable behaviors without labels or judgments',
      '3': 'A new team member was struggling to integrate and clashing with a senior colleague.', '4': 'Had separate conversations first, then joint.', '5': 'Staying neutral during high-emotions is hard.', '6': 'Scheduling regular check-ins early.', '7': 'Reference cards.', '8': '', '9': 'Yes', '10': '', '11': 'Yes, happy to use', '12': []
    }
  },

  // ---------------- JORDAN LEE ----------------
  {
    id: 'resp-pre-5', stage: 'pre',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would ignore it and hope it stops. [AI_SCORE: 2]', 
      '2': 'I would escalate to my director immediately. [AI_SCORE: 2]', 
      '2a': 'Facilitate, Assess, Integrate, Resolve',
      '2b': 'Ignoring emotions to focus on facts',
      '2c': 'To avoid dealing with the conflict',
      '2d': 'Using labels to categorize bad attitudes',
      '3': 'Mandatory.', '4': 'Avoided a colleague after an argument.', '5': 'I have little or no experience with these situations', '6': 'Everything', '7': 'Survival', '8': '', '9': 'No, please don\'t use', '10': []
    }
  },
  {
    id: 'resp-end-5', stage: 'end',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: { 
      '1': 'I would be confused and wait for them to contact me. [AI_SCORE: 3]', 
      '2': 'Ask one of her closer colleagues to talk to her to avoid putting her on the spot. [AI_SCORE: 3]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To punish the parties involved',
      '2d': 'Using labels to categorize bad attitudes',
      '3': 'A bit on active listening.', '4': 'Nothing much yet.', '5': 'I understand the concepts but don\'t yet feel ready to use them', '6': 'I struggled to demonstrate the behaviors', '7': 'Basic awareness.', '8': 'More real-life examples.', '9': 'No', '10': '', '11': 'Yes, happy to use', '12': [], '13': '2'
    }
  },
  {
    id: 'resp-ref-5', stage: 'refresher',
    participantName: 'Jordan Lee', participantEmail: 'jlee@acme.corp',
    submittedAt: new Date().toISOString(),
    answers: { 
      '1': 'I thought about intervening but decided it was not my place. [AI_SCORE: 2]', 
      '2': 'I haven\'t mediated anything successfully yet. [AI_SCORE: 2]', 
      '2a': 'Focus, Analyze, Implement, Review',
      '2b': 'Agreeing with the person\'s actions',
      '2c': 'To punish the parties involved',
      '2d': 'Using labels to categorize bad attitudes',
      '3': 'Handled a minor dispute.', '4': 'Suggested they speak to HR.', '5': 'I still feel uncomfortable initiating difficult conversations.', '6': 'More aware when conflicts brew.', '7': 'None.', '8': '', '9': 'No', '10': '', '11': 'No, please don\'t use', '12': []
    }
  }
];

export const initialSessions: Session[] = [
  {
    id: 'b6e83',
    courseName: 'Practical Mediation Skills (Q3)',
    trainerName: 'Sarah Jenkins',
    date: '2026-04-10',
    companyTaught: 'ACME Corp',
    trainerNotes: 'Needs focus on remote communication.',
    surveysCompleted: { pre: true, end: true, refresher: true },
    surveys: {
      pre: preSessionTemplate,
      end: endSessionTemplate,
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
