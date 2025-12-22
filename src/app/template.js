"use client";
import { motion } from "framer-motion";

export default function Template({ children }) {
        return (
                <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ ease: "easeInOut", duration: 0.5 }}
                        style={{
                                background: "var(--color-dough-white)",
                                minHeight: "100vh"
                        }}
                >
                        {children}
                </motion.div>
        );
}
