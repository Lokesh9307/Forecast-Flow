import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ClientHome from "./components/Home";

export const runtime = "edge";
export const preferredRegion = ["bom1"]; 
export const dynamic = "force-dynamic";  

async function getCities() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";


  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${base}/api/cities`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Page() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Weather Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track weather conditions across multiple cities in real-time
          </p>
        </div>

        {/* The interactive part lives in a tiny client component */}
        <ClientHome initialCities={cities} />
      </div>
    </div>
  );
}
