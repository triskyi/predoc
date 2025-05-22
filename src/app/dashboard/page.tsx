"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, FileText, Stethoscope, ClipboardCheck, Settings } from "lucide-react";

// Dummy data for demonstration
const demoPatients = [
  { id: 1, name: "John Doe", age: 35, gender: "male", region: "Kampala" },
  { id: 2, name: "Jane Smith", age: 28, gender: "female", region: "Entebbe" },
];

const demoRecords = [
  { id: 1, patientId: 1, symptoms: ["Fever", "Headache"], date: "2025-05-21", prediction: { disease: "Malaria", confidence: 0.92 }, treatment: "Artemisinin-based therapy" },
  { id: 2, patientId: 2, symptoms: ["Rash", "Weakness"], date: "2025-05-20", prediction: { disease: "Dengue", confidence: 0.88 }, treatment: "Supportive care" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<"patients" | "records" | "profile">("patients");
  const [patients, setPatients] = useState(demoPatients);
  const [records, setRecords] = useState(demoRecords);
  const [search, setSearch] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);

  // Add patient form state
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "", region: "" });

  // Add new patient handler
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setPatients([
      ...patients,
      {
        id: patients.length + 1,
        name: newPatient.name,
        age: Number(newPatient.age),
        gender: newPatient.gender,
        region: newPatient.region,
      },
    ]);
    setNewPatient({ name: "", age: "", gender: "", region: "" });
    setShowAddPatient(false);
  };

  // Filtered patients
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Stethoscope className="text-blue-600" /> Dashboard
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setTab("patients")} className={tab === "patients" ? "bg-blue-600 text-white" : ""}>
            <Users className="mr-2" size={18} /> Patients
          </Button>
          <Button onClick={() => setTab("records")} className={tab === "records" ? "bg-blue-600 text-white" : ""}>
            <FileText className="mr-2" size={18} /> Medical Records
          </Button>
          <Button onClick={() => setTab("profile")} className={tab === "profile" ? "bg-blue-600 text-white" : ""}>
            <Settings className="mr-2" size={18} /> Profile
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4">
        {/* Patients Tab */}
        {tab === "patients" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users /> Manage Patients
              </h2>
              <Button onClick={() => setShowAddPatient(true)}>
                <UserPlus className="mr-2" size={18} /> Add Patient
              </Button>
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-4 px-4 py-2 border rounded w-full max-w-xs dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2">Name</th>
                    <th className="p-2">Age</th>
                    <th className="p-2">Gender</th>
                    <th className="p-2">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="border-b dark:border-gray-700">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.age}</td>
                      <td className="p-2 capitalize">{p.gender}</td>
                      <td className="p-2">{p.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Add Patient Modal */}
            {showAddPatient && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <form
                  onSubmit={handleAddPatient}
                  className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
                >
                  <h3 className="text-lg font-bold mb-4">Add New Patient</h3>
                  <div className="mb-3">
                    <label className="block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      value={newPatient.name}
                      onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Age</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      value={newPatient.age}
                      onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Gender</label>
                    <select
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      value={newPatient.gender}
                      onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Region</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      value={newPatient.region}
                      onChange={e => setNewPatient({ ...newPatient, region: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={() => setShowAddPatient(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 text-white">Add</Button>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {/* Medical Records Tab */}
        {tab === "records" && (
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <ClipboardCheck /> Medical Records & Predictions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2">Patient</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Symptoms</th>
                    <th className="p-2">Prediction</th>
                    <th className="p-2">Confidence</th>
                    <th className="p-2">Treatment</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const patient = patients.find((p) => p.id === r.patientId);
                    return (
                      <tr key={r.id} className="border-b dark:border-gray-700">
                        <td className="p-2">{patient?.name}</td>
                        <td className="p-2">{r.date}</td>
                        <td className="p-2">{r.symptoms.join(", ")}</td>
                        <td className="p-2">{r.prediction.disease}</td>
                        <td className="p-2">{Math.round(r.prediction.confidence * 100)}%</td>
                        <td className="p-2">{r.treatment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Settings /> Edit Profile
            </h2>
            {/* Replace with real user data and update logic */}
            <form className="max-w-md space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value="Dr. Example User"
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value="doctor@example.com"
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value="********"
                  readOnly
                />
              </div>
              <Button type="button" className="bg-blue-600 text-white" disabled>
                Update Profile
              </Button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}