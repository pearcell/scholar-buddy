
"use client";

import { useState } from "react";
import { StudentProfile } from "../types/profile";

interface ProfileFormProps {
  onSubmit: (profile: StudentProfile) => void;
}

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "block text-sm font-medium text-slate-700";

const sectionClass =
  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [educationLevel, setEducationLevel] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [major, setMajor] = useState("");
  const [gpa, setGpa] = useState("");
  const [state, setState] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const profile: StudentProfile = {
      educationLevel,
      currentYear,
      major,
      gpa: gpa === "" ? null : Number(gpa),
      state,
      citizenship,
      extracurriculars: extracurriculars
        .split(",")
        .map((activity) => activity.trim())
        .filter((activity) => activity !== ""),
      additionalInformation
    };

    onSubmit(profile);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Education */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Education
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Education Level</label>
            <select
              className={inputClass}
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              required
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Trade/Vocational">Trade/Vocational</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Current Year</label>
            <select
              className={inputClass}
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              required
            >
              <option value="">Select current year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate Student">Graduate Student</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Major or Intended Major</label>
            <input
              className={inputClass}
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
              required
            />
          </div>
        </div>
      </section>

      {/* Academics */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Academics
        </h2>

        <div>
          <label className={labelClass}>Unweighted GPA (0.00 - 4.00)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="e.g. 3.75"
          />
        </div>
      </section>

      {/* Location and Citizenship */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Location and Citizenship
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>State of Residence</label>
            <input
              className={inputClass}
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Pennsylvania"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Citizenship Status</label>
            <select
              className={inputClass}
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
              required
            >
              <option value="">Select citizenship status</option>
              <option value="US Citizen">US Citizen</option>
              <option value="Permanent Resident">Permanent Resident</option>
              <option value="International Student">International Student</option>
              <option value="Other/Unsure">Other/Unsure</option>
            </select>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Activities and Interests
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>
              Extracurricular Activities
            </label>
            <textarea
              className={inputClass}
              rows={3}
              value={extracurriculars}
              onChange={(e) => setExtracurriculars(e.target.value)}
              placeholder="e.g. Robotics, Research, Volunteering"
            />
            <p className="mt-1 text-xs text-slate-500">
              Separate activities with commas.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Additional Information
            </label>
            <textarea
              className={inputClass}
              rows={4}
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
              placeholder="Tell us about your interests, achievements, and experiences."
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Profile
      </button>

    </form>
  );
}
