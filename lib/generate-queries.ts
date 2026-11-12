import "dotenv/config";
import { zodResponseFormat } from "openai/helpers/zod";
import { openRouterClient, model } from "./openrouter";
import { searchPlanSchema, type SearchPlan } from "./schemas/search";

const SYSTEM_PROMPT = `You generate targeted web search queries
for finding scholarships.

Analyze the student's profile and generate
3-5 distinct search queries.

Prioritize queries that identify scholarships
the student could realistically qualify for.

Make queries specific enough to produce
relevant search results.

Do not invent qualifications or personal
attributes not provided in the profile.`;

export interface StudentProfile {
  major: string;
  gpa: number;
  state: string;
  academicLevel: string;
  educationLevel?: string;
  currentYear?: string;
  institutionName?: string;
  expectedGraduationYear?: string;
  age?: number | null;
  gender?: string;
  raceEthnicity?: string[];
  firstGeneration?: string;
  militaryAffiliation?: string;
  disabilityStatus?: string;
  citizenship?: string;
  householdIncome?: string;
  fafsaCompleted?: string;
  pellGrantEligibility?: string;
  zipCode?: string;
  residencyDuration?: string;
  hobbies?: string[];
  extracurriculars?: string[];
  volunteerExperience?: string;
  leadershipExperience?: string;
  careerInterests?: string[];
  fosterCareBackground?: string;
  religiousAffiliation?: string;
  employmentStatus?: string;
  academicAchievements?: string;
  organizationMemberships?: string;
  additionalInformation?: string;
}

export async function generateSearchQueries(profile: StudentProfile): Promise<SearchPlan> {
  const profileSummary = buildProfileSummary(profile);

  const response = await openRouterClient.chat.completions.parse({
    model: model as string,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Student Profile:\n${profileSummary}\n\nGenerate 3-5 targeted scholarship search queries.`,
      },
    ],
    response_format: zodResponseFormat(searchPlanSchema, "search_plan"),
    temperature: 0.3,
  });

  const parsed = response.choices[0]?.message?.parsed as SearchPlan | undefined;
  if (!parsed) {
    throw new Error("Failed to generate search queries: no parsed response");
  }

  return parsed;
}

function buildProfileSummary(profile: StudentProfile): string {
  const lines: string[] = [];

  lines.push(`Major: ${profile.major}`);
  lines.push(`GPA: ${profile.gpa}`);
  lines.push(`State: ${profile.state}`);
  lines.push(`Academic Level: ${profile.academicLevel}`);

  if (profile.educationLevel) lines.push(`Education Level: ${profile.educationLevel}`);
  if (profile.currentYear) lines.push(`Current Year: ${profile.currentYear}`);
  if (profile.institutionName) lines.push(`Institution: ${profile.institutionName}`);
  if (profile.expectedGraduationYear) lines.push(`Expected Graduation: ${profile.expectedGraduationYear}`);
  if (profile.age) lines.push(`Age: ${profile.age}`);
  if (profile.gender) lines.push(`Gender: ${profile.gender}`);
  if (profile.raceEthnicity?.length) lines.push(`Race/Ethnicity: ${profile.raceEthnicity.join(", ")}`);
  if (profile.firstGeneration) lines.push(`First Generation: ${profile.firstGeneration}`);
  if (profile.militaryAffiliation) lines.push(`Military Affiliation: ${profile.militaryAffiliation}`);
  if (profile.disabilityStatus) lines.push(`Disability Status: ${profile.disabilityStatus}`);
  if (profile.citizenship) lines.push(`Citizenship: ${profile.citizenship}`);
  if (profile.householdIncome) lines.push(`Household Income: ${profile.householdIncome}`);
  if (profile.fafsaCompleted) lines.push(`FAFSA Completed: ${profile.fafsaCompleted}`);
  if (profile.pellGrantEligibility) lines.push(`Pell Grant Eligible: ${profile.pellGrantEligibility}`);
  if (profile.zipCode) lines.push(`ZIP Code: ${profile.zipCode}`);
  if (profile.residencyDuration) lines.push(`Residency Duration: ${profile.residencyDuration}`);
  if (profile.hobbies?.length) lines.push(`Hobbies: ${profile.hobbies.join(", ")}`);
  if (profile.extracurriculars?.length) lines.push(`Extracurriculars: ${profile.extracurriculars.join(", ")}`);
  if (profile.volunteerExperience) lines.push(`Volunteer Experience: ${profile.volunteerExperience}`);
  if (profile.leadershipExperience) lines.push(`Leadership Experience: ${profile.leadershipExperience}`);
  if (profile.careerInterests?.length) lines.push(`Career Interests: ${profile.careerInterests.join(", ")}`);
  if (profile.fosterCareBackground) lines.push(`Foster Care Background: ${profile.fosterCareBackground}`);
  if (profile.religiousAffiliation) lines.push(`Religious Affiliation: ${profile.religiousAffiliation}`);
  if (profile.employmentStatus) lines.push(`Employment Status: ${profile.employmentStatus}`);
  if (profile.academicAchievements) lines.push(`Academic Achievements: ${profile.academicAchievements}`);
  if (profile.organizationMemberships) lines.push(`Organization Memberships: ${profile.organizationMemberships}`);
  if (profile.additionalInformation) lines.push(`Additional Info: ${profile.additionalInformation}`);

  return lines.join("\n");
}