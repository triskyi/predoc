"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  HeartPulse,
  Star,
  Users,
  ChevronRight,
  ShieldCheck,
  Brain,
  Globe,
  MessageCircle,
  Phone,
  Award,
  Smile,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, type: "spring" },
    }),
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c] text-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0a0f1c]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-2xl relative z-10"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-[#67e8f9] via-[#a21caf] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Smarter Healthcare
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-6 text-cyan-100 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            AI-powered disease detection, safe drug recommendations, and
            seamless patient management for modern clinics.
          </motion.p>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              className="text-lg px-8 py-3 shadow-xl bg-gradient-to-r from-[#a21caf] via-[#38bdf8] to-[#67e8f9] hover:from-[#38bdf8] hover:to-[#a21caf] text-white rounded-full transition-all duration-300"
              onClick={() => router.push("/login")}
            >
              Get Started Now <ChevronRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#0f172a]/80 text-cyan-200 font-semibold shadow border border-cyan-400">
            Trusted by clinics & professionals across Africa
          </span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <Lightbulb size={32} className="text-cyan-400" />,
              title: "AI Disease Detection",
              description:
                "Identify illnesses instantly with advanced AI analysis.",
            },
            {
              icon: <HeartPulse size={32} className="text-fuchsia-400" />,
              title: "Safe Drug Guidance",
              description: "Get evidence-based, safe medication suggestions.",
            },
            {
              icon: <Star size={32} className="text-yellow-400" />,
              title: "Symptom Checker",
              description:
                "Input symptoms and receive instant, reliable feedback.",
            },
            {
              icon: <Users size={32} className="text-indigo-400" />,
              title: "Patient Management",
              description:
                "Securely manage, track, and review patient history.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-[#111827] rounded-xl shadow-md p-6 flex flex-col items-center border border-[#334155]/40"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-cyan-100">
                {feature.title}
              </h3>
              <p className="text-cyan-200 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#0a0f1c]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-cyan-200">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={32} className="text-cyan-400" />,
                title: "1. Enter Patient Data",
                desc: "Add patient details and symptoms in a few clicks.",
              },
              {
                icon: <ShieldCheck size={32} className="text-fuchsia-400" />,
                title: "2. Get AI Prediction",
                desc: "Receive instant diagnosis and safe treatment suggestions.",
              },
              {
                icon: <Award size={32} className="text-yellow-400" />,
                title: "3. Track & Improve",
                desc: "Monitor outcomes and improve care with analytics.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#1e293b] rounded-xl shadow p-6 flex flex-col items-center border border-cyan-900/30"
              >
                <div className="mb-4">{step.icon}</div>
                <h4 className="font-semibold text-lg mb-2 text-cyan-100">
                  {step.title}
                </h4>
                <p className="text-cyan-200 text-center">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a0f1c]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Smile size={32} className="text-fuchsia-400" />,
              title: "User-Friendly",
              desc: "Designed for clinicians, nurses, and health workers of all tech levels.",
            },
            {
              icon: <Globe size={32} className="text-cyan-400" />,
              title: "Global Standards",
              desc: "Built on WHO and CDC guidelines for safe, reliable care.",
            },
            {
              icon: <ShieldCheck size={32} className="text-green-400" />,
              title: "Data Security",
              desc: "HIPAA-grade encryption and privacy for all patient records.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-[#111827] rounded-xl shadow p-6 flex flex-col items-center border border-[#334155]/40"
            >
              <div className="mb-4">{item.icon}</div>
              <h4 className="font-semibold text-lg mb-2 text-cyan-100">
                {item.title}
              </h4>
              <p className="text-cyan-200 text-center">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-4 bg-[#0a0f1c]">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-6 text-cyan-300">Trusted By</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            {/* Replace with real logos as needed */}
            <Image src="/logo.png" alt="Partner 1" width={100} height={40} />
            <Image src="/logo.png" alt="Partner 2" width={100} height={40} />
            <Image src="/logo.png" alt="Partner 3" width={100} height={40} />
            <Image src="/logo.png" alt="Partner 4" width={100} height={40} />
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: "10,000+", label: "Users Supported" },
            { value: "98%", label: "Diagnosis Accuracy" },
            { value: "5,000+", label: "Improved Outcomes" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-[#111827] rounded-xl shadow p-8 border border-cyan-900/30"
            >
              <div className="text-4xl font-bold text-cyan-300 animate-pulse">
                {metric.value}
              </div>
              <div className="mt-2 text-lg text-cyan-100">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-[#0a0f1c]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-cyan-200">
            What People Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#1e293b] rounded-xl shadow p-6 border border-cyan-900/30"
            >
              <TestimonialCard
                name="Dr. Namutebi"
                quote="This tool helps me avoid common medication errors. I wish we had this years ago!"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-[#1e293b] rounded-xl shadow p-6 border border-cyan-900/30"
            >
              <TestimonialCard
                name="Patient - Kampala"
                quote="The predictions were very close to what I had, and it saved me time at the hospital."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a0f1c]">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-cyan-100">
            Stay Updated
          </h2>
          <p className="mb-6 text-cyan-200">
            Subscribe to our newsletter for updates and health tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-cyan-700 bg-[#111827] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow"
              required
            />
            <Button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#a21caf] via-[#38bdf8] to-[#67e8f9] hover:from-[#38bdf8] hover:to-[#a21caf] text-white rounded-md shadow transition-all duration-300"
            >
              Subscribe
            </Button>
          </form>
        </motion.div>
      </section>

      {/* Contact Us CTA */}
      <section className="py-16 px-4 bg-[#0a0f1c]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-cyan-100">Contact Us</h2>
          <p className="mb-6 text-cyan-200">
            Have questions or want a demo? Reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:info@predoc.com"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#a21caf] to-[#38bdf8] hover:from-[#38bdf8] hover:to-[#a21caf] text-white rounded-md shadow transition-all duration-300"
            >
              <MessageCircle size={18} /> info@predoc.com
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] hover:bg-[#334155] text-cyan-200 rounded-md shadow transition-all duration-300"
            >
              <Phone size={18} /> +1 234 567 890
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
