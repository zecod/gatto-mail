
import HomeFooter from "@/components/ui/app/home-footer";
import HomeHeroSection from "@/components/ui/app/hero-section";
import HomeContent from "@/components/ui/app/home-content";
import HomeNavbar from "@/components/ui/app/nav-bar";
import HomeTabsManager from "@/components/ui/app/tabs-manager";

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto">
      <HomeNavbar />
      <HomeHeroSection />
      <HomeTabsManager />
      <HomeContent />
      <HomeFooter />
    </div>
  );
}
