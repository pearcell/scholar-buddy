
"use client";

import { useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { StudentProfile } from "../types/profile";

export default function Home() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            ScholarBuddy
          </h1>

          <p className="mt-3 text-slate-600">
            Find scholarships that match your academic profile,
            interests, and background.
          </p>
        </header>

        <ProfileForm onSubmit={setProfile} />

        {profile && (
          <section className="mt-8 rounded-xl border border-green-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-green-700">
              Profile Submitted!
            </h2>

            <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </section>
        )}

      </div>
    </main>
  );
}
