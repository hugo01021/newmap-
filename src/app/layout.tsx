import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { WizardProvider } from "@/lib/wizard-store";
import { Cursor } from "@/components/ui/Cursor";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ServCraft — Décris ton serveur. L'IA le construit.",
    template: "%s — ServCraft",
  },
  description:
    "ServCraft crée ton serveur GTA V RP de A à Z grâce à l'IA. Décris-le en une phrase, on le construit, on le met en ligne et tu le gères depuis un panel.",
  metadataBase: new URL("https://servcraft.example"),
  openGraph: {
    title: "ServCraft — Décris ton serveur. L'IA le construit.",
    description:
      "Lance un serveur GTA V RP complet sans aucune compétence technique.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">
        <WizardProvider>
          {children}
          <Cursor />
        </WizardProvider>
      </body>
    </html>
  );
}
