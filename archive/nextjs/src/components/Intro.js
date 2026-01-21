"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Intro() {
        return (
                <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        textAlign: "center",
                        padding: "20px",
                        position: "relative"
                }}>
                        <motion.div
                                initial={{ opacity: 0, y: 50, rotate: -5 }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{ duration: 0.8, type: "spring" }}
                                style={{ marginBottom: "2rem" }}
                        >
                                {/* Placeholder for mascot - using the first uploaded image which seemed to be the tiger */}
                                <div style={{ position: "relative", width: "300px", height: "300px" }}>
                                        <Image
                                                src="/images/uploaded_image_1_1766427332403.png"
                                                alt="Fulala Tiger Mascot"
                                                fill
                                                style={{ objectFit: "contain" }}
                                                priority
                                        />
                                </div>
                        </motion.div>

                        <motion.h1
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 10 }}
                                style={{
                                        fontSize: "clamp(4rem, 15vw, 10rem)",
                                        color: "var(--color-fulala-red)",
                                        lineHeight: 0.8,
                                        marginBottom: "1rem",
                                        textShadow: "4px 4px 0px var(--color-ink-black)",
                                        zIndex: 10
                                }}
                        >
                                FULALA
                        </motion.h1>

                        <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                style={{
                                        fontSize: "1.2rem",
                                        maxWidth: "400px",
                                        color: "var(--color-soy-brown)",
                                        fontWeight: "bold",
                                }}
                        >
                                <p>Rituals of Joy.</p>
                                <p>Comfort Chinese Dishes.</p>
                        </motion.div>
                </div>
        );
}
