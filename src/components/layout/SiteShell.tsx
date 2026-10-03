import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FinalCta } from "./FinalCta";

interface SiteShellProps {
  children: React.ReactNode;
  overlayNav?: boolean;
  finalCta?: boolean;
}

/** Enveloppe des pages « site » : navbar + contenu + section finale + pied de page. */
export function SiteShell({ children, overlayNav = false, finalCta = true }: SiteShellProps) {
  return (
    <>
      <Navbar overlay={overlayNav} />
      <main className={overlayNav ? "" : "pt-16 sm:pt-[72px]"}>{children}</main>
      {finalCta && <FinalCta />}
      <Footer />
    </>
  );
}
