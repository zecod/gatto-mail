import HomeEmailFinder from "@/components/ui/app/email-finder";
import HomeHeroSection from "@/components/ui/app/hero-section";
import HomeNavbar from "@/components/ui/app/nav-bar";

export default function Home() {
  return (
    <div className="max-w-[1000px] m-auto">
      <HomeNavbar />
      <HomeHeroSection />

      <HomeEmailFinder />
    </div>
  );
}
