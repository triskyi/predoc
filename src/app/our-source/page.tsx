import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OurSourcePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c] text-cyan-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto py-16 px-4">
        <div className="rounded-2xl bg-[#111827]/80 border border-cyan-900 shadow-xl p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-cyan-300 tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
              Our Drug Guideline Sources
            </span>
          </h1>
          <p className="mb-4 text-cyan-200">
            PREDOC uses evidence-based drug guidelines from trusted sources to
            ensure safe and effective recommendations.
          </p>
          <ul className="list-disc ml-6 mb-8 space-y-2">
            <li>
              <a
                href="/pdfs/whomalaria-guidelines.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline hover:text-fuchsia-400"
              >
                WHO Guidelines for the Treatment of Malaria (PDF)
              </a>
            </li>
            <li>
              <a
                href="/pdfs/who-antimicrobial.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline hover:text-fuchsia-400"
              >
                WHO Model List of Essential Medicines (PDF)
              </a>
            </li>
            {/* Add more sources as needed */}
          </ul>
          <p className="text-cyan-200">
            For more, see our{" "}
            <a
              href="https://github.com/triskyi/predoc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-fuchsia-400"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
