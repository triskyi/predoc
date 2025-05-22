"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  UserPlus,
  Users,
  FileText,
  ClipboardCheck,
  Settings,
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  Eye,
  Package,
  User,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const symptoms = [
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
const regions = [
  "Sub-Saharan Africa",
  "Dominican Republic",
  "Papua New Guinea",
  "Southeast Asia",
  "Central America west of Panama",
];

export default function PredictorPage() {
  const router = useRouter();

  // State declarations
  const [tab, setTab] = useState("dashboard");

  // Helper for symptoms list (for forms)
  const symptomsList = symptoms;

  // If you need to compute data based on recordForm, do it inside the component after recordForm is defined.
  // Example usage (not global):
  // const data = Object.fromEntries(symptomsList.map(symptom => [symptom, recordForm.symptoms.includes(symptom) ? 1 : 0]));

  type Patient = {
    id: string;
    fullName: string;
    age: number;
    gender: string;
    weight: number;
    region?: string;
    pregnantStatus?: string;
    g6pdDeficiency?: boolean;
    [key: string]: string | number | boolean | undefined;
  };
  const [patients, setPatients] = useState<Patient[]>([]);
  type RecordType = {
    id: string;
    patientId: string;
    symptoms: string[];
    previousMedications: string;
    createdAt: string;
    predictionResult?: {
      predictedDisease: string;
      [key: string]:
        | string
        | number
        | boolean
        | string[]
        | undefined
        | {
            predictedDisease?: string;
            [key: string]: unknown;
          }
        | {
            recommendedTreatment?: string;
            notes?: string;
            [key: string]: unknown;
          };
    };
    treatmentRecommendation?: {
      recommendedTreatment: string;
      notes?: string;
      [key: string]: string | number | boolean | undefined;
    };
    [key: string]:
      | string
      | number
      | boolean
      | string[]
      | undefined
      | {
          predictedDisease?: string;
          [key: string]: unknown;
        }
      | {
          recommendedTreatment?: string;
          notes?: string;
          [key: string]: unknown;
        };
  };
  const [recordForm, setRecordForm] = useState<{
    patientId?: string;
    symptoms: string[];
    previousMedications: string;
  }>({
    patientId: "",
    symptoms: [],
    previousMedications: "",
  });
  const [records, setRecords] = useState<RecordType[]>([]);
  const [search, setSearch] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState<string | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState<string | null>(
    null
  );
  const [dark, setDark] = useState(false);
  const defaultProfile = {
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    photo: "/default-profile.png",
  };
  const [profile, setProfile] = useState(defaultProfile);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const [newPatient, setNewPatient] = useState({
    fullName: "",
    age: "",
    gender: "",
    weight: "",
    region: "",
    pregnantStatus: "",
    g6pdDeficiency: false,
  });

  async function fetchUserProfile(userId: number | string) {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const profile = await res.json();
      setProfile(profile); // assuming you have setProfile in your state
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
  useEffect(() => {
    // Replace with the actual user ID (from auth/session)
    const userId = 1; // or get from your auth context/session
    fetchUserProfile(userId);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [patientsRes, recordsRes, analyticsRes] = await Promise.all([
          fetch("/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/records", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!patientsRes.ok || !recordsRes.ok || !analyticsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const patientsData = await patientsRes.json();
        const recordsData = await recordsRes.json();
        const analyticsData = await analyticsRes.json();

        setPatients(patientsData);
        setRecords(recordsData);
        setAnalytics(analyticsData);
        setProfile((prev) => ({ ...prev, ...analyticsData.user }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingPatients(false);
        setLoadingRecords(false);
      }
    };

    fetchData();
  }, [router]);

  // Theme handling
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const newDark = !prev;
      document.documentElement.classList.toggle("dark", newDark);
      localStorage.setItem("theme", newDark ? "dark" : "light");
      return newDark;
    });
  };
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);
  // API handlers
  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: newPatient.fullName,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          weight: Number(newPatient.weight),
          region: newPatient.region,
          pregnantStatus:
            newPatient.gender === "female" ? newPatient.pregnantStatus : null,
          g6pdDeficiency: newPatient.g6pdDeficiency,
        }),
      });

      if (res.ok) {
        const newPatientData = await res.json();
        setPatients((prev) => [...prev, newPatientData]);
        setNewPatient({
          fullName: "",
          age: "",
          gender: "",
          weight: "",
          region: "",
          pregnantStatus: "",
          g6pdDeficiency: false,
        });
        setShowAddPatient(false);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.region?.toLowerCase().includes(search.toLowerCase())
  );

  // Profile handlers
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({ ...profile, photo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ...inside your PredictorPage component...

  const handleAddRecord = async (e: React.FormEvent, patientId: string) => {
    e.preventDefault();
    try {
      // 1. Get patient info from your API
      const patientRes = await fetch(`/api/patients/${patientId}`);
      if (!patientRes.ok) throw new Error("Failed to fetch patient info");
      const patient = await patientRes.json();

      // 2. Prepare data for Flask /predict
      const data = {
        ...recordForm.symptoms.reduce((acc, s) => ({ ...acc, [s]: 1 }), {}),
        Age: patient.age,
        Weight: patient.weight,
        Region: patient.region,
        Gender: patient.gender === "male" ? "Male" : "Female",
        Pregnant:
          patient.pregnantStatus === "first_trimester" ||
          patient.pregnantStatus === "second" ||
          patient.pregnantStatus === "third"
            ? 1
            : 0,
        First_Trimester_Pregnant:
          patient.pregnantStatus === "first_trimester" ? 1 : 0,
        G6PD_Deficiency: patient.g6pdDeficiency ? 1 : 0,
        Previous_Medications: recordForm.previousMedications || "None",
      };

      // 3. Call Flask /predict
      const predictRes = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const predictResult = await predictRes.json();

      if (!predictRes.ok) {
        alert(predictResult.error || "Prediction failed");
        return;
      }
      const treatment = predictResult.prediction.treatment;
      const { drug, ...rest } = treatment;
      const notes = JSON.stringify(rest, null, 2); // pretty JSON

      // 4. Save record to your DB via /api/records
      const saveRes = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: Number(patientId),
          symptoms: recordForm.symptoms,
          previousMedications: recordForm.previousMedications,
          predictedDisease: predictResult.prediction.disease,
          recommendedTreatment: drug,
          notes, // <-- all other fields as a string
        }),
      });

      if (!saveRes.ok) {
        alert("Failed to save record");
        return;
      }

      // 5. Optionally refresh records list
      setShowAddRecord(null);
      setRecordForm({ patientId: "", symptoms: [], previousMedications: "" });
      // Optionally: refetch records here

      alert("Medical record added and prediction saved!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Error adding record");
      } else {
        alert("Error adding record");
      }
    }
  };

  function downloadCSV(records: RecordType[], patients: Patient[]) {
    const headers = [
      "Patient",
      "Date",
      "Symptoms",
      "Disease",
      "Treatment",
      "Notes",
    ];
    const rows = records.map((r) => [
      patients.find((p) => p.id === r.patientId)?.fullName || "",
      new Date(r.createdAt).toLocaleDateString(),
      r.symptoms.join(", "),
      r.predictionResult?.predictedDisease || "Pending",
      (typeof r.predictionResult?.treatmentRecommendation === "object" &&
      r.predictionResult?.treatmentRecommendation !== null
        ? (
            r.predictionResult.treatmentRecommendation as {
              recommendedTreatment?: string;
            }
          ).recommendedTreatment
        : undefined) || "Pending",
      (typeof r.predictionResult?.treatmentRecommendation === "object" &&
      r.predictionResult?.treatmentRecommendation !== null &&
      "notes" in r.predictionResult.treatmentRecommendation
        ? (r.predictionResult.treatmentRecommendation as { notes?: string })
            .notes
        : "") || "",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medical_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Recursively render notes as nested lists or plain text
  function renderNotes(obj: unknown): React.ReactNode {
    if (typeof obj === "object" && obj !== null) {
      return (
        <ul className="list-disc ml-6">
          {Object.entries(obj as Record<string, unknown>).map(
            ([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {typeof value === "object" && value !== null
                  ? renderNotes(value)
                  : String(value)}
              </li>
            )
          )}
        </ul>
      );
    }
    return String(obj);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 flex flex-col py-6 px-4 min-h-screen fixed top-0 left-0 h-screen z-30">
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <span className="font-bold text-xl text-gray-800 dark:text-gray-100">
            PREDOC
          </span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {["dashboard", "patients", "records", "profile"].map((t) => (
              <li key={t}>
                <button
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition ${
                    tab === t
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t === "dashboard" && <Eye className="mr-2" size={18} />}
                  {t === "patients" && <Users className="mr-2" size={18} />}
                  {t === "records" && <FileText className="mr-2" size={18} />}
                  {t === "profile" && <Settings className="mr-2" size={18} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2 w-full px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <User className="text-blue-600" />
            <span className="text-gray-700 dark:text-gray-200 text-sm">
              {profile.name}
            </span>
          </div>
          <Button
            className="w-full mt-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 fixed top-0 left-64 right-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                className="absolute left-2 top-2.5 text-gray-400"
                size={16}
              />
            </div>
            <Button
              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2"
              onClick={toggleTheme}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2">
              <Bell size={18} />
            </Button>
            <button
              className="rounded-full border-2 border-blue-400 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setTab("profile")}
            >
              <Image
                src={profile.photo}
                alt="User"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 mt-24 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Tab */}
            {tab === "dashboard" && (
              <section>
                {analytics ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                        <Users className="text-blue-500 mb-2" size={28} />
                        <div className="text-2xl font-bold">
                          {patients.length}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Total Patients
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                        <FileText className="text-purple-500 mb-2" size={28} />
                        <div className="text-2xl font-bold">
                          {records.length}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Medical Records
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                        <ClipboardCheck
                          className="text-green-500 mb-2"
                          size={28}
                        />
                        <div className="text-2xl font-bold">
                          {records.filter((r) => r.predictionResult).length}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Predictions Made
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                        <Package className="text-orange-500 mb-2" size={28} />
                        <div className="text-2xl font-bold">
                          {
                            records.filter((r) => r.treatmentRecommendation)
                              .length
                          }
                        </div>
                        <div className="text-gray-500 text-sm">Treatments</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Disease Distribution */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">
                          Disease Distribution
                        </h3>
                        {/* Simple pie chart would go here */}
                        <div className="text-center">Pie chart placeholder</div>
                      </div>
                      {/* Records Over Time */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">
                          Records Over Time
                        </h3>
                        {/* Line chart would go here */}
                        <div className="text-center">
                          Line chart placeholder
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Loading analytics...</p>
                )}
              </section>
            )}

            {/* Patients Tab */}
            {tab === "patients" && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users /> Manage Patients
                  </h2>
                  <Button
                    onClick={() => setShowAddPatient(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <UserPlus className="mr-2" size={18} /> Add Patient
                  </Button>
                </div>
                {loadingPatients ? (
                  <p>Loading patients...</p>
                ) : (
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="p-2">Name</th>
                          <th className="p-2">Age</th>
                          <th className="p-2">Gender</th>
                          <th className="p-2">Region</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="p-2">{p.fullName}</td>
                            <td className="p-2">{p.age}</td>
                            <td className="p-2 capitalize">{p.gender}</td>
                            <td className="p-2">{p.region || "N/A"}</td>
                            <td className="p-2 flex gap-2">
                              <Button
                                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                onClick={() => setShowAddRecord(p.id)}
                              >
                                + Record
                              </Button>
                              <Button
                                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                onClick={() => setShowPatientDetails(p.id)}
                              >
                                <Info size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Patient Modal */}
                {showAddPatient && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                      <h3 className="text-lg font-bold mb-4">
                        Add New Patient
                      </h3>
                      <form onSubmit={handleAddPatient} className="space-y-4">
                        <div>
                          <label className="block mb-1">Full Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.fullName}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                fullName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Age</label>
                          <input
                            type="number"
                            min={1}
                            max={120}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.age}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                age: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Gender</label>
                          <select
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.gender}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                gender: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        {newPatient.gender === "female" && (
                          <div>
                            <label className="block mb-1">
                              Pregnant Status
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                              value={newPatient.pregnantStatus}
                              onChange={(e) =>
                                setNewPatient({
                                  ...newPatient,
                                  pregnantStatus: e.target.value,
                                })
                              }
                            >
                              <option value="">Select</option>
                              <option value="not_pregnant">Not Pregnant</option>
                              <option value="first_trimester">
                                First Trimester
                              </option>
                              <option value="second">Second Trimester</option>
                              <option value="third">Third Trimester</option>
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="block mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            min={1}
                            max={200}
                            step={0.1}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.weight}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                weight: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Region</label>
                          <select
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.region}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                region: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select Region</option>
                            {regions.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="g6pd"
                            checked={newPatient.g6pdDeficiency}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                g6pdDeficiency: e.target.checked,
                              })
                            }
                            className="accent-blue-600"
                          />
                          <label htmlFor="g6pd">G6PD Deficiency</label>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400"
                            onClick={() => setShowAddPatient(false)}
                            type="button"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            type="submit"
                          >
                            Add Patient
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Add Record Modal */}
                {showAddRecord && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                      <h3 className="text-lg font-bold mb-4">
                        Add Medical Record
                      </h3>
                      {patients.find((p) => p.id === showAddRecord) && (
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                          <h4 className="font-semibold mb-2">
                            Patient Information
                          </h4>
                          <p>
                            <strong>Name:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.fullName
                            }
                          </p>
                          <p>
                            <strong>Age:</strong>{" "}
                            {patients.find((p) => p.id === showAddRecord)?.age}
                          </p>
                          <p>
                            <strong>Gender:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.gender
                            }
                          </p>
                          <p>
                            <strong>Weight:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.weight
                            }{" "}
                            kg
                          </p>
                          <p>
                            <strong>Region:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.region
                            }
                          </p>
                          {patients.find((p) => p.id === showAddRecord)
                            ?.gender === "female" && (
                            <p>
                              <strong>Pregnant:</strong>{" "}
                              {patients.find((p) => p.id === showAddRecord)
                                ?.pregnantStatus || "N/A"}
                            </p>
                          )}
                          <p>
                            <strong>G6PD:</strong>{" "}
                            {patients.find((p) => p.id === showAddRecord)
                              ?.g6pdDeficiency
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      )}
                      <form
                        onSubmit={(e) => handleAddRecord(e, showAddRecord)}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block mb-1 font-medium">
                            Symptoms
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                            {symptomsList.map((s) => (
                              <label
                                key={s}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={recordForm.symptoms.includes(s)}
                                  onChange={(e) =>
                                    setRecordForm((f) => ({
                                      ...f,
                                      symptoms: e.target.checked
                                        ? [...f.symptoms, s]
                                        : f.symptoms.filter((sym) => sym !== s),
                                    }))
                                  }
                                />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1">
                            Previous Medications
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={recordForm.previousMedications}
                            onChange={(e) =>
                              setRecordForm({
                                ...recordForm,
                                previousMedications: e.target.value,
                              })
                            }
                            placeholder="e.g., None, Quinine"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400"
                            onClick={() => setShowAddRecord(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Add Record
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Patient Details Modal */}
                {showPatientDetails && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                      <h3 className="text-lg font-bold mb-4">
                        Patient Details
                      </h3>
                      {(() => {
                        const patient = patients.find(
                          (p) => p.id === showPatientDetails
                        );
                        if (!patient) {
                          return (
                            <>
                              <p>Patient not found.</p>
                              <div className="flex justify-end mt-4">
                                <Button
                                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400"
                                  onClick={() => setShowPatientDetails(null)}
                                >
                                  Close
                                </Button>
                              </div>
                            </>
                          );
                        }
                        const patientRecords = records.filter(
                          (r) => r.patientId === patient.id
                        );
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <p>
                                  <strong>Name:</strong> {patient.fullName}
                                </p>
                                <p>
                                  <strong>Age:</strong> {patient.age}
                                </p>
                                <p>
                                  <strong>Gender:</strong> {patient.gender}
                                </p>
                                <p>
                                  <strong>Weight:</strong> {patient.weight} kg
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Region:</strong> {patient.region}
                                </p>
                                <p>
                                  <strong>Pregnant:</strong>{" "}
                                  {patient.pregnantStatus || "N/A"}
                                </p>
                                <p>
                                  <strong>G6PD:</strong>{" "}
                                  {patient.g6pdDeficiency ? "Yes" : "No"}
                                </p>
                                <p>
                                  <strong>Records:</strong>{" "}
                                  {patientRecords.length}
                                </p>
                              </div>
                            </div>
                            <h4 className="font-semibold mb-2">
                              Medical History
                            </h4>
                            {patientRecords.length > 0 ? (
                              <div className="max-h-60 overflow-y-auto">
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                      <th className="p-2">Date</th>
                                      <th className="p-2">Disease</th>
                                      <th className="p-2">Treatment</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {patientRecords.map((r) => (
                                      <tr
                                        key={r.id}
                                        className="border-b dark:border-gray-700"
                                      >
                                        <td className="p-2">
                                          {new Date(
                                            r.createdAt
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="p-2">
                                          {r.predictionResult
                                            ?.predictedDisease || "Pending"}
                                        </td>
                                        <td className="p-2">
                                          {r.treatmentRecommendation
                                            ?.recommendedTreatment || "Pending"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p>No records available</p>
                            )}
                            <div className="flex justify-end mt-4">
                              <Button
                                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400"
                                onClick={() => setShowPatientDetails(null)}
                              >
                                Close
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Records Tab */}
            {tab === "records" && (
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-blue-700 dark:text-blue-300">
                  <ClipboardCheck
                    className="text-blue-600 dark:text-blue-400"
                    size={28}
                  />
                  Medical Records & Predictions
                </h2>
                {/* Add Medical Record Button */}
                <div className="flex justify-end mb-6">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-500 transition"
                    onClick={() => setShowAddRecord("new")}
                  >
                    + Add Medical Record
                  </Button>
                </div>
                <div className="flex gap-3 mb-6">
                  <Button
                    className="bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold shadow-md hover:from-green-700 hover:to-green-500 transition"
                    onClick={() => downloadCSV(records, patients)}
                  >
                    Download CSV
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold shadow-md hover:from-purple-700 hover:to-purple-500 transition"
                    onClick={() => window.print()}
                  >
                    Print
                  </Button>
                </div>
                {loadingRecords ? (
                  <div className="flex items-center justify-center h-32">
                    <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-3"></span>
                    <span className="text-blue-700 font-medium">
                      Loading records...
                    </span>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                      <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                        <tr>
                          <th className="p-3 text-blue-900 dark:text-blue-200 font-semibold">
                            Patient
                          </th>
                          <th className="p-3 text-blue-900 dark:text-blue-200 font-semibold">
                            Date
                          </th>
                          <th className="p-3 text-blue-900 dark:text-blue-200 font-semibold">
                            Symptoms
                          </th>
                          <th className="p-3 text-blue-900 dark:text-blue-200 font-semibold">
                            Disease
                          </th>
                          <th className="p-3 text-blue-900 dark:text-blue-200 font-semibold">
                            Treatment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r, i) => (
                          <tr
                            key={r.id}
                            className={`transition-colors duration-200 border-b-2 border-blue-100 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer ${
                              i % 2 === 0
                                ? "bg-blue-50 dark:bg-gray-900"
                                : "bg-white dark:bg-gray-800"
                            }`}
                            onClick={() => setSelectedRecord(r)}
                          >
                            <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                              {
                                patients.find((p) => p.id === r.patientId)
                                  ?.fullName
                              }
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-300">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-gray-700 dark:text-gray-200">
                              {r.symptoms.join(", ")}
                            </td>
                            <td className="p-3">
                              {r.predictionResult?.predictedDisease ? (
                                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-semibold">
                                  {r.predictionResult.predictedDisease}
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-semibold">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {typeof r.predictionResult
                                ?.treatmentRecommendation === "object" &&
                              r.predictionResult?.treatmentRecommendation !==
                                null &&
                              "recommendedTreatment" in
                                r.predictionResult.treatmentRecommendation &&
                              (
                                r.predictionResult.treatmentRecommendation as {
                                  recommendedTreatment?: string;
                                }
                              ).recommendedTreatment ? (
                                <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold">
                                  {
                                    (
                                      r.predictionResult
                                        .treatmentRecommendation as {
                                        recommendedTreatment?: string;
                                      }
                                    ).recommendedTreatment
                                  }
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-semibold">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Notes display below table */}
                    {selectedRecord && (
                      <div className="mt-8 p-5 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                            Treatment Notes for{" "}
                            {
                              patients.find(
                                (p) => p.id === selectedRecord.patientId
                              )?.fullName
                            }
                          </h3>
                          <Button
                            className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-3 py-1 rounded"
                            onClick={() => setSelectedRecord(null)}
                          >
                            Close
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200 text-sm">
                          {typeof selectedRecord.predictionResult
                            ?.treatmentRecommendation === "object" &&
                          selectedRecord.predictionResult
                            ?.treatmentRecommendation !== null &&
                          "notes" in
                            selectedRecord.predictionResult
                              .treatmentRecommendation &&
                          typeof selectedRecord.predictionResult
                            .treatmentRecommendation.notes === "string" &&
                          selectedRecord.predictionResult
                            .treatmentRecommendation.notes
                            ? renderNotes(
                                JSON.parse(
                                  selectedRecord.predictionResult
                                    .treatmentRecommendation.notes
                                )
                              )
                            : "No notes available."}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Profile Tab */}
            {tab === "profile" && (
              <section>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                    <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
                      <Image
                        src={profile.photo}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="pt-16 pb-8 text-center">
                    <div className="text-xl font-semibold">{profile.name}</div>
                    <div className="text-gray-500 capitalize">
                      {profile.role}
                    </div>
                    <div className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {profile.bio || "No bio provided"}
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-4">
                      <div className="text-gray-700 dark:text-gray-200">
                        <strong>Email:</strong> {profile.email}
                      </div>
                      <div className="text-gray-700 dark:text-gray-200">
                        <strong>Phone:</strong> {profile.phone || "N/A"}
                      </div>
                      <div className="text-gray-700 dark:text-gray-200">
                        <strong>Username:</strong>{" "}
                        {profile.name || profile.email?.split("@")[0]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-2 space-y-4">
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                          value={profile.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                          value={profile.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Bio</label>
                      <textarea
                        name="bio"
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                    <h3 className="font-semibold mb-2">Your Photo</h3>
                    <Image
                      src={profile.photo}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full border mb-4 object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={handlePhotoChange}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="block w-full text-center cursor-pointer text-blue-600 hover:underline mb-2"
                    >
                      Update Photo
                    </label>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
