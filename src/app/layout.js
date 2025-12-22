import { Chewy, Outfit } from "next/font/google";
import "./globals.css";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chewy",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Fulala - Old School New Soul",
  description: "Comfort Chinese dishes in Prague",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${chewy.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
