"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function Home() {
   const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">ArticleHub</h1>
        {user ? (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button asChild variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              <Link href={user.role === "admin" ? "/articlesAdmin" : "/articles"}>
                Dashboard
              </Link>
            </Button>
            <Button 
              onClick={logout}
              disabled={loading}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button asChild variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto text-sm sm:text-base">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </nav>
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
          Manage Your Articles <br />
          <span className="text-blue-600">With Ease</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto">
          A powerful platform for creating, managing, and organizing articles with
          user and admin roles.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          {user ? (
            <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg">
              <Link href={user.role === "admin" ? "/articlesAdmin" : "/articles"}>
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg">
                <Link href="/login">Learn More</Link>
              </Button>
            </>
          )}
        </div>
      </section>
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Key Features</h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3">Role-Based Access</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Different permissions for Admins (create/edit) and Users (read).
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3">Article Management</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Create, edit, and organize articles with categories.
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3">Responsive Design</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Works perfectly on mobile, tablet, and desktop.
            </p>
          </div>
        </div>
      </section>
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t text-center text-xs sm:text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ArticleHub. All rights reserved.</p>
      </footer>
    </div>
  );
}