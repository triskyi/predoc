"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

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
import { Card, Skeleton } from "@heroui/react";
import { Activity, LineChartIcon } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const API_KEY = "deb9ca885b20dde870c6bc98df473c298d3caf80e63202d6";

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

const countries: Record<string, string[]> = {
  Rwanda: [
    "Kigali",
    "Huye",
    "Muhanga",
    "Nyagatare",
    "Rubavu",
    "Musanze",
    "Gicumbi",
    "Rwamagana",
    "Bugesera",
    "Rusizi",
  ],
  Uganda: [
    "Kampala",
    "Gulu",
    "Lira",
    "Mbarara",
    "Jinja",
    "Mbale",
    "Masaka",
    "Arua",
    "Hoima",
    "Fort Portal",
  ],
};

const previous_medications = [
  "None",
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Artemether-Lumefantrine",
  "Ciprofloxacin",
  "Cetirizine",
];

export default function PredictorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  // State declarations
  const [tab, setTab] = useState("dashboard");

  // Helper for symptoms list (for forms)
  const symptomsList = symptoms;

  type Patient = {
    id: string;
    fullName: string;
    age: number;
    gender: string;
    weight: number;
    country?: string;
    district?: string;
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
  const defaultProfile = {
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    photo: "/avatar.png",
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
    country: "",
    district: "",
    pregnantStatus: "",
    g6pdDeficiency: false,
  });

  async function fetchUserProfile(userId: number | string) {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const profile = await res.json();
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  const lastFetchedUserId = useRef<string | number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const userId = session.user.email ?? "";
    if (userId !== lastFetchedUserId.current) {
      lastFetchedUserId.current = userId;
      fetchUserProfile(userId);
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, recordsRes, analyticsRes] = await Promise.all([
          fetch("/api/patients", {
            headers: {
              Authorization: `Bearer ${
                (session?.user as { accessToken?: string })?.accessToken ?? ""
              }`,
            },
          }),
          fetch("/api/records", {
            headers: {
              Authorization: `Bearer ${
                (session?.user as { accessToken?: string })?.accessToken ?? ""
              }`,
            },
          }),
          fetch("/api/analytics", {
            headers: {
              Authorization: `Bearer ${
                (session?.user as { accessToken?: string })?.accessToken ?? ""
              }`,
            },
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
  }, [session]);

  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);

  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${
            (session?.user as { accessToken?: string })?.accessToken ?? ""
          }`,
        },
        body: JSON.stringify({
          fullName: newPatient.fullName,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          weight: Number(newPatient.weight),
          country: newPatient.country,
          district: newPatient.district,
          pregnantStatus:
            newPatient.gender === "female" && newPatient.pregnantStatus
              ? newPatient.pregnantStatus
              : null,
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
          country: "",
          district: "",
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
      p.country?.toLowerCase().includes(search.toLowerCase())
  );

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
    signOut({ callbackUrl: "/login" });
  };

  const handleAddRecord = async (e: React.FormEvent, patientId: string) => {
    e.preventDefault();
    try {
      const patientRes = await fetch(`/api/patients/${patientId}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      if (!patientRes.ok) throw new Error("Failed to fetch patient info");
      const patient = await patientRes.json();

      let prevMed = recordForm.previousMedications;
      if (prevMed === "None") prevMed = "Paracetamol";

      const data: Record<string, string | number> = {};
      symptomsList.forEach(
        (s) => (data[s] = recordForm.symptoms.includes(s) ? 1 : 0)
      );
      data.Age = patient.age;
      data.Weight = patient.weight;
      data.Country = patient.country;
      data.District = patient.district;
      data.Gender =
        patient.gender === "male"
          ? "Male"
          : patient.gender === "female"
          ? "Female"
          : patient.gender;
      data.Pregnant =
        patient.pregnantStatus === "first_trimester" ||
        patient.pregnantStatus === "second" ||
        patient.pregnantStatus === "third"
          ? 1
          : 0;
      data.First_Trimester_Pregnant =
        patient.pregnantStatus === "first_trimester" ? 1 : 0;
      data.G6PD_Deficiency = patient.g6pdDeficiency ? 1 : 0;
      data.Previous_Medications = prevMed || "Paracetamol";

      const predictRes = await fetch(
        "https://predoc-api-2.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(data),
        }
      );
      const predictResult = await predictRes.json();

      if (!predictRes.ok) {
        alert(predictResult.error || "Prediction failed");
        return;
      }
      const treatment = predictResult.prediction?.treatment;
      const drug = treatment?.drug || "";
      const notes = treatment
        ? JSON.stringify({ ...treatment, drug: undefined }, null, 2)
        : "";

      const saveRes = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${
            (session?.user as { accessToken?: string })?.accessToken ?? ""
          }`,
        },
        body: JSON.stringify({
          patientId: Number(patientId),
          symptoms: recordForm.symptoms,
          previousMedications: prevMed,
          predictedDisease: predictResult.prediction?.disease,
          recommendedTreatment: drug,
          notes,
        }),
      });

      if (!saveRes.ok) {
        alert("Failed to save record");
        return;
      }

      setShowAddRecord(null);
      setRecordForm({ patientId: "", symptoms: [], previousMedications: "" });

      alert("Medical record added and prediction saved!");
    } catch (err) {
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

  const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"];
  const diseaseData =
    records.length > 0
      ? Object.entries(
          records.reduce((acc, r) => {
            const d = r.predictionResult?.predictedDisease || "Unknown";
            acc[d] = (acc[d] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, value }))
      : [];

  const mostPredictedDisease =
    diseaseData.length > 0
      ? diseaseData.reduce(
          (max, d) => (d.value > max.value ? d : max),
          diseaseData[0]
        )
      : null;

  const cityDiseaseCount: Record<string, number> = {};
  if (mostPredictedDisease) {
    records.forEach((r) => {
      if (r.predictionResult?.predictedDisease === mostPredictedDisease.name) {
        const patient = patients.find((p) => p.id === r.patientId);
        const city =
          typeof patient?.district === "string" && patient.district
            ? patient.district
            : "Unknown";
        cityDiseaseCount[city] = (cityDiseaseCount[city] || 0) + 1;
      }
    });
  }

  const lineData = (() => {
    const dateCounts: Record<string, number> = {};
    records.forEach((r) => {
      const date = new Date(r.createdAt).toLocaleDateString();
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    return Object.entries(dateCounts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({ date, count }));
  })();

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const res = await fetch("/api/users/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        alert("Failed to update profile");
        return;
      }
      const updatedProfile = await res.json();
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  }

  const [filter, setFilter] = useState({
    country: "",
    district: "",
    disease: "",
  });

  const allCountries = Array.from(
    new Set(patients.map((p) => p.country).filter(Boolean))
  ) as string[];
  const allDistricts = Array.from(
    new Set(
      patients
        .filter((p) => (filter.country ? p.country === filter.country : true))
        .map((p) => p.district)
        .filter(Boolean)
    )
  ) as string[];
  const allDiseases = Array.from(
    new Set(
      records.map((r) => r.predictionResult?.predictedDisease).filter(Boolean)
    )
  ) as string[];

  const allDiseaseBarData = (() => {
    const filteredPatients = patients.filter((p) => {
      if (filter.country && p.country !== filter.country) return false;
      if (filter.district && p.district !== filter.district) return false;
      return true;
    });
    const filteredPatientIds = new Set(filteredPatients.map((p) => p.id));

    const diseaseDistrictMap: Record<string, Record<string, number>> = {};
    records.forEach((r) => {
      const disease = r.predictionResult?.predictedDisease || "Unknown";
      if (!filteredPatientIds.has(r.patientId)) return;
      const patient = patients.find((p) => p.id === r.patientId);
      const city =
        typeof patient?.district === "string" && patient.district
          ? patient.district
          : "Unknown";
      if (!diseaseDistrictMap[disease]) diseaseDistrictMap[disease] = {};
      diseaseDistrictMap[disease][city] =
        (diseaseDistrictMap[disease][city] || 0) + 1;
    });

    return Object.entries(diseaseDistrictMap).map(([disease, cityMap]) => ({
      disease,
      data: Object.entries(cityMap)
        .map(([city, value]) => ({
          category: city,
          value,
        }))
        .sort((a, b) => b.value - a.value),
    }));
  })();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 flex flex-col py-6 px-4 min-h-screen fixed top-0 left-0 h-screen z-30">
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
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
            <li>
              <button
                className="flex items-center w-full px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition gap-2 mt-4"
                onClick={() => router.push("/ai-playground")}
              >
                <Package className="mr-2" size={18} />
                AI Playground
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2 w-full px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <User className="text-blue-600" />
            <span className="text-gray-700 dark:text-gray-200 text-sm">
              {profile.name}
            </span>
          </div>
        </div>
      </aside>

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
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2">
              <Bell size={18} />
            </Button>
            <Button
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
            <button
              className="rounded-full border-2 border-blue-400 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setTab("profile")}
            >
              <Image
                src={profile.photo || "/avatar.png"}
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
            {tab === "dashboard" && (
              <section>
                {loadingPatients || loadingRecords || !analytics ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      {[...Array(4)].map((_, i) => (
                        <Card
                          key={i}
                          className="w-full space-y-5 p-4"
                          radius="lg"
                        >
                          <Skeleton className="rounded-lg">
                            <div className="h-10 w-10 rounded-lg bg-default-300" />
                          </Skeleton>
                          <div className="space-y-3">
                            <Skeleton className="w-3/5 rounded-lg">
                              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                            </Skeleton>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {[...Array(2)].map((_, i) => (
                        <Card
                          key={i}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                        >
                          <Skeleton className="rounded-lg">
                            <div className="h-40 rounded-lg bg-default-300" />
                          </Skeleton>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
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
                      {/* Replace Record Comparison with Most Common Disease */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                        <Activity className="text-pink-500 mb-2" size={28} />
                        <div className="text-2xl font-bold">
                          {mostPredictedDisease
                            ? mostPredictedDisease.name
                            : "No data"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Most Common Disease
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Activity className="text-sky-500" />
                            <h3 className="text-lg font-semibold">
                              Disease Distribution
                            </h3>
                          </div>
                          {diseaseData.length === 0 ? (
                            <div className="text-center text-gray-400">
                              No data available
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={240}>
                              <PieChart>
                                <Pie
                                  data={diseaseData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  innerRadius={40}
                                  label
                                >
                                  {diseaseData.map((entry, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={COLORS[idx % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                          {diseaseData.length > 0 && (
                            <div className="mt-4 text-center font-semibold text-blue-700 dark:text-blue-300">
                              {diseaseData.map((d) => (
                                <div key={d.name}>
                                  {d.name}: {d.value}
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <LineChartIcon className="text-yellow-500" />
                            <h3 className="text-lg font-semibold">
                              Records Over Time
                            </h3>
                          </div>
                          {lineData.length === 0 ? (
                            <div className="text-center text-gray-400">
                              No data available
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={240}>
                              <LineChart data={lineData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#CBD5E0"
                                />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="count"
                                  stroke="#63B3ED"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {lineData.map((d) => (
                              <span
                                key={d.date}
                                className="inline-block px-3 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold"
                              >
                                {d.date}: {d.count}
                              </span>
                            ))}
                          </div>
                        </Card>
                      </div>

                      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                          <LineChartIcon className="text-pink-500" />
                          <h3 className="text-lg font-semibold">
                            Record Comparison
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div>
                            <label className="block text-xs mb-1">
                              Country
                            </label>
                            <select
                              className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                              value={filter.country}
                              onChange={(e) =>
                                setFilter((f) => ({
                                  ...f,
                                  country: e.target.value,
                                  district: "",
                                }))
                              }
                            >
                              <option value="">All</option>
                              {allCountries.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">
                              District
                            </label>
                            <select
                              className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                              value={filter.district}
                              onChange={(e) =>
                                setFilter((f) => ({
                                  ...f,
                                  district: e.target.value,
                                }))
                              }
                              disabled={!filter.country}
                            >
                              <option value="">All</option>
                              {allDistricts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs mb-1">
                              Disease
                            </label>
                            <select
                              className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                              value={filter.disease}
                              onChange={(e) =>
                                setFilter((f) => ({
                                  ...f,
                                  disease: e.target.value,
                                }))
                              }
                            >
                              <option value="">All</option>
                              {allDiseases.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {allDiseaseBarData.length === 0 ? (
                          <div className="text-center text-gray-400">
                            No data available
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {allDiseaseBarData
                              .filter(
                                (d) =>
                                  !filter.disease ||
                                  d.disease === filter.disease
                              )
                              .map((diseaseBar) => (
                                <div key={diseaseBar.disease}>
                                  <div className="font-semibold text-pink-700 dark:text-pink-300 mb-2">
                                    Cities with &quot;{diseaseBar.disease}&quot;
                                    cases:
                                  </div>
                                  <ResponsiveContainer
                                    width="100%"
                                    height={200}
                                  >
                                    <BarChart data={diseaseBar.data}>
                                      <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#CBD5E0"
                                      />
                                      <XAxis dataKey="category" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="value" fill="#F687B3" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                  <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                    {diseaseBar.data.map((d) => (
                                      <div key={d.category}>
                                        {d.category}: {d.value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  </>
                )}
              </section>
            )}

            {tab === "patients" && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users /> Manage Patients
                  </h2>
                  <Button
                    onClick={() => setShowAddPatient(true)}
                    className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                  >
                    <UserPlus className="mr-2" size={18} /> Add Patient
                  </Button>
                </div>
                {loadingPatients ? (
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-8 w-full rounded-lg bg-default-300" />
                    </Skeleton>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="rounded-lg">
                        <div className="h-6 w-full rounded-lg bg-default-200" />
                      </Skeleton>
                    ))}
                  </Card>
                ) : (
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="p-2">Name</th>
                          <th className="p-2">Age</th>
                          <th className="p-2">Gender</th>
                          <th className="p-2">Country</th>
                          <th className="p-2">District</th>
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
                            <td className="p-2">{p.country || "N/A"}</td>
                            <td className="p-2">{p.district || "N/A"}</td>
                            <td className="p-2 flex gap-2">
                              <Button
                                className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                                onClick={() => setShowAddRecord(p.id)}
                              >
                                <FileText size={16} /> + Predict
                              </Button>
                              <Button
                                className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-green-400 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                                onClick={() => setShowPatientDetails(p.id)}
                              >
                                <Info size={16} /> Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                          <label className="block mb-1">Weight</label>
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
                          <label className="block mb-1">Country</label>
                          <select
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.country}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                country: e.target.value,
                                district: "",
                              })
                            }
                            required
                          >
                            <option value="">Select Country</option>
                            {Object.keys(countries).map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1">District</label>
                          <select
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={newPatient.district}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                district: e.target.value,
                              })
                            }
                            required
                            disabled={!newPatient.country}
                          >
                            <option value="">Select District</option>
                            {newPatient.country &&
                              countries[newPatient.country].map((d) => (
                                <option key={d} value={d}>
                                  {d}
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
                            className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                            type="submit"
                          >
                            Add Patient
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
                            <strong>Country:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.country
                            }
                          </p>
                          <p>
                            <strong>District:</strong>{" "}
                            {
                              patients.find((p) => p.id === showAddRecord)
                                ?.district
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
                                {s.replace(/_/g, " ")}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1">
                            Previous Medications
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={recordForm.previousMedications}
                            onChange={(e) =>
                              setRecordForm({
                                ...recordForm,
                                previousMedications: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select Medication</option>
                            {previous_medications.map((med) => (
                              <option key={med} value={med}>
                                {med}
                              </option>
                            ))}
                          </select>
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
                            className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                          >
                            Predict
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
                                  className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
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

                        const userId = session?.user?.email;
                        const totalPatientsByUser = patients.filter(
                          (p) => p.userId === userId
                        ).length;
                        const totalRecordsByUser = records.filter(
                          (r) => r.userId === userId
                        ).length;
                        const totalPredictionsByUser = records.filter(
                          (r) => r.userId === userId && r.predictionResult
                        ).length;
                        const totalTreatmentsByUser = records.filter(
                          (r) =>
                            r.userId === userId &&
                            typeof r.predictionResult
                              ?.treatmentRecommendation === "object" &&
                            r.predictionResult?.treatmentRecommendation !==
                              null &&
                            "recommendedTreatment" in
                              r.predictionResult.treatmentRecommendation &&
                            (
                              r.predictionResult.treatmentRecommendation as {
                                recommendedTreatment?: string;
                              }
                            ).recommendedTreatment
                        ).length;

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
                                <p>
                                  <strong>Country:</strong>{" "}
                                  {patient.country || "N/A"}
                                </p>
                                <p>
                                  <strong>District:</strong>{" "}
                                  {patient.district || "N/A"}
                                </p>
                              </div>
                              <div>
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
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                  {totalPatientsByUser}
                                </div>
                                <div className="text-gray-700 dark:text-gray-200">
                                  Total Patients he created
                                </div>
                              </div>
                              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                  {totalRecordsByUser}
                                </div>
                                <div className="text-gray-700 dark:text-gray-200">
                                  Medical Records he made
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                  {totalPredictionsByUser}
                                </div>
                                <div className="text-gray-700 dark:text-gray-200">
                                  Predictions Made he made
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                  {totalTreatmentsByUser}
                                </div>
                                <div className="text-gray-700 dark:text-gray-200">
                                  Treatments he made
                                </div>
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
                                className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
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

            {tab === "records" && (
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-blue-700 dark:text-blue-300">
                  <ClipboardCheck
                    className="text-blue-600 dark:text-blue-400"
                    size={28}
                  />
                  Medical Records & Predictions
                </h2>
                <div className="flex justify-end mb-6"></div>
                <div className="flex gap-3 mb-6">
                  <Button
                    className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-sky-400 via-yellow-400 to-yellow-500 hover:from-sky-500 hover:via-yellow-500 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                    onClick={() => downloadCSV(records, patients)}
                  >
                    <Package size={18} />
                    Download CSV
                  </Button>
                  <Button
                    className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                    onClick={() => window.print()}
                  >
                    <FileText size={18} />
                    Print
                  </Button>
                </div>
                {loadingRecords ? (
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-8 w-full rounded-lg bg-default-300" />
                    </Skeleton>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="rounded-lg">
                        <div className="h-6 w-full rounded-lg bg-default-200" />
                      </Skeleton>
                    ))}
                  </Card>
                ) : (
                  <>
                    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <LineChartIcon className="text-pink-500" />
                        <h3 className="text-lg font-semibold">
                          Record Comparison
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                          <label className="block text-xs mb-1">Country</label>
                          <select
                            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                            value={filter.country}
                            onChange={(e) =>
                              setFilter((f) => ({
                                ...f,
                                country: e.target.value,
                                district: "",
                              }))
                            }
                          >
                            <option value="">All</option>
                            {allCountries.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1">District</label>
                          <select
                            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                            value={filter.district}
                            onChange={(e) =>
                              setFilter((f) => ({
                                ...f,
                                district: e.target.value,
                              }))
                            }
                            disabled={!filter.country}
                          >
                            <option value="">All</option>
                            {allDistricts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Disease</label>
                          <select
                            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                            value={filter.disease}
                            onChange={(e) =>
                              setFilter((f) => ({
                                ...f,
                                disease: e.target.value,
                              }))
                            }
                          >
                            <option value="">All</option>
                            {allDiseases.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {allDiseaseBarData.length === 0 ? (
                        <div className="text-center text-gray-400">
                          No data available
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {allDiseaseBarData
                            .filter(
                              (d) =>
                                !filter.disease || d.disease === filter.disease
                            )
                            .map((diseaseBar) => (
                              <div key={diseaseBar.disease}>
                                <div className="font-semibold text-pink-700 dark:text-pink-300 mb-2">
                                  Cities with &quot;{diseaseBar.disease}&quot;
                                  cases:
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={diseaseBar.data}>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#CBD5E0"
                                    />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#F687B3" />
                                  </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                  {diseaseBar.data.map((d) => (
                                    <div key={d.category}>
                                      {d.category}: {d.value}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                      <div className="overflow-x-auto">
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
                                  r.predictionResult
                                    ?.treatmentRecommendation !== null &&
                                  "recommendedTreatment" in
                                    r.predictionResult
                                      .treatmentRecommendation &&
                                  (
                                    r.predictionResult
                                      .treatmentRecommendation as {
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
                                className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
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
                    </Card>
                  </>
                )}
              </section>
            )}

            {tab === "profile" && (
              <section>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                    <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
                      <Image
                        src={profile.photo || "/avatar.png"}
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
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-2 space-y-4">
                      <h3 className="font-semibold mb-2">
                        Personal Information
                      </h3>
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
                        <Button
                          type="submit"
                          className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                      <h3 className="font-semibold mb-2">Your Photo</h3>
                      <Image
                        src={profile.photo || "/avatar.png"}
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
                </form>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
