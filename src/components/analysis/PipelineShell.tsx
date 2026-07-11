import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PipelineShellProps {
  children: ReactNode;
  index: number;
}

export const PipelineShell = ({ children, index }: PipelineShellProps) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
