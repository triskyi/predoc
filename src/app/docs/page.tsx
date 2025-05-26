import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c] text-cyan-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex max-w-6xl mx-auto py-16 px-4 gap-8">
        {/* Aside Navigation */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <nav className="sticky top-28 bg-[#111827]/80 border border-cyan-900 rounded-2xl shadow-lg p-6">
            <div className="font-bold text-cyan-300 mb-4 tracking-wide text-lg">
              Docs Navigation
            </div>
            <ul className="space-y-3 text-cyan-200">
              <li>
                <a
                  href="#getting-started"
                  className="hover:text-fuchsia-400 transition"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="#api-access"
                  className="hover:text-fuchsia-400 transition"
                >
                  API Access
                </a>
              </li>
              <li>
                <a
                  href="#best-practices"
                  className="hover:text-fuchsia-400 transition"
                >
                  Best Practices
                </a>
              </li>
              <li>
                <a
                  href="#resources"
                  className="hover:text-fuchsia-400 transition"
                >
                  Resources
                </a>
              </li>
            </ul>
            <div className="mt-8 border-t border-cyan-900 pt-4">
              <Link
                href="/"
                className="text-cyan-400 hover:text-fuchsia-400 block mb-2"
              >
                ← Back to Home
              </Link>
              <Link
                href="/our-source"
                className="text-cyan-400 hover:text-fuchsia-400 block"
              >
                Drug Guideline Sources
              </Link>
            </div>
          </nav>
        </aside>
        {/* Main Content */}
        <div className="flex-1">
          <div className="rounded-2xl bg-[#111827]/80 border border-cyan-900 shadow-xl p-8">
            <h1 className="text-3xl font-extrabold mb-6 text-cyan-300 tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
                PREDOC Documentation
              </span>
            </h1>
            <p className="mb-6 text-cyan-200">
              Welcome to the PREDOC documentation. Here you will find information
              about using the platform, integrating with our API, and best
              practices for AI-powered healthcare.
            </p>

            {/* Quick Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full px-4 py-2 rounded-md border border-cyan-800 bg-[#0f172a] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm mb-2"
              />
            </div>

            {/* Getting Started */}
            <section
              id="getting-started"
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-xl font-bold mb-2 text-fuchsia-400">
                Getting Started
              </h2>
              <ul className="list-disc ml-6 space-y-1 text-cyan-200">
                <li>
                  <strong className="text-cyan-300">Register:</strong> Create an
                  account and log in to access all features.
                </li>
                <li>
                  <strong className="text-cyan-300">Add Patients:</strong> Use the
                  dashboard to add and manage your patients.
                </li>
                <li>
                  <strong className="text-cyan-300">
                    AI Disease Prediction:
                  </strong>{" "}
                  Enter symptoms and get instant, AI-powered predictions and drug
                  recommendations.
                </li>
              </ul>
            </section>

            {/* API Access */}
            <section
              id="api-access"
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-xl font-bold mb-2 text-fuchsia-400">
                API Access
              </h2>
              <p className="mb-2 text-cyan-200">
                You can integrate PREDOC&#39;s AI and patient management features
                into your own apps or systems using our REST API.
              </p>
              <div className="bg-[#1e293b] border border-cyan-900 rounded-lg p-4 mb-3 text-sm">
                <div className="mb-2 text-cyan-300 font-semibold">
                  Authentication
                </div>
                <div>
                  All API requests require an{" "}
                  <span className="text-fuchsia-400">API Key</span> and a valid
                  user token.
                </div>
                <div className="mt-2">
                  <span className="text-cyan-400">Header Example:</span>
                  <pre className="bg-[#0f172a] rounded p-2 mt-1 text-cyan-200 overflow-x-auto">
{`Authorization: Bearer <your-access-token>
x-api-key: <your-api-key>`}
                  </pre>
                </div>
              </div>
              <div className="bg-[#1e293b] border border-cyan-900 rounded-lg p-4 mb-3 text-sm">
                <div className="mb-2 text-cyan-300 font-semibold">Endpoints</div>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    <span className="text-fuchsia-400">POST /api/predict</span> -
                    Get disease prediction and drug recommendation.
                  </li>
                  <li>
                    <span className="text-fuchsia-400">GET /api/patients</span> -
                    List your patients.
                  </li>
                  <li>
                    <span className="text-fuchsia-400">POST /api/patients</span> -
                    Add a new patient.
                  </li>
                  <li>
                    <span className="text-fuchsia-400">GET /api/records</span> -
                    List your medical records.
                  </li>
                  <li>
                    <span className="text-fuchsia-400">POST /api/records</span> -
                    Add a new medical record.
                  </li>
                </ul>
              </div>
              <div className="bg-[#1e293b] border border-cyan-900 rounded-lg p-4 text-sm">
                <div className="mb-2 text-cyan-300 font-semibold">
                  Sample Request
                </div>
                <pre className="bg-[#0f172a] rounded p-2 text-cyan-200 overflow-x-auto">
{`POST /api/predict
Headers:
  Authorization: Bearer <your-access-token>
  x-api-key: <your-api-key>
Body:
  {
    "fever": 1,
    "chills": 0,
    "age": 25,
    "weight": 70,
    ...
  }
`}
                </pre>
              </div>
            </section>

            {/* Best Practices */}
            <section
              id="best-practices"
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-xl font-bold mb-2 text-fuchsia-400">
                Best Practices
              </h2>
              <ul className="list-disc ml-6 space-y-1 text-cyan-200">
                <li>Always keep your API key and user credentials secure.</li>
                <li>Validate all input data before sending to the API.</li>
                <li>Review AI predictions with clinical judgment.</li>
                <li>Use HTTPS for all API requests.</li>
              </ul>
            </section>

            {/* Resources */}
            <section id="resources" className="scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 text-fuchsia-400">
                Resources
              </h2>
              <ul className="list-disc ml-6 space-y-1 text-cyan-200">
                <li>
                  <Link
                    href="/our-source"
                    className="text-cyan-400 underline hover:text-fuchsia-400"
                  >
                    Drug guideline sources
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/triskyi/predoc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline hover:text-fuchsia-400"
                  >
                    GitHub repository
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@predoc.com"
                    className="text-cyan-400 underline hover:text-fuchsia-400"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
