import Navbar from '../components/sections/Navbar'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import ArchitectureSection from '../components/sections/ArchitectureSection'
import TechStackSection from '../components/sections/TechStackSection'
import WorkflowSection from '../components/sections/WorkflowSection'
import CTASection from '../components/sections/CTASection'
import ContactSection from '../components/sections/ContactSection'


export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.2),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.85)_0%,rgba(15,23,42,0.96)_45%,rgba(15,23,42,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.12),transparent_60%)]" />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <TechStackSection />
        <WorkflowSection />
        <CTASection />
        <ContactSection />
      </main>
    </div>
  )
}
