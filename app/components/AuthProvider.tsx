// frontend/components/AuthProvider.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "../lib/fetcher";
import Image from "next/image";
import Loader from "../../public/loader.svg"

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (PUBLIC_ROUTES.includes(pathname)) {
        setChecking(false);
        return;
      }

      const res = await apiFetch("/api/auth/me");
      if (!res?.data?.user) {
        router.replace("/login");
      }
      setChecking(false);
    }
    checkAuth();
  }, [pathname, router]);

  if (checking)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-black text-white p-6 rounded-lg shadow">
          <Image src={Loader} alt="loader"></Image>
        </div>
      </div>
    );

  return <>{children}</>;
}
