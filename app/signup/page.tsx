// frontend/app/signup/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/fetcher";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = await apiFetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) setMsg(r.data?.error || "Signup failed");
    else router.push("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main container with neo-brutalism style */}
        <div className="relative">
          {/* Shadow layers for depth */}
          <div className="absolute inset-0 bg-cyan-400/20 translate-x-2 translate-y-2 border-4 border-cyan-400/30 rounded-none"></div>
          <div className="absolute inset-0 bg-purple-400/20 translate-x-1 translate-y-1 border-4 border-purple-400/30 rounded-none"></div>
          
          {/* Main card */}
          <div className="relative bg-zinc-900 border-4 border-zinc-100 p-8 rounded-none">
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-cyan-400/30 to-purple-400/30"></div>
            
            <h2 className="text-4xl font-black mb-8 text-zinc-100 uppercase tracking-tight">
              Sign Up
            </h2>
            
            <div className="flex flex-col gap-5">
              {/* Email input */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-4 bg-zinc-800 border-4 border-zinc-100 text-zinc-100 placeholder-zinc-500 font-bold text-lg focus:outline-none focus:border-cyan-400 focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                />
                <div className="absolute inset-0 bg-cyan-400/10 -z-10 translate-x-1 translate-y-1 border-4 border-cyan-400/20 pointer-events-none"></div>
              </div>
              
              {/* Password input */}
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-4 bg-zinc-800 border-4 border-zinc-100 text-zinc-100 placeholder-zinc-500 font-bold text-lg focus:outline-none focus:border-purple-400 focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                />
                <div className="absolute inset-0 bg-purple-400/10 -z-10 translate-x-1 translate-y-1 border-4 border-purple-400/20 pointer-events-none"></div>
              </div>
              
              {/* Submit button */}
              <div className="relative mt-2">
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-linear-to-r from-cyan-400 to-purple-400 text-zinc-950 font-black text-lg py-4 border-4 border-zinc-100 uppercase tracking-wider hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-transform rounded-none cursor-pointer"
                >
                  Create Account
                </button>
                <div className="absolute inset-0 bg-zinc-100 -z-10 translate-x-2 translate-y-2"></div>
              </div>
              
              {/* Error message */}
              {msg && (
                <div className="relative">
                  <div className="bg-red-500/20 border-4 border-red-400 p-4 text-red-300 font-bold rounded-none">
                    {msg}
                  </div>
                  <div className="absolute inset-0 bg-red-400/30 -z-10 translate-x-1 translate-y-1 border-4 border-red-400/40"></div>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-linear-to-tr from-cyan-400/20 to-transparent"></div>
            <div className="absolute top-1/2 right-0 w-2 h-16 bg-purple-400/30"></div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="mt-4 h-2 bg-linear-to-r from-cyan-400 via-purple-400 to-cyan-400"></div>
      </div>
    </div>
  );
}
