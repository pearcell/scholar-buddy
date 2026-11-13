"use client";

import { useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import ScholarshipResults from "@/components/ScholarshipResults";
import { StudentProfile } from "@/types/profile";

export default function Home() {
  const [submittedProfile, setSubmittedProfile] = useState<StudentProfile | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {!submittedProfile ? (
          <ProfileForm onSubmit={(profile) => setSubmittedProfile(profile)} />
        ) : (
          <ScholarshipResults initialProfile={submittedProfile} />
        )}
      </div>
    </main>
  );
}