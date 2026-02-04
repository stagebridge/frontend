import CountryPicker from "../components/Home/CountryPicker";
import HotIssueSection from "../components/Home/HotIssueSection";
import RankingSection from "../components/Home/RankingSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="pb-16">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <CountryPicker />
        <HotIssueSection />
        <RankingSection />
      </div>
      <Footer />
    </main>
  );
}
