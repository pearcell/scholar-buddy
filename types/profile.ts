export interface StudentProfile {
  // Academics
  educationLevel: string;
  currentYear: string;
  major: string;
  gpa: number | null;
  institutionName: string;
  expectedGraduationYear: string;

  // Demographics
  age: number | null;
  gender: string;
  raceEthnicity: string[];
  firstGeneration: string;
  militaryAffiliation: string;
  disabilityStatus: string;
  usCitizen: string;

  // Financial
  householdIncome: string;
  fafsaCompleted: string;
  pellGrantEligibility: string;

  // Location
  state: string;
  zipCode: string;
  residencyDuration: string;

  // Activities & Interests
  hobbies: string[];
  extracurriculars: string[];
  volunteerExperience: string;
  leadershipExperience: string;
  careerInterests: string[];

  // Additional Background
  fosterCareBackground: string;
  religiousAffiliation: string;
  employmentStatus: string;
  academicAchievements: string;
  organizationMemberships: string;

  // General
  additionalInformation: string;
}