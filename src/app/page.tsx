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
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">ArticleHub</h1>
        {user ? (
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href={user.role === "admin" ? "/articlesAdmin" : "/articles"}>
                Dashboard
              </Link>
            </Button>
            <Button 
              onClick={logout} // Gunakan fungsi logout langsung
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Manage Your Articles <br />
          <span className="text-blue-600">With Ease</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          A powerful platform for creating, managing, and organizing articles with
          user and admin roles.
        </p>

        <div className="flex gap-4 justify-center">
          {user ? (
            <Button asChild size="lg">
              <Link href={user.role === "admin" ? "/articlesAdmin" : "/articles"}>
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Learn More</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
            <p className="text-gray-600">
              Different permissions for Admins (create/edit) and Users (read).
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Article Management</h3>
            <p className="text-gray-600">
              Create, edit, and organize articles with categories.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Responsive Design</h3>
            <p className="text-gray-600">
              Works perfectly on mobile, tablet, and desktop.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-gray-500">
        <p>© {new Date().getFullYear()} ArticleHub. All rights reserved.</p>
      </footer>
    </div>
  );
}