import { preSessionTemplate, refresherTemplate, endSessionTemplate } from './src/data/mockData';
import { mockAiScenariosLibrary } from './src/data/mockData';

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

const generateGAS = (template: any, formName: string) => {
  let code = `  function create${formName.replace(/[^A-Za-z0-9]/g, '')}() {\n`;
  code += `    var form = FormApp.create('${formName}');\n`;
  code += `    form.setTitle('${template.title} - Leadership Executive Coaching (Q3)');\n`;
  code += `    form.setDescription('Please complete this form.');\n`;
  code += `    form.addTextItem().setTitle('Full Name').setRequired(true);\n`;
  code += `    form.addTextItem().setTitle('Email Address').setRequired(true);\n\n`;

  template.questions.forEach((q: any, idx: number) => {
    const text = (idx + 1) + '. ' + q.text.replace(/^[A-Z]\d+\.\s*/, '').replace(/^Optional:\s*/, '').replace(/'/g, "\\'");
    
    if (q.type === 'text') {
      code += `    form.addParagraphTextItem().setTitle('${text}')${q.required ? '.setRequired(true)' : ''};\n`;
    } else if (q.type === 'choice') {
      let options = (q.options || []).map((opt: string) => `'${opt.replace(/^[\[]\d+[\]]\s*/, '').replace(/'/g, "\\'")}'`).join(', ');
      code += `    form.addMultipleChoiceItem().setTitle('${text}').setChoiceValues([${options}])${q.required ? '.setRequired(true)' : ''};\n`;
    } else if (q.type === 'checkbox') {
      let options = (q.options || []).map((opt: string) => `'${opt.replace(/^[\[]\d+[\]]\s*/, '').replace(/'/g, "\\'")}'`).join(', ');
      code += `    form.addCheckboxItem().setTitle('${text}').setChoiceValues([${options}]);\n`;
    } else if (q.type === 'scale') {
      code += `    form.addScaleItem().setTitle('${text}').setBounds(1, 5);\n`;
    }
  });

  code += `    Logger.log('Published URL: ' + form.getPublishedUrl());\n`;
  code += `    Logger.log('Editor URL: ' + form.getEditUrl());\n`;
  code += `  }\n\n`;
  return code;
};

let finalCode = `function createAllForms() {\n`;
finalCode += `  // Copy and paste this script into Google Apps Script (script.google.com)\n`;
finalCode += `  // Click "Run" -> "createAllForms"\n\n`;

finalCode += generateGAS(preSessionTemplate, "Leadership Executive Coaching (Q3) - What You Know");
finalCode += generateGAS(robustEndSessionTemplate, "Leadership Executive Coaching (Q3) - What You Learnt");
finalCode += generateGAS(refresherTemplate, "Leadership Executive Coaching (Q3) - What You Did");

finalCode += `  createLeadershipExecutiveCoachingQ3WhatYouKnow();\n`;
finalCode += `  createLeadershipExecutiveCoachingQ3WhatYouLearnt();\n`;
finalCode += `  createLeadershipExecutiveCoachingQ3WhatYouDid();\n`;
finalCode += `}\n`;

console.log(finalCode);
