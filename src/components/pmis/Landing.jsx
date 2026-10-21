import AccessibilityBar from "./AccessibilityBar";
import Header from "./Header";
import NoticeBar from "./NoticeBar";
import BannerCarousel from "./BannerCarousel";
import StateDashboard from "./StateDashboard";
import FeaturedInternships from "./FeaturedInternships";
import Footer from "./Footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div>
      <AccessibilityBar />
      <Header />
      <main>
        <NoticeBar />
        <BannerCarousel />
        <StateDashboard />
        <FeaturedInternships />
      </main>
      <Footer />
    </div>
  );
}
