"use client"

import { motion } from "framer-motion"

export const FadeUp = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
      delay,
    }}
  >
    {children}
  </motion.div>
)
