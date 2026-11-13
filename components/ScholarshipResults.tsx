"use client";

import { useState, useCallback } from "react";
import { Scholarship, ScholarshipSearchResponse } from "@/types/scholarship";
import { StudentProfile } from "@/types/profile";
import ProfileForm from "./ProfileForm";
import ScholarshipCard from "./ScholarshipCard";

interface ScholarshipResultsProps {
  initialProfile: StudentProfile;
}

export default function ScholarshipResults({ initialProfile }: ScholarshipResultsProps) {
  const [stage, setStage] = useState<"loading" | "results" | "error" | "empty">("loading");
  const [response, setResponse] = useState<ScholarshipSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [showForm, setShowForm] = useState(false);

  const fetchScholarships = useCallback(async (profileToSearch: StudentProfile) => {
    setStage("loading");
    setError(null);
    
    try {
      const res = await fetch("/api/scholarships/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileToSearch),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      
      if (data.scholarships.length === 0) {
        setStage("empty");
      } else {
        setStage("results");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStage("error");
    }
  }, []);

  // Initial fetch
  const [fetched, setFetched] = useState(false);
  if (!fetched) {
    setFetched(true);
    fetchScholarships(profile);
  }

  const handleSearchAgain = () => {
    fetchScholarships(profile);
  };

  const handleEditProfile = () => {
    setShowForm(true);
  };

  const handleProfileSubmit = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setShowForm(false);
    fetchScholarships(newProfile);
  };

  if (showForm) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900">ScholarBuddy</h1>
            <p className="mt-3 text-slate-600">
              Find scholarships that match your academic profile, interests, and background.
            </p>
          </header>
          <ProfileForm onSubmit={handleProfileSubmit} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">ScholarBuddy</h1>
          <p className="mt-3 text-slate-600">
            Find scholarships that match your academic profile, interests, and background.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Scholarship Matches</h2>
            {response && (
              <p className="mt-1 text-sm text-slate-600">
                Found <span className="font-medium text-slate-900">{response.scholarships.length}</span> scholarship{response.scholarships.length !== 1 ? "s" : ""} based on your profile.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
            <button
              onClick={handleSearchAgain}
              disabled={stage === "loading"}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5.001a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61 1.276z" />
              </svg>
              Search Again
            </button>
          </div>
        </div>

        {stage === "loading" && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" aria-hidden="true" />
            <h3 className="text-lg font-medium text-slate-900">Searching for scholarships...</h3>
            <p className="mt-2 text-slate-600">This may take a minute while we search the web and extract scholarship details.</p>
            <p className="mt-1 text-sm text-slate-500">Analyzing your profile &rarr; Generating queries &rarr; Searching &rarr; Extracting details</p>
          </div>
        )}

        {stage === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Search Failed</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={handleSearchAgain}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === "empty" && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No scholarships found</h3>
            <p className="mt-2 text-slate-600">We couldn't find any scholarships matching your profile right now.</p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleSearchAgain}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Search Again
              </button>
            </div>
          </div>
        )}

        {stage === "results" && response && (
          <div className="space-y-5">
            {response.scholarships.map((scholarship, index) => (
              <ScholarshipCard key={`${scholarship.sourceUrl}-${index}`} scholarship={scholarship} index={index} />
            ))}

            {response.extractionErrors.length > 0 && (
              <details className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2a1 1 0 102 0v2a1 1 0 102 0v-2a1 1 0 10-2 0v-2z" />
                  </svg>
                  <span>{response.extractionErrors.length} page(s) could not be processed</span>
                </summary>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {response.extractionErrors.slice(0, 5).map((err, i) => (
                    <p key={i} className="truncate">• {err.url} — {err.error}</p>
                  ))}
                  {response.extractionErrors.length > 5 && (
                    <p className="text-slate-500">... and {response.extractionErrors.length - 5} more</p>
                  )}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  );
}