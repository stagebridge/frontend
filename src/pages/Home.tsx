import CountryPicker from "../components/Home/CountryPicker";
import HotIssueSection from "../components/Home/HotIssueSection";
import RankingSection from "../components/Home/RankingSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] sb-home-top-gradient"
      />

      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="sb-animate-rise">
          <CountryPicker />
        </div>
        <div className="sb-animate-rise sb-animate-delay-1">
          <HotIssueSection />
        </div>
        <div className="sb-animate-rise sb-animate-delay-2">
          <RankingSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}
