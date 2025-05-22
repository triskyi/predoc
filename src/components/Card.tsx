import { motion } from "framer-motion";

export default function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white dark:bg-gray-700 shadow rounded-xl"
    >
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}