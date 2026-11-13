"use client";

import { Scholarship } from "@/types/scholarship";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  index: number;
}

function formatAwardAmount(award: NonNullable<Scholarship["awardAmount"]>): string {
  const { min, max, currency = "USD" } = award;
  const currencySymbol = currency === "USD" ? "$" : currency;
  
  if (min !== null && max !== null && min !== max) {
    return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
  }
  if (min !== null) {
    return `${currencySymbol}${min.toLocaleString()}`;
  }
  if (max !== null) {
    return `Up to ${currencySymbol}${max.toLocaleString()}`;
  }
  return "Amount not specified";
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Deadline not specified";
  try {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return deadline;
  }
}

function renderField(label: string, value: string | string[] | number | null | undefined): React.ReactNode {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value) && value.length === 0) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  
  const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-full sm:w-28">{label}</span>
      <span className="text-sm text-slate-800">{displayValue}</span>
    </div>
  );
}

export default function ScholarshipCard({ scholarship, index }: ScholarshipCardProps) {
  const { name, organization, description, awardAmount, deadline, applicationUrl, sourceUrl, minGPA, academicLevels, eligibleMajors, residency, citizenship, otherRequirements, extractionStatus, missingInformation } = scholarship;

  return (
    <article className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-600">{organization}</p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
          {extractionStatus}
        </span>
      </div>

      <p className="mb-4 text-sm text-slate-700 line-clamp-3">{description || "No description available."}</p>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {awardAmount && (
          <div className="rounded-xl bg-green-50 p-3 border border-green-100">
            <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Award Amount</span>
            <p className="mt-1 text-lg font-bold text-green-900">{formatAwardAmount(awardAmount)}</p>
          </div>
        )}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Deadline</span>
          <p className="mt-1 text-sm font-medium text-slate-800">{formatDeadline(deadline)}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {minGPA !== null && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Min GPA: {minGPA.toFixed(2)}
          </span>
        )}
      </div>

      <div className="mb-4 space-y-2 text-sm">
        {renderField("Academic Levels", academicLevels)}
        {renderField("Eligible Majors", eligibleMajors)}
        {renderField("Residency", residency)}
        {renderField("Citizenship", citizenship)}
      </div>

      {otherRequirements.length > 0 && (
        <details className="mb-4 group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-slate-800">
            <span className="font-medium">Other Requirements</span>
            <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </summary>
          <div className="mt-2 ml-6 space-y-1 border-l-2 border-slate-200 pl-3">
            {otherRequirements.map((req, i) => (
              <p key={i} className="text-slate-700">• {req}</p>
            ))}
          </div>
        </details>
      )}

      {missingInformation.length > 0 && (
        <details className="mb-4 group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-500 hover:text-slate-700">
            <span className="font-medium">Missing Information</span>
            <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </summary>
          <div className="mt-2 ml-6 space-y-1 border-l-2 border-slate-200 pl-3">
            {missingInformation.map((info, i) => (
              <p key={i} className="text-slate-600">• {info}</p>
            ))}
          </div>
        </details>
      )}

      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
        {applicationUrl && (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              <path d="M11 3a1 1 0 011 1v3.293l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414L9 5.414V4a1 1 0 011-1z" />
            </svg>
            Apply
          </a>
        )}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          View Source
        </a>
      </div>
    </article>
  );
}