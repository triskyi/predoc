"use client";
import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Card, Skeleton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const SYMPTOMS = [
  "fever",
  "chills",
  "sweats",
  "headache",
  "nausea",
  "vomiting",
  "body_aches",
  "impaired_consciousness",
  "prostration",
  "convulsions",
  "deep_breathing",
  "respiratory_distress",
  "abnormal_bleeding",
  "jaundice",
  "severe_anemia",
  "rash",
  "abdominal_pain",
  "weakness",
  "diarrhea",
  "severe_dehydration",
  "constipation",
  "delirium",
];

const REGIONS = [
  "Central America west of Panama",
  "Haiti",
  "Dominican Republic",
  "Sub-Saharan Africa",
  "Papua New Guinea",
  "Southeast Asia",
];

export default function AIPlaygroundPage() {
  const [form, setForm] = useState({
    Age: "",
    Weight: "",
    Region: "",
    Gender: "",
    Pregnant: false,
    First_Trimester_Pregnant: false,
    G6PD_Deficiency: false,
    Previous_Medications: "",
    symptoms: SYMPTOMS.reduce(
      (acc, s) => ({ ...acc, [s]: false }),
      {} as Record<string, boolean>
    ),
  });
  const [loading, setLoading] = useState(false);
  interface PredictionResult {
    prediction?: {
      disease?: string;
      treatment?: {
        drug?: string;
        dosage?: Record<string, string>;
        alternative?: string;
        instructions?: string;
        warnings?: string[];
        supportive?: {
          drug?: string;
          note?: string;
          dosage?: Record<string, string>;
          instructions?: string;
        };
      };
      counseling?: {
        disease_explanation?: string;
        treatment_instructions?: string[];
        prevention?: string[];
      };
    };
    error?: string;
  }

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    if (SYMPTOMS.includes(name)) {
      setForm((prev) => ({
        ...prev,
        symptoms: { ...prev.symptoms, [name]: checked },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Gender/Pregnancy logic
  React.useEffect(() => {
    if (form.Gender !== "Female") {
      setForm((prev) => ({
        ...prev,
        Pregnant: false,
        First_Trimester_Pregnant: false,
      }));
    }
    if (!form.Pregnant) {
      setForm((prev) => ({
        ...prev,
        First_Trimester_Pregnant: false,
      }));
    }
  }, [form.Gender, form.Pregnant]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation
    if (!Object.values(form.symptoms).some(Boolean)) {
      setError("At least one symptom must be selected.");
      return;
    }
    if (!form.Age || +form.Age < 1 || +form.Age > 120) {
      setError("Age must be between 1 and 120.");
      return;
    }
    if (!form.Weight || +form.Weight < 1 || +form.Weight > 200) {
      setError("Weight must be between 1 and 200 kg.");
      return;
    }
    if (!form.Region) {
      setError("Please select a region.");
      return;
    }
    if (!form.Gender) {
      setError("Please select a gender.");
      return;
    }
    if (form.Pregnant && form.Gender !== "Female") {
      setError("Pregnant can only be selected for Female gender.");
      return;
    }
    if (form.First_Trimester_Pregnant && !form.Pregnant) {
      setError("First Trimester Pregnant requires Pregnant to be Yes.");
      return;
    }

    // Build data object
    const data: Record<string, string | number> = {};
    SYMPTOMS.forEach((s) => (data[s] = form.symptoms[s] ? 1 : 0));
    data.Age = +form.Age;
    data.Weight = +form.Weight;
    data.Region = form.Region;
    data.Gender = form.Gender;
    data.Pregnant = form.Pregnant ? 1 : 0;
    data.First_Trimester_Pregnant = form.First_Trimester_Pregnant ? 1 : 0;
    data.G6PD_Deficiency = form.G6PD_Deficiency ? 1 : 0;
    data.Previous_Medications = form.Previous_Medications || "None";

    setLoading(true);
    try {
      const predictRes = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const predictResult = await predictRes.json();

      if (!predictRes.ok) {
        setError(predictResult.error || "Prediction failed");
        setResult(null);
      } else {
        setResult(predictResult);
      }
    } catch {
      setError("Failed to connect to the prediction server.");
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-2">
      <Card className="w-full max-w-2xl p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition">
              PREDOC
            </span>
          </Link>
          <Link
            href="/predictor"
            className="px-4 py-2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" size={32} />
          AI Playground
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
          Experiment with the AI-powered disease treatment predictor. <br />
          <span className="text-xs text-gray-400">(No data is saved.)</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Symptoms</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SYMPTOMS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={s}
                    checked={form.symptoms[s]}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  {s
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="Age">
                Age (1-120)
              </label>
              <input
                type="number"
                id="Age"
                name="Age"
                min={1}
                max={120}
                required
                value={form.Age}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="Weight">
                Weight (kg, 1-200)
              </label>
              <input
                type="number"
                id="Weight"
                name="Weight"
                min={1}
                max={200}
                step={0.1}
                required
                value={form.Weight}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="Region">
                Region
              </label>
              <select
                id="Region"
                name="Region"
                required
                value={form.Region}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
              >
                <option value="">Select</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="Gender">
                Gender
              </label>
              <select
                id="Gender"
                name="Gender"
                required
                value={form.Gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="Pregnant"
                id="Pregnant"
                checked={form.Pregnant}
                onChange={handleChange}
                disabled={form.Gender !== "Female"}
                className="accent-pink-500"
              />
              <label htmlFor="Pregnant" className="font-medium">
                Pregnant (Female only)
              </label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="First_Trimester_Pregnant"
                id="First_Trimester_Pregnant"
                checked={form.First_Trimester_Pregnant}
                onChange={handleChange}
                disabled={!form.Pregnant}
                className="accent-pink-500"
              />
              <label htmlFor="First_Trimester_Pregnant" className="font-medium">
                First Trimester Pregnant
              </label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="G6PD_Deficiency"
                id="G6PD_Deficiency"
                checked={form.G6PD_Deficiency}
                onChange={handleChange}
                className="accent-yellow-500"
              />
              <label htmlFor="G6PD_Deficiency" className="font-medium">
                G6PD Deficiency
              </label>
            </div>
            <div className="col-span-2">
              <label
                className="block font-semibold mb-1"
                htmlFor="Previous_Medications"
              >
                Previous Medications
              </label>
              <input
                type="text"
                id="Previous_Medications"
                name="Previous_Medications"
                placeholder="e.g., None, Quinine, Aspirin"
                value={form.Previous_Medications}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-bold text-lg shadow-lg hover:from-pink-600 hover:to-yellow-600 transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Predict Treatment
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-center font-semibold">
            {error}
          </div>
        )}
        {loading && (
          <div className="mt-8">
            <Card className="w-full space-y-5 p-4" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-8 w-full rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="rounded-lg">
                <div className="h-32 w-full rounded-lg bg-default-200" />
              </Skeleton>
            </Card>
          </div>
        )}
        {result && !loading && (
          <div className="mt-8 p-6 rounded-xl bg-green-50 dark:bg-green-900/30 shadow">
            <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-300">
              Diagnosis: {result.prediction?.disease}
            </h3>
            <div className="mb-2">
              <span className="font-semibold">Drug:</span>{" "}
              {result.prediction?.treatment?.drug}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Dosage:</span>
              <ul className="list-disc ml-6">
                {result.prediction?.treatment?.dosage &&
                  Object.entries(result.prediction.treatment.dosage).map(
                    ([k, v]) => (
                      <li key={k}>
                        <span className="capitalize">
                          {k.replace(/_/g, " ")}:
                        </span>{" "}
                        {v as string}
                      </li>
                    )
                  )}
              </ul>
            </div>
            {result.prediction?.treatment?.alternative && (
              <div className="mb-2">
                <span className="font-semibold">Alternative:</span>{" "}
                {result.prediction.treatment.alternative}
              </div>
            )}
            {result.prediction?.treatment?.instructions && (
              <div className="mb-2">
                <span className="font-semibold">Instructions:</span>{" "}
                {result.prediction.treatment.instructions}
              </div>
            )}
            {result.prediction?.treatment?.warnings &&
              result.prediction.treatment.warnings.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-red-600">Warnings:</span>
                  <ul className="list-disc ml-6 text-red-600">
                    {result.prediction.treatment.warnings.map(
                      (w: string, i: number) => (
                        <li key={i}>{w}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {result.prediction?.treatment?.supportive && (
              <div className="mb-2">
                <span className="font-semibold">Supportive Treatment:</span>{" "}
                {result.prediction.treatment.supportive.drug ||
                  result.prediction.treatment.supportive.note}
                {result.prediction.treatment.supportive.dosage && (
                  <ul className="list-disc ml-6">
                    {Object.entries(
                      result.prediction.treatment.supportive.dosage
                    ).map(([k, v]) => (
                      <li key={k}>
                        <span className="capitalize">
                          {k.replace(/_/g, " ")}:
                        </span>{" "}
                        {v as string}
                      </li>
                    ))}
                  </ul>
                )}
                {result.prediction.treatment.supportive.instructions && (
                  <div>
                    {result.prediction.treatment.supportive.instructions}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <div className="font-semibold mb-1">Counseling</div>
              <div>
                <span className="font-semibold">Explanation:</span>{" "}
                {result.prediction?.counseling?.disease_explanation}
              </div>
              <div>
                <span className="font-semibold">Treatment Instructions:</span>
                <ul className="list-disc ml-6">
                  {result.prediction?.counseling?.treatment_instructions?.map(
                    (instr: string, i: number) => (
                      <li key={i}>{instr}</li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Prevention:</span>
                <ul className="list-disc ml-6">
                  {result.prediction?.counseling?.prevention?.map(
                    (prev: string, i: number) => (
                      <li key={i}>{prev}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="text-xs text-gray-500 mt-6 text-center">
          <strong>Disclaimer:</strong> This tool provides treatment
          recommendations for malaria, dengue, and typhoid based on clinical
          guidelines. Results are not a substitute for professional medical
          advice.
        </div>
      </Card>
    </div>
  );
}
