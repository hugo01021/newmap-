import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { WizardProvider } from "@/lib/wizard-store";
import { LocaleProvider } from "@/lib/i18n/client";
import { getI18n } from "@/lib/i18n/server";
import { Cursor } from "@/components/ui/Cursor";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const ogLocales = { fr: "fr_FR", en: "en_US", es: "es_ES", de: "de_DE" } as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    title: { default: t.meta.title, template: "%s — ServCraft" },
    description: t.meta.description,
    metadataBase: new URL("https://servcraft.example"),
    openGraph: { title: t.meta.title, description: t.meta.ogDescription, type: "website", locale: ogLocales[locale] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, t } = await getI18n();
  return (
    <html lang={locale} className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-white">
        <LocaleProvider locale={locale} dictionary={t}>
          <WizardProvider>
            {children}
            <Cursor />
          </WizardProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
