'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../lib/fetcher';

export default function AuthHeader() {
  const [user, setUser] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const r = await apiFetch('/api/auth/me');
      setUser(r?.data?.user ?? null);
    }
    load();
  }, []);

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  // Get user initials from email
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  if (user === undefined) return null;

  return (
    <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* App Logo/Name */}
        <Link href="/" className="flex items-center gap-2 group justify-between">
          <div className="bg-linear-to-br from-blue-500 to-purple-600 p-2 rounded-lg 
                          shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Forecast Flow
          </h1>
        </Link>

        {/* Auth Section */}
        {!user ? (
          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-5 py-2 rounded-lg border border-white/20 text-white font-medium
                               hover:bg-white/5 hover:border-white/30
                               transition-all duration-200">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 
                               text-white font-semibold
                               hover:from-blue-500 hover:to-purple-500
                               shadow-lg hover:shadow-blue-500/50
                               transition-all duration-200">
                Sign up
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* User Avatar with Initials */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm 
                            border border-white/10 rounded-full pl-1 pr-4 py-1">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 
                              flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {getInitials(user.email)}
                </span>
              </div>
              <span className="text-sm text-gray-300 font-medium hidden sm:block">
                {user.email.split('@')[0]}
              </span>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 
                         text-red-400 font-medium
                         hover:bg-red-500/20 hover:border-red-500/50
                         active:scale-95
                         transition-all duration-200 cursor-pointer">
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
