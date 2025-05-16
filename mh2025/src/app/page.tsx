import Image from "next/image";
import GetHelpBanner from "@/components/GetHelpBanner";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Support Platform</h1>
      <GetHelpBanner />
    </main>
  );
}
