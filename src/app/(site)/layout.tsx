import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LaunchHeader, LaunchFooter } from "@/components/launch/LaunchChrome";

/**
 * Launch mode: progressive chrome so Humans only see what they need.
 * Set LAUNCH_MINIMAL_CHROME=0 to restore full SiteHeader (legacy).
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const minimal = process.env.LAUNCH_MINIMAL_CHROME !== "0";

  if (minimal) {
    return (
      <>
        <LaunchHeader />
        <main>{children}</main>
        <LaunchFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
