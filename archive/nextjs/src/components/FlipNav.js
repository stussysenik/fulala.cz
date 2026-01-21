"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FlipNav({ prev, next }) {
        // Styles for the arrows
        const arrowStyle = {
                position: "fixed",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "var(--color-fulala-red)",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "20px",
                textShadow: "2px 2px 0px var(--color-dough-white), 4px 4px 0px var(--color-ink-black)",
        };

        return (
                <>
                        {prev && (
                                <Link href={prev}>
                                        <motion.button
                                                style={{ ...arrowStyle, left: "10px" }}
                                                whileHover={{ scale: 1.1, x: -10 }}
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                aria-label="Previous Page"
                                        >
                                                &lt;
                                        </motion.button>
                                </Link>
                        )}
                        {next && (
                                <Link href={next}>
                                        <motion.button
                                                style={{ ...arrowStyle, right: "10px" }}
                                                whileHover={{ scale: 1.1, x: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                aria-label="Next Page"
                                        >
                                                &gt;
                                        </motion.button>
                                </Link>
                        )}
                </>
        );
}
