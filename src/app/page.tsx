"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb, HeartPulse, Star, Users, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import TestimonialCard from "@/components/TestimonialCard";

export default function Home() {
  const router = useRouter();

  // Animation variants for sections
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, type: "spring" },
    }),
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-2xl"
        >
          <motion.h1
            className="text-5xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to PREDOC
          </motion.h1>
          <motion.p
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            AI-powered disease detection and safe drug recommendations for
            better healthcare outcomes.
          </motion.p>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              className="text-lg px-8 py-3 shadow-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
              onClick={() => router.push("/login")}
            >
              Get Started Now <ChevronRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <Lightbulb size={32} />,
              title: "Disease Detection",
              description:
                "Identify illnesses quickly with AI-driven analysis.",
            },
            {
              icon: <HeartPulse size={32} />,
              title: "Treatment Recommendations",
              description: "Get safe, guideline-based drug suggestions.",
            },
            {
              icon: <Star size={32} />,
              title: "Symptom Checker",
              description: "Input symptoms and receive instant feedback.",
            },
            {
              icon: <Users size={32} />,
              title: "Patient Data Management",
              description: "Securely manage and review patient history.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4">The Challenge</h2>
            <p className="text-lg">
              Many regions face delays, errors, and inefficiencies in healthcare
              due to paper-based records, limited training, and high patient
              loads.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
            <p className="text-lg">
              PREDOC empowers clinicians with instant, AI-powered insights,
              reducing errors and improving patient outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
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
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                {metric.value}
              </div>
              <div className="mt-2 text-lg">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
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
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">
            Subscribe to our newsletter for updates and health tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <Button type="submit" className="px-6 py-2">
              Subscribe
            </Button>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
