import { motion } from "framer-motion";

export default function TestimonialCard({
  name,
  quote,
}: {
  name: string;
  quote: string;
}) {
  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow"
    >
      <p className="italic">&quot;{quote}&quot;</p>
      <p className="mt-2 font-bold">- {name}</p>
    </motion.div>
  );
}
