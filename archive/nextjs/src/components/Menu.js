"use client";
import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
        { title: "Fulala Classic", description: "Pork & chive dumplings, steamed to perfection.", price: "185 Kč" },
        { title: "Tiger Heat", description: "Spicy Szechuan beef dumplings with chili oil.", price: "195 Kč" },
        { title: "Zen Garden", description: "Mushroom & tofu mix, light and earthy.", price: "175 Kč" },
        { title: "Golden Buns", description: "Crispy fried veggie buns.", price: "145 Kč" },
        { title: "Lucky Noodles", description: "Hand-pulled noodles with peanut sauce.", price: "210 Kč" },
        { title: "Cucumber Slaw", description: "Garlic, sesame oil, chili flakes.", price: "85 Kč" },
];

export default function Menu() {
        return (
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
                        <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                        fontSize: "clamp(3rem, 8vw, 5rem)",
                                        color: "var(--color-fulala-red)",
                                        textAlign: "center",
                                        marginBottom: "3rem",
                                        textShadow: "3px 3px 0px var(--color-ink-black)"
                                }}
                        >
                                MENU
                        </motion.h2>

                        <div style={{ display: "grid", gap: "2rem" }}>
                                {menuItems.map((item, i) => (
                                        <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{
                                                        borderBottom: "2px dashed var(--color-tiger-orange)",
                                                        paddingBottom: "1.5rem",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start",
                                                        flexWrap: "wrap",
                                                        gap: "10px"
                                                }}
                                        >
                                                <div style={{ flex: 1, minWidth: "200px" }}>
                                                        <h3 style={{ fontSize: "1.8rem", marginBottom: "0.2rem", color: "var(--color-ink-black)" }}>{item.title}</h3>
                                                        <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-soy-brown)", opacity: 0.9 }}>{item.description}</p>
                                                </div>
                                                <span style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)", color: "var(--color-fulala-red)" }}>{item.price}</span>
                                        </motion.div>
                                ))}
                        </div>
                </div>
        );
}
