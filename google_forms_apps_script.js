function createAllForms() {
  // Copy and paste this script into Google Apps Script (script.google.com)
  // Click "Run" -> "createAllForms"

  function createLeadershipExecutiveCoachingQ3PreSession() {
    var form = FormApp.create('Leadership Executive Coaching (Q3) - Pre-Session');
    form.setTitle('Learning Preparation Form - Leadership Executive Coaching (Q3)');
    form.setDescription('Please complete this survey.');
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);

    form.addMultipleChoiceItem().setTitle('1. Sarah, a team leader in Finance, comes to you after a meeting. She is visibly upset because her colleague Tom publicly dismissed her proposal in front of the whole team. She wants you, as her manager, to speak to Tom and \'sort him out.\' What do you do?').setChoiceValues(['Listen to Sarah, acknowledge how she feels, and ask her what outcome she would ideally want from this situation before deciding on any action', 'Arrange a meeting with both Sarah and Tom together so they can talk it through, and mediate the conversation yourself', 'Speak to Tom privately and ask him to apologise to Sarah to prevent the situation from escalating', 'Tell Sarah that disagreements happen in meetings and she should try not to take professional feedback personally']);
    form.addMultipleChoiceItem().setTitle('2. You have noticed that James, one of your direct reports in Operations, has been arriving late and missing deadlines over the past three weeks. His work quality has also dropped. Other team members have started commenting on it. You need to address this. What do you do?').setChoiceValues(['Schedule a private one-to-one with James, open with curiosity by asking how he is doing, and explore whether there are underlying issues before discussing the performance concerns', 'Send James an email outlining the specific instances of lateness and missed deadlines, and ask him to respond with an explanation and an improvement plan', 'Mention it casually at your next regular catch-up and hope the issue resolves itself once he knows you have noticed', 'Raise it at the next team meeting as a general reminder about punctuality and deadlines, without naming James, to avoid an awkward conversation']);
    form.addParagraphTextItem().setTitle('3. What motivated you to attend this course?');
    form.addParagraphTextItem().setTitle('4. Describe a recent situation related to this course topic that you had to deal with. What did you do, and what was the result?');
    form.addMultipleChoiceItem().setTitle('5. Which statement best describes how you currently handle situations related to this course topic?').setChoiceValues(['I handle these situations effectively and get consistent positive results', 'I manage most aspects but still struggle with some', 'I often feel unsure or avoid these situations', 'I have little or no experience with these situations']);
    form.addParagraphTextItem().setTitle('6. What is one situation at work where you would most like to improve your approach related to this course?');
    form.addParagraphTextItem().setTitle('7. What skills, behaviours, or capabilities do you hope to develop from this training?');
    form.addParagraphTextItem().setTitle('8. Is there anything else the trainer needs to know to ensure this course meets your needs?');
    form.addParagraphTextItem().setTitle('9. Would you like to share a testimonial about your TCM experience?');
    form.addMultipleChoiceItem().setTitle('10. May TCM use your response in marketing materials?').setChoiceValues(['Yes, happy to use', 'No, please do not use']);
    form.addMultipleChoiceItem().setTitle('11. Would you like information about other TCM services?').setChoiceValues(['Yes, please get in touch', 'No, thank you']);
    form.addCheckboxItem().setTitle('12. Please tick in the other TCM services you would be interested in:').setChoiceValues(['The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other']);
    Logger.log('Published URL: ' + form.getPublishedUrl());
    Logger.log('Editor URL: ' + form.getEditUrl());
  }

  function createLeadershipExecutiveCoachingQ3LearnerReflection() {
    var form = FormApp.create('Leadership Executive Coaching (Q3) - Learner Reflection');
    form.setTitle('Learner Reflection Form - Leadership Executive Coaching (Q3)');
    form.setDescription('Please complete this survey.');
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);

    form.addParagraphTextItem().setTitle('1. [AI Scenario 1]: A vendor calls you furious that their invoice hasn\'t been paid for 60 days. They are threatening to halt all services tomorrow, which would stop production.

Question: Write exactly what you would say on the phone right now to de-escalate this vendor.');
    form.addParagraphTextItem().setTitle('2. [AI Scenario 2]: Your top-performing employee sends an email at 10pm saying they are \'burned out\' and need to take 2 weeks of leave immediately starting tomorrow.

Question: Draft an email response to this employee.');
    form.addMultipleChoiceItem().setTitle('3. Priya, a project coordinator in Marketing, sends you an urgent message after a client call. She is angry because her colleague Daniel interrupted her repeatedly during the presentation and took credit for her ideas in front of the client. She wants you to formally reprimand Daniel. What do you do?').setChoiceValues(['Meet with Priya privately, listen to her account, validate her frustration, and ask what resolution she would consider fair before taking any steps', 'Set up a three-way meeting with Priya and Daniel so they can air their perspectives, and facilitate the conversation yourself', 'Have a quiet word with Daniel and tell him to be more respectful of Priya\'s contributions in future meetings', 'Explain to Priya that client calls can be fast-paced and competitive, and suggest she be more assertive next time rather than relying on you to intervene']);
    form.addMultipleChoiceItem().setTitle('4. Over the past month, you have noticed that Aisha, a team member in Customer Service, has been making more errors in her case notes and has seemed disengaged during team meetings. Two colleagues have separately mentioned to you that they are picking up extra work because of it. You need to address this. What do you do?').setChoiceValues(['Book a private conversation with Aisha, start by checking in on how she is feeling generally, and explore what might be behind the change before raising the specific performance concerns', 'Document the specific errors and instances of disengagement in an email to Aisha, and request a written improvement plan from her within one week', 'Wait until her next performance review, which is in six weeks, and raise it then along with other feedback points', 'Ask one of her closer colleagues to have a friendly word with her about picking up the pace, to keep it informal and avoid putting her on the spot']);
    form.addMultipleChoiceItem().setTitle('5. Which statement best describes how you now feel about handling situations related to this course topic?').setChoiceValues(['I handle these situations effectively and get consistent positive results', 'I manage most aspects but still struggle with some', 'I often feel unsure or avoid these situations', 'I have little or no experience with these situations']);
    form.addParagraphTextItem().setTitle('6. What is one concept, tool, or idea from today that you understand clearly and could explain to a colleague?');
    form.addParagraphTextItem().setTitle('7. What is the first thing you will do differently at work as a result of this training? With whom, and by when?');
    form.addMultipleChoiceItem().setTitle('8. If you practised scenarios or role-plays during the session, which statement best reflects your experience?').setChoiceValues(['I demonstrated the target behaviours effectively and received positive feedback', 'I partially demonstrated them and I know what to improve', 'I struggled to demonstrate the behaviours in the scenario', '[N/A] We did not do a scenario or role-play in this session']);
    form.addMultipleChoiceItem().setTitle('9. Which statement best describes the value of this course for your role?').setChoiceValues(['Highly valuable: I gained practical tools I will use immediately', 'Valuable: I learned useful concepts I expect to apply over time', 'Somewhat valuable: some content was relevant but much was not new', 'Limited value: the content did not connect to my real work challenges']);
    form.addMultipleChoiceItem().setTitle('10. Would you recommend this course to a colleague?').setChoiceValues(['Yes', 'Maybe', 'No']);
    form.addParagraphTextItem().setTitle('11. What would have made this course even more useful for you?');
    form.addCheckboxItem().setTitle('12. Please tick in the other TCM services you would be interested in:').setChoiceValues(['The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other']);
    form.addScaleItem().setTitle('13. Overall, how would you rate the usefulness of the course? (1 being very poor and 5 being very good)').setBounds(1, 5);
    Logger.log('Published URL: ' + form.getPublishedUrl());
    Logger.log('Editor URL: ' + form.getEditUrl());
  }

  function createLeadershipExecutiveCoachingQ330DayRefresher() {
    var form = FormApp.create('Leadership Executive Coaching (Q3) - 30 Day Refresher');
    form.setTitle('Learning Transfer Report - Leadership Executive Coaching (Q3)');
    form.setDescription('Please complete this survey.');
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);

    form.addMultipleChoiceItem().setTitle('1. Marcus, a senior analyst in the Risk team, calls you in frustration after a strategy meeting. He says his colleague Elena openly contradicted his analysis in front of the department head and made him look incompetent. He wants you to escalate the matter. What do you do?').setChoiceValues(['Sit down privately with Marcus, let him share his full perspective, recognise how the experience affected him, and explore together what a constructive resolution might look like before involving anyone else', 'Bring Marcus and Elena together for a structured conversation where each can share their view of what happened, and guide them toward an agreement on how to work together going forward', 'Speak to Elena separately and explain that publicly contradicting a colleague is unprofessional and ask her to be more diplomatic in future meetings', 'Reassure Marcus that disagreements over analysis are normal in a risk team and suggest he prepare more thoroughly for future meetings so his work speaks for itself']);
    form.addMultipleChoiceItem().setTitle('2. Over the past few weeks, you have observed that Liam, a team member in Product Development, has stopped contributing ideas during sprint planning, has missed two internal deadlines, and appears withdrawn. What do you do?').setChoiceValues(['Arrange a private, unhurried conversation with Liam, begin by genuinely asking how he is, and create space for him to share what is going on before discussing the specific work concerns', 'Put together a summary of the missed deadlines and reduced participation, share it with Liam by email, and ask him to propose a plan to get back on track within the next five working days', 'Decide to wait and see if things improve naturally over the next sprint cycle, since raising it now might add pressure when he is already struggling', 'Mention it to the whole team during the next retrospective as a general point about the importance of meeting deadlines and contributing, without singling Liam out']);
    form.addMultipleChoiceItem().setTitle('3. Which statement best describes how you now handle situations related to this course topic?').setChoiceValues(['I handle these situations effectively and get consistent positive results', 'I manage most aspects but still struggle with some', 'I often feel unsure or avoid these situations', 'I have little or no experience with these situations']);
    form.addMultipleChoiceItem().setTitle('4. How often have you applied skills or methods from this training in your work?').setChoiceValues(['Regularly: I use what I learned at least weekly', 'Occasionally: I have applied it several times in the past few months', 'Rarely: I have applied it once or twice', 'Not yet: I have not had the opportunity or felt ready to apply it']);
    form.addParagraphTextItem().setTitle('5. Describe a real situation where you applied something from the training at work. (What was the situation? Which specific skill? What did you do step by step? What happened?)');
    form.addParagraphTextItem().setTitle('6. Which parts of the training felt difficult to apply in real work? Why?');
    form.addParagraphTextItem().setTitle('7. Since the training, what have you done differently at work?');
    form.addParagraphTextItem().setTitle('8. Have you noticed any measurable changes in your team or work environment that may relate to what you learned?');
    form.addParagraphTextItem().setTitle('9. What support, tools, or conditions helped (or would have helped) you apply what you learned?');
    form.addParagraphTextItem().setTitle('10. What improvements would make this course even more useful?');
    form.addCheckboxItem().setTitle('11. Please tick in the other TCM services you would be interested in:').setChoiceValues(['The Investigation Company', 'The Mediation Company', 'Resolution Framework', 'The TCM Academy', 'The People and Culture Association', 'Engage Leadership', 'Engage Coaching', 'People and Culture', 'Other']);
    Logger.log('Published URL: ' + form.getPublishedUrl());
    Logger.log('Editor URL: ' + form.getEditUrl());
  }

  createLeadershipExecutiveCoachingQ3PreSession();
  createLeadershipExecutiveCoachingQ3LearnerReflection();
  createLeadershipExecutiveCoachingQ330DayRefresher();
}

