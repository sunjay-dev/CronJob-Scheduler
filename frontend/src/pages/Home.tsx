import { HomeHeader, Hero, Features, HomeFooter } from "../components";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-[Inter] selection:bg-purple-400 selection:text-white">
      <HomeHeader home={true} />
      <Hero />
      <Features />
      <HomeFooter />
    </div>
  );
}
