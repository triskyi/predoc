"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  User,
  Users,
  FileText,
  BarChart2,
  Activity,
  LogOut,
  PlusCircle,
  Trash2,
  UserPlus,
  FilePlus,
  Stethoscope,
  Bell,
} from "lucide-react";
import {
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

// Sci-fi color palette
const scifi = {
  bg: "bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]",
  card: "bg-[#181c2f] border border-[#2e375a] shadow-[0_0_20px_#00ffe7cc]",
  accentBlue: "text-[#00ffe7]",
  accentPurple: "text-[#a259ff]",
  accentPink: "text-[#ff61e6]",
  accentYellow: "text-[#ffe156]",
  accentGreen: "text-[#00ffb8]",
  accentRed: "text-[#ff3864]",
};

// Skeleton components
function SkeletonSidebar() {
  return (
    <aside
      className={`fixed top-0 left-0 w-64 h-screen ${scifi.card} flex flex-col animate-pulse`}
    >
      <div className="flex items-center gap-2 px-6 py-6 border-b border-[#2e375a]">
        <div className="h-6 w-6 bg-[#232b47] rounded" />
        <div className="h-6 w-24 bg-[#232b47] rounded" />
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <li key={idx}>
              <div className="flex items-center w-full px-4 py-2 rounded-lg">
                <div className="h-5 w-5 bg-[#232b47] rounded" />
                <div className="ml-2 h-4 w-32 bg-[#232b47] rounded" />
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-[#2e375a]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-[#232b47] rounded" />
          <div className="h-4 w-20 bg-[#232b47] rounded" />
        </div>
      </div>
    </aside>
  );
}

function SkeletonCard() {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${scifi.card} flex flex-col animate-pulse`}
    >
      <div className="h-4 w-1/2 bg-[#232b47] rounded mb-3" />
      <div className="h-8 w-1/3 bg-[#232b47] rounded mb-2" />
      <div className="h-3 w-1/4 bg-[#232b47] rounded" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${scifi.card} flex flex-col animate-pulse`}
    >
      <div className="h-6 w-1/3 bg-[#232b47] rounded mb-4" />
      <div className="h-48 w-full bg-[#232b47] rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg mt-8 ${scifi.card} animate-pulse`}
    >
      <div className="h-6 w-1/4 bg-[#232b47] rounded mb-4" />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#232b47]">
              <th className="px-4 py-2">
                <div className="h-4 w-20 bg-[#2e375a] rounded" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-24 bg-[#2e375a] rounded" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-16 bg-[#2e375a] rounded" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-20 bg-[#2e375a] rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, idx) => (
              <tr key={idx} className="border-b border-[#232b47]">
                <td className="px-4 py-2">
                  <div className="h-4 w-32 bg-[#232b47] rounded" />
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-40 bg-[#232b47] rounded" />
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-16 bg-[#232b47] rounded" />
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-24 bg-[#232b47] rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-10 w-32 rounded bg-[#232b47] animate-pulse ${className}`}
    />
  );
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Types
  type Stat = {
    label: string;
    value: number;
    color?: "blue" | "green" | "yellow" | "purple";
    trend?: string;
    trendColor?: "green" | "red";
  };

  // State for all data
  const [stats, setStats] = useState<Stat[]>([]);
  type DiseaseTrend = {
    month: string;
    malaria: number;
    dengue: number;
    typhoid: number;
  };
  const [diseaseTrends, setDiseaseTrends] = useState<DiseaseTrend[]>([]);
  type ActivityItem = {
    icon?: React.ReactNode;
    text: string;
    time: string;
  };
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  type RecentUser = {
    name: string;
    email: string;
    role: string;
    joined: string;
  };
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<
    "users" | "patients" | "records" | "all"
  >("all");
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  // Section toggles
  const [showSettings, setShowSettings] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showPredictor, setShowPredictor] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Settings state
  const [theme, setTheme] = useState<"light" | "dark" | "scifi">("scifi");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
  const [newPatient, setNewPatient] = useState({
    fullName: "",
    age: "",
    gender: "",
    region: "",
    weight: "",
    pregnantStatus: "",
    g6pdDeficiency: false,
  });
  const [newRecord, setNewRecord] = useState({
    patientId: "",
    symptoms: "",
    userId: "",
    previousMedications: "",
  });

  // Management data
  type User = {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
  };
  const [users, setUsers] = useState<User[]>([]);
  type Patient = {
    id?: string;
    fullName: string;
    age: number;
    gender: string;
    region: string;
    weight: number;
    pregnantStatus?: string;
    g6pdDeficiency: boolean;
    createdAt?: string;
  };
  const [patients, setPatients] = useState<Patient[]>([]);
  type Record = {
    id?: string;
    patient?: Patient;
    user?: User;
    symptoms?: string[];
    previousMedications?: string;
    predictionResult?: { predictedDisease: string };
    createdAt?: string;
  };
  const [records, setRecords] = useState<Record[]>([]);

  // Distribution data (hard-coded as provided)
  const genderDist = [
    { gender: "Male", count: 0 },
    { gender: "Female", count: 2 },
    { gender: "Other", count: 4 },
  ];
  const roleDist = [
    { role: "Doctor", count: 1 },
    { role: "Nurse", count: 3 },
    { role: "Admin", count: 0 },
  ];
  const regionDist = [
    { region: "Papua New Guinea", count: 8 },
    { region: "Southeast Asia", count: 0 },
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
      return;
    }
    // Fetch all data in parallel
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/disease-trends").then((r) => r.json()),
      fetch("/api/admin/recent-activities").then((r) => r.json()),
      fetch("/api/admin/recent-users").then((r) => r.json()),
    ])
      .then(([stats, diseaseTrends, recentActivities, recentUsers]) => {
        setStats(stats);
        setDiseaseTrends(diseaseTrends);
        setRecentActivities(recentActivities);
        setRecentUsers(recentUsers);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        alert("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, [session, status, router]);

  // Fetch management data when toggled
  useEffect(() => {
    if (showUsers)
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then(setUsers)
        .catch((err) => {
          console.error("Error fetching users:", err);
          alert("Failed to load users");
        });
  }, [showUsers]);

  useEffect(() => {
    if (showPatients)
      fetch("/api/admin/patients")
        .then((r) => r.json())
        .then(setPatients)
        .catch((err) => {
          console.error("Error fetching patients:", err);
          alert("Failed to load patients");
        });
  }, [showPatients]);

  useEffect(() => {
    if (showRecords)
      fetch("/api/admin/records")
        .then((r) => r.json())
        .then(setRecords)
        .catch((err) => {
          console.error("Error fetching records:", err);
          alert("Failed to load records");
        });
  }, [showRecords]);

  // Compute sidebar counts from loaded stats
  const totalUsers = stats.find((s) => s.label === "Total Users")?.value ?? 0;
  const totalPatients =
    stats.find((s) => s.label === "Total Patients")?.value ?? 0;
  const totalRecords =
    stats.find((s) => s.label === "Medical Records")?.value ?? 0;

  // Export Data handler
  const handleExportData = async (e: React.FormEvent) => {
    e.preventDefault();
    setExportLoading(true);
    try {
      let url = "/api/admin/export";
      if (exportType !== "all") {
        url += `?type=${exportType}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to export data");
      }
      const data = await res.json();
      let exportData: unknown;
      let filename = `predoc_export_${new Date().toISOString().slice(0, 10)}`;

      if (exportType === "all") {
        exportData = data;
        filename += "_all";
      } else if (exportType === "users") {
        exportData = data.users;
        filename += "_users";
      } else if (exportType === "patients") {
        exportData = data.patients;
        filename += "_patients";
      } else if (exportType === "records") {
        exportData = data.records;
        filename += "_records";
      }

      if (exportFormat === "json") {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        filename += ".json";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === "csv") {
        const csv = Papa.unparse(exportData as object[]);
        const blob = new Blob([csv], { type: "text/csv" });
        filename += ".csv";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      setShowExportModal(false);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  // Add/Delete handlers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        throw new Error("Failed to add user");
      }
      const addedUser = await res.json();
      setUsers([...users, addedUser]);
      setNewUser({ name: "", email: "", role: "user" });
      setShowAddUserModal(false);
      alert("User added successfully");
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((u) => u.id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newPatient.fullName,
          age: parseInt(newPatient.age),
          gender: newPatient.gender,
          region: newPatient.region,
          weight: parseFloat(newPatient.weight),
          pregnantStatus: newPatient.pregnantStatus || null,
          g6pdDeficiency: newPatient.g6pdDeficiency,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add patient");
      }
      const addedPatient = await res.json();
      setPatients([...patients, addedPatient]);
      setNewPatient({
        fullName: "",
        age: "",
        gender: "",
        region: "",
        weight: "",
        pregnantStatus: "",
        g6pdDeficiency: false,
      });
      setShowAddPatientModal(false);
      alert("Patient added successfully");
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient");
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      const res = await fetch(`/api/admin/patients/${patientId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete patient");
      }
      setPatients(patients.filter((p) => p.id !== patientId));
      alert("Patient deleted successfully");
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient");
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: newRecord.patientId,
          userId: newRecord.userId,
          symptoms: newRecord.symptoms.split(",").map((s) => s.trim()),
          previousMedications: newRecord.previousMedications || null,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add record");
      }
      const addedRecord = await res.json();
      setRecords([...records, addedRecord]);
      setNewRecord({
        patientId: "",
        symptoms: "",
        userId: "",
        previousMedications: "",
      });
      setShowAddRecordModal(false);
      alert("Record added successfully");
    } catch (err) {
      console.error("Error adding record:", err);
      alert("Failed to add record");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/admin/records/${recordId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete record");
      }
      setRecords(records.filter((r) => r.id !== recordId));
      alert("Record deleted successfully");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record");
    }
  };

  // Settings handlers
  const handleThemeChange = (newTheme: "light" | "dark" | "scifi") => {
    setTheme(newTheme);
    // Apply theme (e.g., update CSS classes or Tailwind config)
    document.documentElement.classList.remove("light", "dark", "scifi");
    document.documentElement.classList.add(newTheme);
  };

  const handleNotificationChange = (
    type: "email" | "push",
    enabled: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [type]: enabled }));
    // Save to backend or local storage
  };

  if (status === "loading" || loading || !session) {
    return (
      <div className={`flex min-h-screen ${scifi.bg}`}>
        {showSidebar && <SkeletonSidebar />}
        <main className={`flex-1 p-8 ${showSidebar ? "pl-64" : ""}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="h-8 w-40 bg-[#232b47] rounded mb-2 animate-pulse" />
              <div className="h-4 w-64 bg-[#232b47] rounded animate-pulse" />
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable />
        </main>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return (
    <div className={`flex min-h-screen ${scifi.bg}`}>
      {/* Sidebar */}
      {showSidebar && (
        <aside
          className={`fixed top-0 left-0 w-64 h-screen ${scifi.card} flex flex-col z-50 transition-all duration-300`}
        >
          <div className="flex items-center gap-2 px-6 py-6 border-b border-[#2e375a]">
            <Menu className={scifi.accentBlue} />
            <span className="font-extrabold text-xl text-[#00ffe7] drop-shadow-glow">
              PREDOC <span className="text-xs font-normal">Admin</span>
            </span>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    !showUsers &&
                    !showPatients &&
                    !showRecords &&
                    !showSettings &&
                    !showPredictor
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#232b47] text-[#b2bfff]"
                  }`}
                  onClick={() => {
                    setShowUsers(false);
                    setShowPatients(false);
                    setShowRecords(false);
                    setShowSettings(false);
                    setShowPredictor(false);
                  }}
                >
                  <BarChart2 size={18} />
                  <span className="ml-2">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    showUsers
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#232b47] text-[#b2bfff]"
                  }`}
                  onClick={() => {
                    setShowUsers(true);
                    setShowPatients(false);
                    setShowRecords(false);
                    setShowSettings(false);
                    setShowPredictor(false);
                  }}
                >
                  <Users size={18} />
                  <span className="ml-2">User Management</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#232b47] text-[#00ffe7]">
                    {totalUsers}
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    showPatients
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#1e2a3a] text-[#00ffb8]"
                  }`}
                  onClick={() => {
                    setShowUsers(false);
                    setShowPatients(true);
                    setShowRecords(false);
                    setShowSettings(false);
                    setShowPredictor(false);
                  }}
                >
                  <User size={18} />
                  <span className="ml-2">Patient Management</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#1e2a3a] text-[#00ffb8]">
                    {totalPatients}
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    showRecords
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#2e2a1e] text-[#ffe156]"
                  }`}
                  onClick={() => {
                    setShowUsers(false);
                    setShowPatients(false);
                    setShowRecords(true);
                    setShowSettings(false);
                    setShowPredictor(false);
                  }}
                >
                  <FileText size={18} />
                  <span className="ml-2">Medical Records</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#2e2a1e] text-[#ffe156]">
                    {totalRecords}
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    showPredictor
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#232b47] text-[#b2bfff]"
                  }`}
                  onClick={() => {
                    setShowUsers(false);
                    setShowPatients(false);
                    setShowRecords(false);
                    setShowSettings(false);
                    setShowPredictor(true);
                    router.push("/predictor");
                  }}
                >
                  <Stethoscope size={18} />
                  <span className="ml-2">Predictor</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                    showSettings
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                      : "hover:bg-[#232b47] text-[#b2bfff]"
                  }`}
                  onClick={() => {
                    setShowUsers(false);
                    setShowPatients(false);
                    setShowRecords(false);
                    setShowSettings(true);
                    setShowPredictor(false);
                  }}
                >
                  <LogOut size={18} />
                  <span className="ml-2">Settings</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="px-4 py-4 border-t border-[#2e375a]">
            <button
              className="flex items-center gap-2 text-[#b2bfff] hover:text-[#ff3864] transition"
              onClick={() => setShowSettings(true)}
            >
              <LogOut size={18} /> Settings
            </button>
          </div>
        </aside>
      )}
      {/* Main Content */}
      <main
        className={`flex-1 p-8 ${
          showSidebar ? "pl-64" : ""
        } transition-all duration-300`}
      >
        {/* Sidebar Toggle Button */}
        <button
          className="fixed top-4 left-4 p-2 rounded bg-[#232b47] text-[#00ffe7] hover:bg-[#2e375a] transition z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu size={24} />
        </button>
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 ${scifi.card} w-full max-w-md`}>
              <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                Export Data
              </h2>
              <form onSubmit={handleExportData} className="space-y-4">
                <div>
                  <label className="text-[#b2bfff] text-sm">Record Type</label>
                  <select
                    value={exportType}
                    onChange={(e) =>
                      setExportType(
                        e.target.value as
                          | "users"
                          | "patients"
                          | "records"
                          | "all"
                      )
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  >
                    <option value="all">All Data</option>
                    <option value="users">Users</option>
                    <option value="patients">Patients</option>
                    <option value="records">Medical Records</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) =>
                      setExportFormat(e.target.value as "json" | "csv")
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7] ${
                      exportLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={exportLoading}
                  >
                    {exportLoading ? "Exporting..." : "Export"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#232b47] text-[#b2bfff] font-semibold hover:bg-[#2e375a] transition"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {showSettings && (
          <div className={`rounded-xl p-6 shadow-lg mb-8 ${scifi.card}`}>
            <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
              System Settings
            </h2>
            <div className="space-y-4 text-[#b2bfff]">
              <div>
                <label className="text-sm font-semibold">Theme</label>
                <select
                  value={theme}
                  onChange={(e) =>
                    handleThemeChange(
                      e.target.value as "light" | "dark" | "scifi"
                    )
                  }
                  className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="scifi">Sci-Fi</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Bell size={18} /> Email Notifications
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      handleNotificationChange("email", e.target.checked)
                    }
                    className="ml-auto"
                  />
                </label>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Bell size={18} /> Push Notifications
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      handleNotificationChange("push", e.target.checked)
                    }
                    className="ml-auto"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {showUsers && (
          <div className={`rounded-xl p-6 shadow-lg mb-8 ${scifi.card}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${scifi.accentBlue}`}>
                User Management
              </h2>
              <button
                className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                onClick={() => setShowAddUserModal(true)}
              >
                <UserPlus size={18} className="inline mr-2" /> Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#232b47] text-[#00ffe7]">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Joined</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} className="border-b border-[#232b47]">
                      <td className="px-4 py-2 text-[#00ffe7]">{user.name}</td>
                      <td className="px-4 py-2 text-[#b2bfff]">{user.email}</td>
                      <td className="px-4 py-2 text-[#a259ff]">{user.role}</td>
                      <td className="px-4 py-2 text-[#ffe156]">
                        {user.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-[#ff3864] hover:text-[#ff61e6] transition"
                          onClick={() => handleDeleteUser(user.id!)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 ${scifi.card} w-full max-w-md`}>
              <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                Add New User
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="text-[#b2bfff] text-sm">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                  >
                    Add User
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#232b47] text-[#b2bfff] font-semibold hover:bg-[#2e375a] transition"
                    onClick={() => setShowAddUserModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient Management */}
        {showPatients && (
          <div className={`rounded-xl p-6 shadow-lg mb-8 ${scifi.card}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${scifi.accentBlue}`}>
                Patient Management
              </h2>
              <button
                className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                onClick={() => setShowAddPatientModal(true)}
              >
                <UserPlus size={18} className="inline mr-2" /> Add Patient
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#232b47] text-[#00ffe7]">
                    <th className="px-4 py-2">Full Name</th>
                    <th className="px-4 py-2">Age</th>
                    <th className="px-4 py-2">Gender</th>
                    <th className="px-4 py-2">Region</th>
                    <th className="px-4 py-2">Weight</th>
                    <th className="px-4 py-2">Pregnant</th>
                    <th className="px-4 py-2">G6PD</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, idx) => (
                    <tr key={idx} className="border-b border-[#232b47]">
                      <td className="px-4 py-2 text-[#00ffe7]">{p.fullName}</td>
                      <td className="px-4 py-2 text-[#b2bfff]">{p.age}</td>
                      <td className="px-4 py-2 text-[#a259ff]">{p.gender}</td>
                      <td className="px-4 py-2 text-[#ffe156]">{p.region}</td>
                      <td className="px-4 py-2 text-[#b2bfff]">{p.weight}</td>
                      <td className="px-4 py-2 text-[#a259ff]">
                        {p.pregnantStatus || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-[#ffe156]">
                        {p.g6pdDeficiency ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 text-[#b2bfff]">
                        {p.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-[#ff3864] hover:text-[#ff61e6] transition"
                          onClick={() => handleDeletePatient(p.id!)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Patient Modal */}
        {showAddPatientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 ${scifi.card} w-full max-w-md`}>
              <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                Add New Patient
              </h2>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="text-[#b2bfff] text-sm">Full Name</label>
                  <input
                    type="text"
                    value={newPatient.fullName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, fullName: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Region</label>
                  <input
                    type="text"
                    value={newPatient.region}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, region: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Weight (kg)</label>
                  <input
                    type="number"
                    value={newPatient.weight}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, weight: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">
                    Pregnant Status
                  </label>
                  <select
                    value={newPatient.pregnantStatus}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        pregnantStatus: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  >
                    <option value="">Not Applicable</option>
                    <option value="not_pregnant">Not Pregnant</option>
                    <option value="first_trimester">First Trimester</option>
                    <option value="second">Second Trimester</option>
                    <option value="third">Third Trimester</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">
                    G6PD Deficiency
                  </label>
                  <input
                    type="checkbox"
                    checked={newPatient.g6pdDeficiency}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        g6pdDeficiency: e.target.checked,
                      })
                    }
                    className="ml-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                  >
                    Add Patient
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#232b47] text-[#b2bfff] font-semibold hover:bg-[#2e375a] transition"
                    onClick={() => setShowAddPatientModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Medical Records */}
        {showRecords && (
          <div className={`rounded-xl p-6 shadow-lg mb-8 ${scifi.card}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${scifi.accentBlue}`}>
                Medical Records
              </h2>
              <button
                className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                onClick={() => setShowAddRecordModal(true)}
              >
                <FilePlus size={18} className="inline mr-2" /> Add Record
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#232b47] text-[#00ffe7]">
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Handled By</th>
                    <th className="px-4 py-2">Symptoms</th>
                    <th className="px-4 py-2">Previous Medications</th>
                    <th className="px-4 py-2">Predicted Disease</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={idx} className="border-b border-[#232b47]">
                      <td className="px-4 py-2 text-[#00ffe7]">
                        {r.patient?.fullName}
                      </td>
                      <td className="px-4 py-2 text-[#b2bfff]">
                        {r.user?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-[#a259ff]">
                        {r.symptoms?.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-[#b2bfff]">
                        {r.previousMedications || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-[#00ffb8]">
                        {r.predictionResult?.predictedDisease || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-[#ffe156]">
                        {r.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-[#ff3864] hover:text-[#ff61e6] transition"
                          onClick={() => handleDeleteRecord(r.id!)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Record Modal */}
        {showAddRecordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 ${scifi.card} w-full max-w-md`}>
              <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                Add New Medical Record
              </h2>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="text-[#b2bfff] text-sm">Patient</label>
                  <select
                    value={newRecord.patientId}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, patientId: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">Handled By</label>
                  <select
                    value={newRecord.userId}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, userId: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">
                    Symptoms (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newRecord.symptoms}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, symptoms: e.target.value })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#b2bfff] text-sm">
                    Previous Medications
                  </label>
                  <input
                    type="text"
                    value={newRecord.previousMedications}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        previousMedications: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#232b47] border border-[#2e375a] rounded text-[#00ffe7]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7]"
                  >
                    Add Record
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#232b47] text-[#b2bfff] font-semibold hover:bg-[#2e375a] transition"
                    onClick={() => setShowAddRecordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Default Dashboard */}
        {!showSettings &&
          !showUsers &&
          !showPatients &&
          !showRecords &&
          !showPredictor && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h1
                    className={`text-3xl font-bold ${scifi.accentBlue} mb-2 drop-shadow-glow`}
                  >
                    Overview
                  </h1>
                  <p className="text-[#b2bfff]">
                    Admin quick stats and actions
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    className={`px-4 py-2 rounded bg-[#00ffe7] text-[#181c2f] font-semibold hover:bg-[#00bfae] transition shadow-[0_0_10px_#00ffe7] flex items-center gap-2`}
                    onClick={() => setShowExportModal(true)}
                  >
                    <PlusCircle size={18} />
                    Export Data
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-[#232b47] text-[#b2bfff] font-semibold hover:bg-[#2e375a] transition flex items-center gap-2"
                    onClick={() => setShowSettings(true)}
                  >
                    <LogOut size={18} /> Settings
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl p-6 shadow-lg ${scifi.card} flex flex-col`}
                  >
                    <span className="text-[#b2bfff] text-sm">{stat.label}</span>
                    <span
                      className={`text-2xl font-bold mt-2 ${
                        stat.color === "blue"
                          ? scifi.accentBlue
                          : stat.color === "green"
                          ? scifi.accentGreen
                          : stat.color === "yellow"
                          ? scifi.accentYellow
                          : stat.color === "purple"
                          ? scifi.accentPurple
                          : ""
                      }`}
                    >
                      {stat.value.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs mt-1 ${
                        stat.trendColor === "green"
                          ? scifi.accentGreen
                          : stat.trendColor === "red"
                          ? scifi.accentRed
                          : ""
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`rounded-xl p-6 shadow-lg ${scifi.card}`}>
                  <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                    Disease Trends
                  </h2>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={diseaseTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232b47" />
                        <XAxis dataKey="month" stroke="#00ffe7" />
                        <YAxis stroke="#00ffe7" />
                        <Tooltip
                          contentStyle={{
                            background: "#181c2f",
                            border: "1px solid #00ffe7",
                            color: "#00ffe7",
                          }}
                        />
                        <Legend />
                        <ReLine
                          type="monotone"
                          dataKey="malaria"
                          stroke="#00ffe7"
                          strokeWidth={2}
                        />
                        <ReLine
                          type="monotone"
                          dataKey="dengue"
                          stroke="#a259ff"
                          strokeWidth={2}
                        />
                        <ReLine
                          type="monotone"
                          dataKey="typhoid"
                          stroke="#ffe156"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={`rounded-xl p-6 shadow-lg ${scifi.card}`}>
                  <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                    Recent Activities
                  </h2>
                  <ul className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={scifi.accentBlue}>
                          {activity.icon || <Activity size={18} />}
                        </span>
                        <span className="text-[#b2bfff]">{activity.text}</span>
                        <span className="ml-auto text-xs text-[#a259ff]">
                          {activity.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`rounded-xl p-6 shadow-lg ${scifi.card}`}>
                  <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                    Patient Gender Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <ReBarChart data={genderDist}>
                      <XAxis dataKey="gender" stroke="#00ffe7" />
                      <YAxis stroke="#00ffe7" />
                      <Tooltip
                        contentStyle={{
                          background: "#181c2f",
                          border: "1px solid #00ffe7",
                          color: "#00ffe7",
                        }}
                      />
                      <Bar dataKey="count" fill="#00ffe7" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                <div className={`rounded-xl p-6 shadow-lg ${scifi.card}`}>
                  <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                    User Role Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={roleDist}
                        dataKey="count"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#00ffe7"
                        label
                      >
                        {roleDist.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={["#00ffe7", "#a259ff", "#ffe156"][idx % 3]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#181c2f",
                          border: "1px solid #00ffe7",
                          color: "#00ffe7",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className={`rounded-xl p-6 shadow-lg ${scifi.card}`}>
                  <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                    Patient Region Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <ReBarChart data={regionDist}>
                      <XAxis dataKey="region" stroke="#00ffe7" />
                      <YAxis stroke="#00ffe7" />
                      <Tooltip
                        contentStyle={{
                          background: "#181c2f",
                          border: "1px solid #00ffe7",
                          color: "#00ffe7",
                        }}
                      />
                      <Bar dataKey="count" fill="#a259ff" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`rounded-xl p-6 shadow-lg mt-8 ${scifi.card}`}>
                <h2 className={`text-lg font-bold mb-4 ${scifi.accentBlue}`}>
                  Recent Users
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#232b47] text-[#00ffe7]">
                        <th className="px-4 py-2 text-left font-semibold">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Role
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user, idx) => (
                        <tr key={idx} className="border-b border-[#232b47]">
                          <td className="px-4 py-2 text-[#00ffe7]">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 text-[#b2bfff]">
                            {user.email}
                          </td>
                          <td className="px-4 py-2 text-[#a259ff]">
                            {user.role}
                          </td>
                          <td className="px-4 py-2 text-[#ffe156]">
                            {user.joined}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-8 text-center text-xs text-[#b2bfff]">
                © {new Date().getFullYear()} PREDOC. Admin access only.
              </div>
            </>
          )}
      </main>
    </div>
  );
}
