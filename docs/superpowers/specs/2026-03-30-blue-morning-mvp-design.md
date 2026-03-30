# Blue Morning Consultancy - Survey Platform MVP Design Spec

## Overview
An interactive MVP for an online platform that manages an end-to-end 3-part survey journey (Pre-Session, End of Session, Pre-Refresher) for training cohorts. This prototype is built specifically to demonstrate value to stakeholders without requiring a live backend database.

## Target Audience & Focus
The primary focus of this MVP is the **Consultant/Trainer Experience**. It will show how easily a trainer can orchestrate sessions, generate advanced LTEM Tier 5/6 evaluation scenarios using AI, and view actionable insights on trainee progress.

## Architecture
- **Tech Stack**: Modern React web application (e.g., Vite/Next.js) styled with Tailwind CSS or standard Vanilla CSS with high-end premium aesthetics.
- **Data Layer**: Browser-based `localStorage` and rich, hardcoded JSON mock data to simulate a live database experience during pitches. 
- **AI Simulation**: The MVP will use pre-scripted high-fidelity examples of AI outputs based on the Will Thalheimer LTEM model to demonstrate the workflow perfectly without live API latency/costs.

## Core Features & Workflows

### 1. The Sessions Dashboard
- Displays a list of active training cohorts (e.g., "Leadership Q3", "Management Basics 101").
- Shows a high-level status of completion across the 3 core surveys (Pre, End, Refresher) for each cohort.

### 2. The Smart Survey Builder & AI Generator
- Creating a "Session" automatically boots up the standard Blue Morning templates for the 3 survey stages.
- **AI Customization (Specific to End of Session Survey)**: 
  - The consultant navigates to an LTEM Scenario Generator tab.
  - Consultant inputs course content / expectations and the number of questions needed.
  - The system (simulated) returns LTEM-aligned output:
    1. **Tier 5 Scenario & Prompt**: Short, realistic corporate dilemmas added directly to the trainee's survey as open-ended text questions.
    2. **Tier 5 Written Marking Rubric**: Stored privately for the consultant.
    3. **Tier 6 Manager Observation Checklist**: Stored securely for post-class manager handoff.

### 3. The Insights & Evaluation View
- **Aggregate Trends**: Visual charts showcasing the class's progression across the 3 surveys.
- **Individual Trainee Journey**: A tabular drill-down to see a specific trainee's shifts in answers.
- **Qualitative Evaluation Tab**: The consultant views submitted written answers for the Tier 5 scenarios side-by-side with the AI-Generated Rubric. Allows the consultant to efficiently grade the text as a "Success" or a "Red Flag trap answer".
- **Manager Playbook Exporter**: An interface to view or export the Tier 6 30-day Observation Checklist for easy distribution to the trainees' managers.

## Success Criteria for MVP
- High-quality, polished UI that feels like a premium SaaS product.
- A seamless workflow demonstration from Session Creation -> AI Generation -> Trainee Answer Evaluation -> Dashboard Insights.
- Fully clickable mock data so stakeholders can interact with the product.
