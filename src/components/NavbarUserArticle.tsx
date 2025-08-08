// components/Navbar.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/lib/types';
import { useEffect, useState } from 'react';

interface NavbarProps {
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
}

export default function Navbar({ categories, initialSearch = '', initialCategory = '' }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State untuk input pencarian dan kategori
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');

  // Update state ketika URL berubah (misal dari navigasi browser)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('categoryId') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Tambahkan parameter search jika ada
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    
    // Tambahkan parameter category jika dipilih
    if (selectedCategory) {
      params.set('categoryId', selectedCategory);
    } else {
      params.delete('categoryId');
    }
    
    // Reset ke halaman pertama jika melakukan pencarian/filter baru
    params.delete('page');
    
    // Navigasi ke URL baru
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handler untuk input change (debounce opsional)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <form onSubmit={handleSearch} className="flex flex-1 space-x-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              name="categoryId"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}