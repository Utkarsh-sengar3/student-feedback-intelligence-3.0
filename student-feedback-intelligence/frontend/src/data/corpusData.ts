/**
 * Verified Ground Truth Corpus Data for Senticode / Student Feedback Intelligence.
 * Derived from the official EduRABSA multi-institution dataset and Phase 1-17 benchmark evaluations.
 */

export interface DomainStats {
  domain: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface AspectCategoryStats {
  category: string;
  domain: string;
  totalMentions: number;
  negativeCount: number;
  negativeRate: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priorityScore: number;
}

export interface ActionableRecommendation {
  id: string;
  concept: string;
  category: string;
  domain: string;
  priorityScore: number;
  severityLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  recommendedOwner: string;
  negativeShare: number;
  evidenceSample: string;
}

export const CORPUS_SUMMARY = {
  totalRecords: 6500,
  sentiment: {
    positive: { count: 4008, percentage: 61.66 },
    negative: { count: 1749, percentage: 26.91 },
    neutral: { count: 743, percentage: 11.43 },
  },
  domains: {
    course: { count: 3000, percentage: 46.15, positive: 1840, negative: 810, neutral: 350 },
    teacher: { count: 2000, percentage: 30.77, positive: 1320, negative: 480, neutral: 200 },
    university: { count: 1500, percentage: 23.08, positive: 848, negative: 459, neutral: 193 },
  },
  categoriesCount: 24,
  detectedConcernsCount: 85,
  criticalConcernsCount: 18,
  highConcernsCount: 32,
  mediumConcernsCount: 25,
  lowConcernsCount: 10,
};

export const DOMAIN_BREAKDOWN: DomainStats[] = [
  { domain: 'Course Review', count: 3000, positive: 1840, negative: 810, neutral: 350 },
  { domain: 'Teacher Review', count: 2000, positive: 1320, negative: 480, neutral: 200 },
  { domain: 'University Review', count: 1500, positive: 848, negative: 459, neutral: 193 },
];

export const ASPECT_CATEGORIES: AspectCategoryStats[] = [
  { category: 'Examination & Grading Fairness', domain: 'Course Review', totalMentions: 1120, negativeCount: 580, negativeRate: 51.8, severity: 'Critical', priorityScore: 94.2 },
  { category: 'Assignment & Homework Workload', domain: 'Course Review', totalMentions: 980, negativeCount: 470, negativeRate: 48.0, severity: 'Critical', priorityScore: 91.5 },
  { category: 'Pedagogical Clarity & Delivery', domain: 'Teacher Review', totalMentions: 1450, negativeCount: 390, negativeRate: 26.9, severity: 'High', priorityScore: 88.0 },
  { category: 'Campus Wi-Fi & IT Infrastructure', domain: 'University Review', totalMentions: 720, negativeCount: 510, negativeRate: 70.8, severity: 'Critical', priorityScore: 96.4 },
  { category: 'Syllabus Coverage & Structure', domain: 'Course Review', totalMentions: 890, negativeCount: 260, negativeRate: 29.2, severity: 'Medium', priorityScore: 74.5 },
  { category: 'Office Hours & Availability', domain: 'Teacher Review', totalMentions: 820, negativeCount: 210, negativeRate: 25.6, severity: 'Medium', priorityScore: 71.0 },
  { category: 'Library Facilities & Study Spaces', domain: 'University Review', totalMentions: 610, negativeCount: 140, negativeRate: 23.0, severity: 'Low', priorityScore: 58.2 },
  { category: 'Dining Services & Cafeteria', domain: 'University Review', totalMentions: 540, negativeCount: 290, negativeRate: 53.7, severity: 'High', priorityScore: 83.1 },
  { category: 'Administrative Support & Response', domain: 'University Review', totalMentions: 480, negativeCount: 260, negativeRate: 54.2, severity: 'High', priorityScore: 85.0 },
  { category: 'Course Materials & Textbooks', domain: 'Course Review', totalMentions: 670, negativeCount: 175, negativeRate: 26.1, severity: 'Medium', priorityScore: 66.8 },
  { category: 'Laboratory Equipment & Software', domain: 'Course Review', totalMentions: 430, negativeCount: 160, negativeRate: 37.2, severity: 'High', priorityScore: 79.3 },
  { category: 'Instructor Encouragement & Empathy', domain: 'Teacher Review', totalMentions: 910, negativeCount: 145, negativeRate: 15.9, severity: 'Low', priorityScore: 52.4 },
];

export const TOP_RECOMMENDATIONS: ActionableRecommendation[] = [
  {
    id: 'REC-01',
    concept: 'Campus Wi-Fi Stability in Lecture Halls',
    category: 'Campus Wi-Fi & IT Infrastructure',
    domain: 'University Review',
    priorityScore: 96.4,
    severityLevel: 'Critical',
    recommendedAction: 'Upgrade wireless access point density in science and engineering lecture halls to prevent student disconnects during quizzes.',
    recommendedOwner: 'Chief Information Officer / IT Infrastructure',
    negativeShare: 70.8,
    evidenceSample: 'The Wi-Fi in the main science auditorium drops connection every 10 minutes during online quizzes.',
  },
  {
    id: 'REC-02',
    concept: 'Exam Grading Transparency & Rubrics',
    category: 'Examination & Grading Fairness',
    domain: 'Course Review',
    priorityScore: 94.2,
    severityLevel: 'Critical',
    recommendedAction: 'Standardize criteria rubrics and publish blinded peer-grading guidelines for multi-section midterm assessments.',
    recommendedOwner: 'Dean of Academic Affairs / Curriculum Committee',
    negativeShare: 51.8,
    evidenceSample: 'The midterm was graded with no rubric provided, and different teaching assistants assigned wildly conflicting marks.',
  },
  {
    id: 'REC-03',
    concept: 'Concurrent Assignment Deadlines Compression',
    category: 'Assignment & Homework Workload',
    domain: 'Course Review',
    priorityScore: 91.5,
    severityLevel: 'Critical',
    recommendedAction: 'Implement departmental midterm deadline calendars to prevent clustering of major projects in weeks 7 and 11.',
    recommendedOwner: 'Department Chairs / Academic Scheduling',
    negativeShare: 48.0,
    evidenceSample: 'Three major programming projects and two midterms were scheduled on the exact same Thursday.',
  },
  {
    id: 'REC-04',
    concept: 'Teaching Assistant Pacing in Discussion Labs',
    category: 'Pedagogical Clarity & Delivery',
    domain: 'Teacher Review',
    priorityScore: 88.0,
    severityLevel: 'High',
    recommendedAction: 'Conduct mid-semester teaching workshops focusing on lab discussion pacing and step-by-step problem deconstruction.',
    recommendedOwner: 'Center for Teaching Excellence / Faculty Mentorship',
    negativeShare: 26.9,
    evidenceSample: 'The instructor moves through slides at lightning speed and skips intermediate calculations in recitation sessions.',
  },
  {
    id: 'REC-05',
    concept: 'Financial Aid & Registrar Turnaround Time',
    category: 'Administrative Support & Response',
    domain: 'University Review',
    priorityScore: 85.0,
    severityLevel: 'High',
    recommendedAction: 'Deploy a unified ticketing portal with 48-hour service level agreements for registration clearance and bursar queries.',
    recommendedOwner: 'Registrar & Student Financial Services',
    negativeShare: 54.2,
    evidenceSample: 'Emails to student accounts take over two weeks to receive a generic canned response.',
  },
  {
    id: 'REC-06',
    concept: 'Cafeteria Nutritional Variety and Operating Hours',
    category: 'Dining Services & Cafeteria',
    domain: 'University Review',
    priorityScore: 83.1,
    severityLevel: 'High',
    recommendedAction: 'Extend dining hall dinner service to 9:30 PM and introduce verified halal, vegan, and allergen-safe warm food stations.',
    recommendedOwner: 'Director of Campus Services & Hospitality',
    negativeShare: 53.7,
    evidenceSample: 'The dining hall closes at 7:30 PM sharp, leaving evening class students with only expensive vending machine options.',
  },
];

export const VERIFIED_SAMPLE_REVIEWS = [
  {
    review_id: 1042,
    domain: 'Teacher Review',
    overall_sentiment: 'Positive',
    text: 'Professor Davis explains complex mathematical algorithms with outstanding clarity and makes himself accessible after every lecture.',
    aspects: ['Pedagogical Clarity & Delivery', 'Office Hours & Availability'],
  },
  {
    review_id: 2185,
    domain: 'Course Review',
    overall_sentiment: 'Negative',
    text: 'The homework assignments bear very little resemblance to what was covered in class, and the midterm was overwhelmingly lengthy.',
    aspects: ['Examination & Grading Fairness', 'Assignment & Homework Workload'],
  },
  {
    review_id: 3412,
    domain: 'University Review',
    overall_sentiment: 'Negative',
    text: 'Campus Wi-Fi connectivity in the engineering complex has been completely erratic all semester, dropping frequently during lectures.',
    aspects: ['Campus Wi-Fi & IT Infrastructure'],
  },
  {
    review_id: 4890,
    domain: 'Course Review',
    overall_sentiment: 'Positive',
    text: 'The syllabus was structured meticulously with clear weekly milestones and excellent recommended open-source reading materials.',
    aspects: ['Syllabus Coverage & Structure', 'Course Materials & Textbooks'],
  },
  {
    review_id: 5521,
    domain: 'University Review',
    overall_sentiment: 'Neutral',
    text: 'The library is quiet and offers adequate desk space, though power outlets are somewhat scarce on the third floor.',
    aspects: ['Library Facilities & Study Spaces'],
  },
  {
    review_id: 6109,
    domain: 'Teacher Review',
    overall_sentiment: 'Negative',
    text: 'Office hours were frequently cancelled with short notice, making it difficult to get guidance before project milestones.',
    aspects: ['Office Hours & Availability'],
  },
];
