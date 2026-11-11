"use client";

import { useState, useMemo } from "react";
import { StudentProfile } from "../types/profile";

interface ProfileFormProps {
  onSubmit: (profile: StudentProfile) => void;
}

// Type for option objects
type SelectOption = { value: string; label: string };

// Education level options with their corresponding year options
const EDUCATION_LEVELS: SelectOption[] = [
  { value: "", label: "Select education level" },
  { value: "High School", label: "High School" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Graduate", label: "Graduate" },
  { value: "Trade/Vocational", label: "Trade/Vocational" },
  { value: "Other", label: "Other" },
];

const YEAR_OPTIONS_BY_LEVEL: Record<string, SelectOption[]> = {
  "High School": [
    { value: "", label: "Select current year" },
    { value: "Freshman (9th)", label: "Freshman (9th Grade)" },
    { value: "Sophomore (10th)", label: "Sophomore (10th Grade)" },
    { value: "Junior (11th)", label: "Junior (11th Grade)" },
    { value: "Senior (12th)", label: "Senior (12th Grade)" },
    { value: "Other", label: "Other" },
  ],
  "Undergraduate": [
    { value: "", label: "Select current year" },
    { value: "Freshman", label: "Freshman (1st Year)" },
    { value: "Sophomore", label: "Sophomore (2nd Year)" },
    { value: "Junior", label: "Junior (3rd Year)" },
    { value: "Senior", label: "Senior (4th Year)" },
    { value: "5th Year+", label: "5th Year or Beyond" },
    { value: "Other", label: "Other" },
  ],
  "Graduate": [
    { value: "", label: "Select current year" },
    { value: "1st Year", label: "1st Year Graduate" },
    { value: "2nd Year", label: "2nd Year Graduate" },
    { value: "3rd Year", label: "3rd Year Graduate" },
    { value: "4th Year+", label: "4th Year or Beyond" },
    { value: "Other", label: "Other" },
  ],
  "Trade/Vocational": [
    { value: "", label: "Select current year" },
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year+", label: "4th Year or Beyond" },
    { value: "Other", label: "Other" },
  ],
  "Other": [
    { value: "", label: "Select current year" },
    { value: "Year 1", label: "Year 1" },
    { value: "Year 2", label: "Year 2" },
    { value: "Year 3", label: "Year 3" },
    { value: "Year 4+", label: "Year 4 or Beyond" },
    { value: "Other", label: "Other" },
  ],
};

const CITIZENSHIP_OPTIONS: SelectOption[] = [
  { value: "", label: "Select citizenship status" },
  { value: "US Citizen", label: "US Citizen" },
  { value: "Permanent Resident", label: "Permanent Resident" },
  { value: "International Student", label: "International Student" },
  { value: "Other/Unsure", label: "Other/Unsure" },
];

const EXTRACURRICULAR_OPTIONS: SelectOption[] = [
  { value: "Robotics", label: "Robotics" },
  { value: "Research", label: "Research" },
  { value: "Community Service / Volunteering", label: "Community Service / Volunteering" },
  { value: "Student Government", label: "Student Government" },
  { value: "Sports / Athletics", label: "Sports / Athletics" },
  { value: "Music", label: "Music" },
  { value: "Arts", label: "Arts" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "STEM Clubs", label: "STEM Clubs" },
  { value: "Academic Clubs", label: "Academic Clubs" },
  { value: "Leadership", label: "Leadership" },
  { value: "Employment", label: "Employment" },
  { value: "Other", label: "Other" },
];

const STATE_OPTIONS: SelectOption[] = [
  { value: "", label: "Select state" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
  { value: "Other", label: "Other / Non-US" },
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: "", label: "Select gender" },
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Genderqueer", label: "Genderqueer" },
  { value: "Transgender", label: "Transgender" },
  { value: "Prefer not to say", label: "Prefer not to say" },
  { value: "Other", label: "Other" },
];

const RACE_ETHNICITY_OPTIONS: SelectOption[] = [
  { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
  { value: "Asian", label: "Asian" },
  { value: "Black or African American", label: "Black or African American" },
  { value: "Hispanic or Latino", label: "Hispanic or Latino" },
  { value: "Native Hawaiian or Other Pacific Islander", label: "Native Hawaiian or Other Pacific Islander" },
  { value: "White", label: "White" },
  { value: "Middle Eastern or North African", label: "Middle Eastern or North African" },
  { value: "Prefer not to say", label: "Prefer not to say" },
  { value: "Other", label: "Other" },
];

const YES_NO_OPTIONS: SelectOption[] = [
  { value: "", label: "Select" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const YES_NO_UNSURE_OPTIONS: SelectOption[] = [
  { value: "", label: "Select" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Unsure", label: "Unsure" },
];

const MILITARY_OPTIONS: SelectOption[] = [
  { value: "", label: "Select military affiliation" },
  { value: "Active Duty", label: "Active Duty" },
  { value: "Reserve", label: "Reserve" },
  { value: "National Guard", label: "National Guard" },
  { value: "Veteran", label: "Veteran" },
  { value: "Military Spouse/Dependent", label: "Military Spouse/Dependent" },
  { value: "ROTC", label: "ROTC" },
  { value: "None", label: "None" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const DISABILITY_OPTIONS: SelectOption[] = [
  { value: "", label: "Select disability status" },
  { value: "Yes, I have a disability", label: "Yes, I have a disability" },
  { value: "No, I do not have a disability", label: "No, I do not have a disability" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const INCOME_OPTIONS: SelectOption[] = [
  { value: "", label: "Select household income range" },
  { value: "Under $25,000", label: "Under $25,000" },
  { value: "$25,000 - $49,999", label: "$25,000 - $49,999" },
  { value: "$50,000 - $74,999", label: "$50,000 - $74,999" },
  { value: "$75,000 - $99,999", label: "$75,000 - $99,999" },
  { value: "$100,000 - $149,999", label: "$100,000 - $149,999" },
  { value: "$150,000 - $199,999", label: "$150,000 - $199,999" },
  { value: "$200,000 - $249,999", label: "$200,000 - $249,999" },
  { value: "$250,000 or more", label: "$250,000 or more" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const GRADUATION_YEAR_OPTIONS: SelectOption[] = (() => {
  const currentYear = new Date().getFullYear();
  const options: SelectOption[] = [{ value: "", label: "Select expected graduation year" }];
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i;
    options.push({ value: String(year), label: String(year) });
  }
  options.push({ value: "Other", label: "Other / Not sure" });
  return options;
})();

const RESIDENCY_DURATION_OPTIONS: SelectOption[] = [
  { value: "", label: "Select residency duration" },
  { value: "Less than 1 year", label: "Less than 1 year" },
  { value: "1-2 years", label: "1-2 years" },
  { value: "3-5 years", label: "3-5 years" },
  { value: "6-10 years", label: "6-10 years" },
  { value: "10+ years", label: "10+ years" },
  { value: "Not a resident", label: "Not a resident" },
];

const HOBBY_OPTIONS: SelectOption[] = [
  { value: "Reading", label: "Reading" },
  { value: "Writing", label: "Writing / Creative Writing" },
  { value: "Gaming", label: "Gaming / Esports" },
  { value: "Coding", label: "Coding / Programming" },
  { value: "Cooking", label: "Cooking / Baking" },
  { value: "Fitness", label: "Fitness / Exercise" },
  { value: "Outdoors", label: "Outdoors / Hiking / Camping" },
  { value: "Photography", label: "Photography / Videography" },
  { value: "Music", label: "Playing Music / Singing" },
  { value: "Art", label: "Visual Arts / Drawing / Painting" },
  { value: "Travel", label: "Travel / Exploration" },
  { value: "Languages", label: "Learning Languages" },
  { value: "DIY", label: "DIY / Crafts / Making" },
  { value: "Collecting", label: "Collecting" },
  { value: "Other", label: "Other" },
];

const CAREER_INTEREST_OPTIONS: SelectOption[] = [
  { value: "Healthcare / Medicine", label: "Healthcare / Medicine" },
  { value: "Technology / Software", label: "Technology / Software Engineering" },
  { value: "Engineering", label: "Engineering" },
  { value: "Science / Research", label: "Science / Research" },
  { value: "Education / Teaching", label: "Education / Teaching" },
  { value: "Business / Finance", label: "Business / Finance" },
  { value: "Law / Legal", label: "Law / Legal" },
  { value: "Arts / Entertainment", label: "Arts / Entertainment" },
  { value: "Government / Public Service", label: "Government / Public Service" },
  { value: "Non-profit / Social Work", label: "Non-profit / Social Work" },
  { value: "Skilled Trades", label: "Skilled Trades" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Environmental / Sustainability", label: "Environmental / Sustainability" },
  { value: "Undecided", label: "Undecided" },
  { value: "Other", label: "Other" },
];

const RELIGIOUS_AFFILIATION_OPTIONS: SelectOption[] = [
  { value: "", label: "Select religious affiliation" },
  { value: "Christian", label: "Christian" },
  { value: "Catholic", label: "Catholic" },
  { value: "Jewish", label: "Jewish" },
  { value: "Muslim", label: "Muslim" },
  { value: "Buddhist", label: "Buddhist" },
  { value: "Hindu", label: "Hindu" },
  { value: "Atheist", label: "Atheist" },
  { value: "Agnostic", label: "Agnostic" },
  { value: "Spiritual but not religious", label: "Spiritual but not religious" },
  { value: "Prefer not to say", label: "Prefer not to say" },
  { value: "Other", label: "Other" },
];

const EMPLOYMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "Select employment status" },
  { value: "Employed full-time", label: "Employed full-time" },
  { value: "Employed part-time", label: "Employed part-time" },
  { value: "Self-employed", label: "Self-employed / Freelance" },
  { value: "Unemployed, seeking work", label: "Unemployed, seeking work" },
  { value: "Not in labor force", label: "Not in labor force (student, caregiver, etc.)" },
  { value: "Retired", label: "Retired" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const FOSTER_CARE_OPTIONS: SelectOption[] = [
  { value: "", label: "Select" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

// Reusable style constants
const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500";

const selectClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none bg-no-repeat bg-right pr-10";

const labelClass = "block text-sm font-medium text-slate-700";

const requiredLabelClass = "block text-sm font-medium text-slate-700 flex items-center gap-1";

const sectionClass = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

const errorClass = "mt-1.5 text-sm text-red-600";

const helperClass = "mt-1.5 text-sm text-slate-500";

const checkboxGroupClass = "space-y-2.5";

const checkboxLabelClass =
  "flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer";

const checkboxLabelCheckedClass =
  "flex items-center gap-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 px-3 py-2.5 text-sm text-blue-900 cursor-pointer";

const checkboxInputClass = "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

const radioGroupClass = "space-y-2";

const radioLabelClass =
  "flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer";

const radioLabelCheckedClass =
  "flex items-center gap-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 px-3 py-2.5 text-sm text-blue-900 cursor-pointer";

const radioInputClass = "h-4 w-4 rounded-full border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  // Academics
  const [educationLevel, setEducationLevel] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [major, setMajor] = useState("");
  const [gpa, setGpa] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [expectedGraduationYear, setExpectedGraduationYear] = useState("");

  // Demographics
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [raceEthnicity, setRaceEthnicity] = useState<string[]>([]);
  const [firstGeneration, setFirstGeneration] = useState("");
  const [militaryAffiliation, setMilitaryAffiliation] = useState("");
  const [disabilityStatus, setDisabilityStatus] = useState("");
  const [usCitizen, setUsCitizen] = useState("");

  // Financial
  const [householdIncome, setHouseholdIncome] = useState("");
  const [fafsaCompleted, setFafsaCompleted] = useState("");
  const [pellGrantEligibility, setPellGrantEligibility] = useState("");

  // Location
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [residencyDuration, setResidencyDuration] = useState("");

  // Activities & Interests
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [otherHobby, setOtherHobby] = useState("");
  const [extracurriculars, setExtracurriculars] = useState<string[]>([]);
  const [otherExtracurricular, setOtherExtracurricular] = useState("");
  const [volunteerExperience, setVolunteerExperience] = useState("");
  const [leadershipExperience, setLeadershipExperience] = useState("");
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [otherCareerInterest, setOtherCareerInterest] = useState("");

  // Additional Background
  const [fosterCareBackground, setFosterCareBackground] = useState("");
  const [religiousAffiliation, setReligiousAffiliation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [academicAchievements, setAcademicAchievements] = useState("");
  const [organizationMemberships, setOrganizationMemberships] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState("");

  // Citizenship (required)
  const [citizenship, setCitizenship] = useState("");

  // Validation states
  const [gpaError, setGpaError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Derived year options based on education level
  const yearOptions = useMemo(() => {
    return YEAR_OPTIONS_BY_LEVEL[educationLevel] || [
      { value: "", label: "Select current year" },
      { value: "Other", label: "Other" },
    ];
  }, [educationLevel]);

  // Reset current year when education level changes
  const handleEducationLevelChange = (value: string) => {
    setEducationLevel(value);
    setCurrentYear("");
  };

  // GPA validation
  const handleGpaChange = (value: string) => {
    const validPattern = /^(\d{0,1}(\.\d{0,2})?)?$/;
    if (validPattern.test(value)) {
      setGpa(value);
      if (value !== "") {
        const numValue = parseFloat(value);
        if (numValue > 4.0) {
          setGpaError("GPA cannot exceed 4.0");
        } else if (numValue < 0) {
          setGpaError("GPA cannot be negative");
        } else {
          setGpaError("");
        }
      } else {
        setGpaError("");
      }
    }
  };

  const handleGpaBlur = () => {
    setTouchedFields((prev) => ({ ...prev, gpa: true }));
    if (gpa !== "") {
      const numValue = parseFloat(gpa);
      if (numValue > 4.0) {
        setGpaError("GPA cannot exceed 4.0");
      } else if (numValue < 0) {
        setGpaError("GPA cannot be negative");
      } else {
        setGpaError("");
      }
    }
  };

  // Age validation
  const handleAgeChange = (value: string) => {
    const validPattern = /^\d*$/;
    if (validPattern.test(value)) {
      setAge(value);
      if (value !== "") {
        const numValue = parseInt(value, 10);
        if (numValue < 13 || numValue > 100) {
          setAgeError("Please enter a valid age (13-100)");
        } else {
          setAgeError("");
        }
      } else {
        setAgeError("");
      }
    }
  };

  const handleAgeBlur = () => {
    setTouchedFields((prev) => ({ ...prev, age: true }));
    if (age !== "") {
      const numValue = parseInt(age, 10);
      if (numValue < 13 || numValue > 100) {
        setAgeError("Please enter a valid age (13-100)");
      } else {
        setAgeError("");
      }
    }
  };

  // ZIP code validation
  const handleZipCodeChange = (value: string) => {
    const validPattern = /^\d{0,5}(-\d{0,4})?$/;
    if (validPattern.test(value)) {
      setZipCode(value.toUpperCase());
    }
  };

  const handleZipCodeBlur = () => {
    setTouchedFields((prev) => ({ ...prev, zipCode: true }));
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (zipCode !== "" && !zipPattern.test(zipCode)) {
      setZipCodeError("Please enter a valid 5-digit ZIP code (or ZIP+4)");
    } else {
      setZipCodeError("");
    }
  };

  // Multi-select handlers
  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, activity: string) => {
    setter((prev: string[]) =>
      prev.includes(activity)
        ? prev.filter((a: string) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleOtherInputBlur = (
    otherValue: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    selection: string[],
    selectionSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = otherValue.trim();
    if (trimmed && !selection.includes(trimmed)) {
      selectionSetter((prev: string[]) => [...prev, trimmed]);
      setter("");
    }
  };

  const removeSelection = (selectionSetter: React.Dispatch<React.SetStateAction<string[]>>, activity: string) => {
    selectionSetter((prev: string[]) => prev.filter((a: string) => a !== activity));
  };

  // Validation helper
  const isFieldValid = (fieldName: string): boolean => {
    switch (fieldName) {
      case "educationLevel":
        return educationLevel !== "";
      case "currentYear":
        return currentYear !== "";
      case "major":
        return major.trim() !== "";
      case "state":
        return state !== "";
      case "citizenship":
        return citizenship !== "";
      case "gpa":
        return gpa === "" || (parseFloat(gpa) >= 0 && parseFloat(gpa) <= 4.0);
      case "age":
        return age === "" || (parseInt(age, 10) >= 13 && parseInt(age, 10) <= 100);
      case "zipCode":
        return zipCode === "" || /^\d{5}(-\d{4})?$/.test(zipCode);
      default:
        return true;
    }
  };

  const isFormValid = useMemo(() => {
    return (
      educationLevel !== "" &&
      currentYear !== "" &&
      major.trim() !== "" &&
      state !== "" &&
      citizenship !== "" &&
      (gpa === "" || (parseFloat(gpa) >= 0 && parseFloat(gpa) <= 4.0))
    );
  }, [educationLevel, currentYear, major, state, citizenship, gpa]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) return;

    const profile: StudentProfile = {
      educationLevel,
      currentYear,
      major: major.trim(),
      gpa: gpa === "" ? null : Number(parseFloat(gpa).toFixed(2)),
      institutionName: institutionName.trim(),
      expectedGraduationYear,
      age: age === "" ? null : parseInt(age, 10),
      gender,
      raceEthnicity: [...raceEthnicity],
      firstGeneration,
      militaryAffiliation,
      disabilityStatus,
      usCitizen,
      householdIncome,
      fafsaCompleted,
      pellGrantEligibility,
      state,
      zipCode: zipCode.trim(),
      residencyDuration,
      hobbies: [...hobbies],
      extracurriculars: [...extracurriculars],
      volunteerExperience,
      leadershipExperience,
      careerInterests: [...careerInterests],
      fosterCareBackground,
      religiousAffiliation,
      employmentStatus,
      academicAchievements: academicAchievements.trim(),
      organizationMemberships: organizationMemberships.trim(),
      additionalInformation: additionalInformation.trim(),
    };

    onSubmit(profile);
  }

  const markTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const showError = (fieldName: string): boolean => {
    return touchedFields[fieldName] && !isFieldValid(fieldName);
  };

  // Helper components
  const renderCheckboxGroup = ({
    options,
    selected,
    onToggle,
    onAddOther,
    otherPlaceholder,
    groupLabel,
    ariaLabel,
    selectionSetter,
    otherState,
    otherSetter,
  }: {
    options: SelectOption[];
    selected: string[];
    onToggle: (value: string) => void;
    onAddOther: () => void;
    otherPlaceholder: string;
    groupLabel?: string;
    ariaLabel: string;
    selectionSetter: React.Dispatch<React.SetStateAction<string[]>>;
    otherState: string;
    otherSetter: React.Dispatch<React.SetStateAction<string>>;
  }) => (
    <div>
      {groupLabel && <label className={labelClass}>{groupLabel}</label>}
      <p className={helperClass}>Select all that apply. You can add a custom option below.</p>
      <div className={checkboxGroupClass} role="group" aria-label={ariaLabel}>
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label key={option.value} className={isChecked ? checkboxLabelCheckedClass : checkboxLabelClass}>
              <input
                type="checkbox"
                className={checkboxInputClass}
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                value={option.value}
                aria-label={option.label}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className={`${inputClass} flex-1`}
          placeholder={otherPlaceholder}
          value={otherState}
          onChange={(e) => otherSetter(e.target.value)}
          onBlur={onAddOther}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddOther();
            }
          }}
          aria-label={`Add another ${ariaLabel.toLowerCase()}`}
        />
      </div>
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label={`Selected ${ariaLabel.toLowerCase()}`}>
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {item}
              <button
                type="button"
                onClick={() => removeSelection(selectionSetter, item)}
                className="rounded-full p-0.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Remove ${item}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderRadioGroup = ({
    options,
    selected,
    onChange,
    name,
    groupLabel,
    required = false,
    touchedField,
  }: {
    options: SelectOption[];
    selected: string;
    onChange: (value: string) => void;
    name: string;
    groupLabel?: string;
    required?: boolean;
    touchedField?: string;
  }) => (
    <div>
      {groupLabel && (
        <label className={required ? requiredLabelClass : labelClass}>
          {groupLabel}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
          {required && <span className="text-xs text-slate-400">(Required)</span>}
        </label>
      )}
      <div className={radioGroupClass} role="radiogroup" aria-label={groupLabel || name}>
        {options.map((option) => {
          const isChecked = selected === option.value;
          return (
            <label key={option.value} className={isChecked ? radioLabelCheckedClass : radioLabelClass}>
              <input
                type="radio"
                name={name}
                className={radioInputClass}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                value={option.value}
                aria-label={option.label}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {touchedField && showError(touchedField) && (
        <p className={errorClass} role="alert">
          Please select an option.
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Education */}
      <section className={sectionClass} aria-labelledby="education-heading">
        <h2 id="education-heading" className="mb-5 text-xl font-bold text-slate-900">
          Education
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="educationLevel" className={requiredLabelClass}>
              Education Level
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="text-xs text-slate-400">(Required)</span>
            </label>
            <select
              id="educationLevel"
              className={selectClass}
              value={educationLevel}
              onChange={(e) => handleEducationLevelChange(e.target.value)}
              onBlur={() => markTouched("educationLevel")}
              required
              aria-required="true"
              aria-invalid={showError("educationLevel")}
              aria-describedby={showError("educationLevel") ? "educationLevel-error" : undefined}
            >
              {EDUCATION_LEVELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showError("educationLevel") && (
              <p id="educationLevel-error" className={errorClass} role="alert">
                Please select your education level.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currentYear" className={requiredLabelClass}>
              Current Year
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="text-xs text-slate-400">(Required)</span>
            </label>
            <select
              id="currentYear"
              className={selectClass}
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              onBlur={() => markTouched("currentYear")}
              required
              aria-required="true"
              aria-invalid={showError("currentYear")}
              aria-describedby={showError("currentYear") ? "currentYear-error" : undefined}
              disabled={!educationLevel}
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!educationLevel && <p className={helperClass}>Select your education level first.</p>}
            {showError("currentYear") && (
              <p id="currentYear-error" className={errorClass} role="alert">
                Please select your current year.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="major" className={requiredLabelClass}>
              Major or Intended Major
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="text-xs text-slate-400">(Required)</span>
            </label>
            <input
              id="major"
              className={inputClass}
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              onBlur={() => markTouched("major")}
              placeholder="e.g. Computer Science, Biology, Business Administration"
              required
              aria-required="true"
              aria-invalid={showError("major")}
              aria-describedby={showError("major") ? "major-error" : "major-hint"}
            />
            <p id="major-hint" className={helperClass}>Enter your current or intended field of study.</p>
            {showError("major") && (
              <p id="major-error" className={errorClass} role="alert">
                Please enter your major or intended major.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="institutionName" className={labelClass}>
              High School / College Name
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <input
              id="institutionName"
              className={inputClass}
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. Lincoln High School, Stanford University"
              aria-describedby="institution-hint"
            />
            <p id="institution-hint" className={helperClass}>
              Name of your current or most recent school.
            </p>
          </div>

          <div>
            <label htmlFor="expectedGraduationYear" className={labelClass}>
              Expected Graduation Year
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="expectedGraduationYear"
              className={selectClass}
              value={expectedGraduationYear}
              onChange={(e) => setExpectedGraduationYear(e.target.value)}
              aria-describedby="graduation-hint"
            >
              {GRADUATION_YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="graduation-hint" className={helperClass}>
              When do you expect to graduate or complete your program?
            </p>
          </div>
        </div>
      </section>

      {/* Academics */}
      <section className={sectionClass} aria-labelledby="academics-heading">
        <h2 id="academics-heading" className="mb-5 text-xl font-bold text-slate-900">
          Academics
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="gpa" className={labelClass}>
              Unweighted GPA
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <input
              id="gpa"
              className={`${inputClass} ${gpaError ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
              type="text"
              inputMode="decimal"
              value={gpa}
              onChange={(e) => handleGpaChange(e.target.value)}
              onBlur={handleGpaBlur}
              placeholder="e.g. 3.75"
              aria-describedby={gpaError ? "gpa-error" : "gpa-hint"}
              aria-invalid={!!gpaError}
              maxLength={4}
            />
            <p id="gpa-hint" className={helperClass}>
              Enter your unweighted GPA on a 4.0 scale (e.g., 3.75). Up to two decimal places.
            </p>
            {gpaError && <p id="gpa-error" className={errorClass} role="alert">{gpaError}</p>}
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className={sectionClass} aria-labelledby="demographics-heading">
        <h2 id="demographics-heading" className="mb-5 text-xl font-bold text-slate-900">
          Demographic Information
        </h2>
        <p className="mb-5 text-sm text-slate-600">
          The following questions help match you with scholarships for specific populations. All are optional.
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="age" className={labelClass}>
              Age
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <input
              id="age"
              className={`${inputClass} ${ageError ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
              type="number"
              min="13"
              max="100"
              value={age}
              onChange={(e) => handleAgeChange(e.target.value)}
              onBlur={handleAgeBlur}
              placeholder="e.g. 19"
              aria-describedby={ageError ? "age-error" : "age-hint"}
              aria-invalid={!!ageError}
            />
            <p id="age-hint" className={helperClass}>Must be between 13 and 100.</p>
            {ageError && <p id="age-error" className={errorClass} role="alert">{ageError}</p>}
          </div>

          <div>
            <label htmlFor="gender" className={labelClass}>
              Gender
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="gender"
              className={selectClass}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              aria-describedby="gender-hint"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="gender-hint" className={helperClass}>Used for demographic-specific scholarships.</p>
          </div>

          <div>
            {renderCheckboxGroup({
              options: RACE_ETHNICITY_OPTIONS,
              selected: raceEthnicity,
              onToggle: (v) => toggleSelection(setRaceEthnicity, v),
              onAddOther: () => handleOtherInputBlur(otherHobby, setOtherHobby, raceEthnicity, setRaceEthnicity),
              otherPlaceholder: "Add another race/ethnicity not listed...",
              groupLabel: "Race / Ethnicity (Optional)",
              ariaLabel: "Race or ethnicity",
              selectionSetter: setRaceEthnicity,
              otherState: otherHobby,
              otherSetter: setOtherHobby,
            })}
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_OPTIONS,
              selected: firstGeneration,
              onChange: setFirstGeneration,
              name: "firstGeneration",
              groupLabel: "First-Generation College Student (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            <label htmlFor="militaryAffiliation" className={labelClass}>
              Military Affiliation
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="militaryAffiliation"
              className={selectClass}
              value={militaryAffiliation}
              onChange={(e) => setMilitaryAffiliation(e.target.value)}
              aria-describedby="military-hint"
            >
              {MILITARY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="military-hint" className={helperClass}>
              Includes active duty, reserve, veteran, ROTC, and military dependents.
            </p>
          </div>

          <div>
            {renderRadioGroup({
              options: DISABILITY_OPTIONS,
              selected: disabilityStatus,
              onChange: setDisabilityStatus,
              name: "disabilityStatus",
              groupLabel: "Disability Status (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_OPTIONS,
              selected: usCitizen,
              onChange: setUsCitizen,
              name: "usCitizen",
              groupLabel: "U.S. Citizen (Optional)",
              touchedField: "",
            })}
          </div>
        </div>
      </section>

      {/* Financial Information */}
      <section className={sectionClass} aria-labelledby="financial-heading">
        <h2 id="financial-heading" className="mb-5 text-xl font-bold text-slate-900">
          Financial Information
        </h2>
        <p className="mb-5 text-sm text-slate-600">
          This information helps identify need-based scholarships. All fields are optional.
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="householdIncome" className={labelClass}>
              Household Income
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="householdIncome"
              className={selectClass}
              value={householdIncome}
              onChange={(e) => setHouseholdIncome(e.target.value)}
              aria-describedby="income-hint"
            >
              {INCOME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="income-hint" className={helperClass}>Used for need-based scholarship eligibility.</p>
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_OPTIONS,
              selected: fafsaCompleted,
              onChange: setFafsaCompleted,
              name: "fafsaCompleted",
              groupLabel: "FAFSA Completed (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_UNSURE_OPTIONS,
              selected: pellGrantEligibility,
              onChange: setPellGrantEligibility,
              name: "pellGrantEligibility",
              groupLabel: "Pell Grant Eligibility (Optional)",
              touchedField: "",
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className={sectionClass} aria-labelledby="location-heading">
        <h2 id="location-heading" className="mb-5 text-xl font-bold text-slate-900">
          Location
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="state" className={requiredLabelClass}>
              State of Residence
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="text-xs text-slate-400">(Required)</span>
            </label>
            <select
              id="state"
              className={selectClass}
              value={state}
              onChange={(e) => setState(e.target.value)}
              onBlur={() => markTouched("state")}
              required
              aria-required="true"
              aria-invalid={showError("state")}
              aria-describedby={showError("state") ? "state-error" : undefined}
            >
              {STATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showError("state") && (
              <p id="state-error" className={errorClass} role="alert">
                Please select your state of residence.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className={labelClass}>
              ZIP Code
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <input
              id="zipCode"
              className={`${inputClass} ${zipCodeError ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              onBlur={handleZipCodeBlur}
              placeholder="e.g. 90210 or 90210-1234"
              maxLength={10}
              aria-describedby={zipCodeError ? "zipCode-error" : "zipCode-hint"}
              aria-invalid={!!zipCodeError}
            />
            <p id="zipCode-hint" className={helperClass}>5-digit ZIP code or ZIP+4 format.</p>
            {zipCodeError && <p id="zipCode-error" className={errorClass} role="alert">{zipCodeError}</p>}
          </div>

          <div>
            <label htmlFor="residencyDuration" className={labelClass}>
              State Residency Duration
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="residencyDuration"
              className={selectClass}
              value={residencyDuration}
              onChange={(e) => setResidencyDuration(e.target.value)}
              aria-describedby="residency-hint"
            >
              {RESIDENCY_DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="residency-hint" className={helperClass}>How long have you lived in your current state?</p>
          </div>
        </div>
      </section>

      {/* Activities and Interests */}
      <section className={sectionClass} aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="mb-5 text-xl font-bold text-slate-900">
          Activities and Interests
        </h2>

        <div className="space-y-6">
          <div>
            {renderCheckboxGroup({
              options: HOBBY_OPTIONS,
              selected: hobbies,
              onToggle: (v) => toggleSelection(setHobbies, v),
              onAddOther: () => handleOtherInputBlur(otherHobby, setOtherHobby, hobbies, setHobbies),
              otherPlaceholder: "Add another hobby not listed...",
              groupLabel: "Hobbies (Optional)",
              ariaLabel: "Hobbies",
              selectionSetter: setHobbies,
              otherState: otherHobby,
              otherSetter: setOtherHobby,
            })}
          </div>

          <div>
            {renderCheckboxGroup({
              options: EXTRACURRICULAR_OPTIONS,
              selected: extracurriculars,
              onToggle: (v) => toggleSelection(setExtracurriculars, v),
              onAddOther: () => handleOtherInputBlur(otherExtracurricular, setOtherExtracurricular, extracurriculars, setExtracurriculars),
              otherPlaceholder: "Add another activity not listed...",
              groupLabel: "Extracurricular Activities (Optional)",
              ariaLabel: "Extracurricular activities",
              selectionSetter: setExtracurriculars,
              otherState: otherExtracurricular,
              otherSetter: setOtherExtracurricular,
            })}
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_OPTIONS,
              selected: volunteerExperience,
              onChange: setVolunteerExperience,
              name: "volunteerExperience",
              groupLabel: "Volunteer Experience (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            {renderRadioGroup({
              options: YES_NO_OPTIONS,
              selected: leadershipExperience,
              onChange: setLeadershipExperience,
              name: "leadershipExperience",
              groupLabel: "Leadership Experience (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            {renderCheckboxGroup({
              options: CAREER_INTEREST_OPTIONS,
              selected: careerInterests,
              onToggle: (v) => toggleSelection(setCareerInterests, v),
              onAddOther: () => handleOtherInputBlur(otherCareerInterest, setOtherCareerInterest, careerInterests, setCareerInterests),
              otherPlaceholder: "Add another career interest not listed...",
              groupLabel: "Career Interests (Optional)",
              ariaLabel: "Career interests",
              selectionSetter: setCareerInterests,
              otherState: otherCareerInterest,
              otherSetter: setOtherCareerInterest,
            })}
          </div>
        </div>
      </section>

      {/* Additional Background */}
      <section className={sectionClass} aria-labelledby="background-heading">
        <h2 id="background-heading" className="mb-5 text-xl font-bold text-slate-900">
          Additional Background
        </h2>
        <p className="mb-5 text-sm text-slate-600">
          These optional questions help match you with specialized scholarships. Select &ldquo;Prefer not to say&rdquo; if you&apos;d rather not disclose.
        </p>

        <div className="space-y-5">
          <div>
            {renderRadioGroup({
              options: FOSTER_CARE_OPTIONS,
              selected: fosterCareBackground,
              onChange: setFosterCareBackground,
              name: "fosterCareBackground",
              groupLabel: "Foster Care Background (Optional)",
              touchedField: "",
            })}
          </div>

          <div>
            <label htmlFor="religiousAffiliation" className={labelClass}>
              Religious Affiliation
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="religiousAffiliation"
              className={selectClass}
              value={religiousAffiliation}
              onChange={(e) => setReligiousAffiliation(e.target.value)}
              aria-describedby="religious-hint"
            >
              {RELIGIOUS_AFFILIATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="religious-hint" className={helperClass}>Used for faith-based scholarship matching.</p>
          </div>

          <div>
            <label htmlFor="employmentStatus" className={labelClass}>
              Employment Status
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <select
              id="employmentStatus"
              className={selectClass}
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
              aria-describedby="employment-hint"
            >
              {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="employment-hint" className={helperClass}>Current employment situation.</p>
          </div>

          <div>
            <label htmlFor="academicAchievements" className={labelClass}>
              Specific Academic Achievements
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <textarea
              id="academicAchievements"
              className={inputClass}
              rows={3}
              value={academicAchievements}
              onChange={(e) => setAcademicAchievements(e.target.value)}
              placeholder="e.g. Dean&apos;s List, National Honor Society, AP Scholar, research publications, competition awards"
              aria-describedby="achievements-hint"
            />
            <p id="achievements-hint" className={helperClass}>
              List notable academic honors, awards, or publications.
            </p>
          </div>

          <div>
            <label htmlFor="organizationMemberships" className={labelClass}>
              Membership in Particular Organizations
              <span className="text-xs text-slate-400 ml-1">(Optional)</span>
            </label>
            <textarea
              id="organizationMemberships"
              className={inputClass}
              rows={3}
              value={organizationMemberships}
              onChange={(e) => setOrganizationMemberships(e.target.value)}
              placeholder="e.g. IEEE, AMA, NSHSS, professional associations, honor societies"
              aria-describedby="memberships-hint"
            />
            <p id="memberships-hint" className={helperClass}>
              List any professional, academic, or civic organizations you belong to.
            </p>
          </div>
        </div>
      </section>

      {/* Citizenship */}
      <section className={sectionClass} aria-labelledby="citizenship-heading">
        <h2 id="citizenship-heading" className="mb-5 text-xl font-bold text-slate-900">
          Citizenship
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="citizenship" className={requiredLabelClass}>
              Citizenship Status
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="text-xs text-slate-400">(Required)</span>
            </label>
            <select
              id="citizenship"
              className={selectClass}
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
              onBlur={() => markTouched("citizenship")}
              required
              aria-required="true"
              aria-invalid={showError("citizenship")}
              aria-describedby={showError("citizenship") ? "citizenship-error" : undefined}
            >
              {CITIZENSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showError("citizenship") && (
              <p id="citizenship-error" className={errorClass} role="alert">
                Please select your citizenship status.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className={sectionClass} aria-labelledby="additional-heading">
        <h2 id="additional-heading" className="mb-5 text-xl font-bold text-slate-900">
          Additional Information
        </h2>

        <div>
          <label htmlFor="additionalInformation" className={labelClass}>
            Additional Information
            <span className="text-xs text-slate-400 ml-1">(Optional)</span>
          </label>
          <textarea
            id="additionalInformation"
            className={inputClass}
            rows={4}
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
            placeholder="Tell us about your interests, achievements, experiences, or anything else you'd like scholarship providers to know."
            aria-describedby="additionalInfo-hint"
          />
          <p id="additionalInfo-hint" className={helperClass}>
            This helps scholarship providers understand your unique background and goals.
          </p>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`
          w-full rounded-lg px-6 py-3.5 font-semibold text-white shadow-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isFormValid
            ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }
        `}
        aria-disabled={!isFormValid}
      >
        {isFormValid ? "Submit Profile" : "Complete required fields to submit"}
      </button>

      {!isFormValid && (
        <p className="text-center text-sm text-slate-500" role="status" aria-live="polite">
          Please fill in all required fields (marked with <span className="text-red-500" aria-hidden="true">*</span>) to enable submission.
        </p>
      )}
    </form>
  );
}