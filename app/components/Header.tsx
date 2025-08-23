"use client";

import React from "react";
import { STUDENT_NUMBER } from "../constants";
import HamburgerMenu from "./HamburgerMenu";
import ThemeToggle from "./ThemeToggle";
import Tabs from "./Tabs";

export default function Header(): JSX.Element {
  return (
    <header className="relative">
      {/* Student Number - Top Left Corner */}
      <div className="fixed top-3 left-3 z-50 select-none" aria-label="Student Number">
        <span className="rounded-md px-2 py-1 text-xs font-semibold border shadow-sm" style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
          borderColor: 'rgba(128,128,128,0.35)'
        }}>
          {STUDENT_NUMBER}
        </span>
      </div>

      {/* Theme Toggle and Hamburger Menu - Top Right Corner */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-3">
        <ThemeToggle />
        <HamburgerMenu />
      </div>

      {/* Main Header Section with Background */}
      <div className="border-b border-[--foreground]/10 py-8 mb-6 bg-gray-50 dark:bg-gray-800 pt-16" style={{ backgroundColor: 'var(--header-bg, #f8f9fa)' }}>
        <div className="flex justify-center">
          <h1 className="text-5xl font-extrabold transition-colors duration-200 text-center cursor-default hover:text-blue-600" style={{ color: 'var(--foreground)' }}>
            Tabs Generator
          </h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-4">
        <Tabs />
      </div>
    </header>
  );
}
