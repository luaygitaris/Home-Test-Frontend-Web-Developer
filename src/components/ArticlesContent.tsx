"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Head from "next/head";
import axios from "axios";
import PaginationUser from "@/components/PaginationUser";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

type Article = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    username: string;
  };
};

type ApiResponse = {
  data: Article[];
  total: number;
  page: number;
  limit: number;
};

const ITEMS_PER_PAGE = 9;
const API_URL = "https://test-fe.mysellerpintar.com/api/articles";
const DEBOUNCE_DELAY = 400;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const allCategories = [
    "all",
    ...new Set(articles.map((article) => article.category.name)),
  ];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse>("/", {
        params: {
          limit: 9999,
          page: 1,
        },
      });

      const { data } = response;

      setArticles(data.data);
      setFilteredArticles(data.data);
      setPagination({
        total: data.data.length,
        page: 1,
        totalPages: Math.ceil(data.data.length / ITEMS_PER_PAGE),
      });
    } catch (err) {
      let errorMessage = "Failed to load articles";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const page = searchParams.get("page");

    if (search) setSearchTerm(search);
    if (category) setSelectedCategory(category);
    if (page) {
      const pageNum = parseInt(page);
      if (!isNaN(pageNum)) {
        setPagination((prev) => ({
          ...prev,
          page: pageNum,
        }));
      }
    }
  }, [searchParams]);

  const debouncedSearch = useCallback((value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setSearchTerm(value);
    }, DEBOUNCE_DELAY);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const applyFilters = useCallback(() => {
    let results = articles;

    if (searchTerm) {
      results = results.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      results = results.filter(
        (article) => article.category.name === selectedCategory
      );
    }

    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    const currentPage = pagination.page > totalPages ? 1 : pagination.page;

    setFilteredArticles(results);
    setPagination((prev) => ({
      ...prev,
      total: results.length,
      totalPages,
      page: currentPage,
    }));

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");

    if (selectedCategory !== "all") params.set("category", selectedCategory);
    else params.delete("category");

    if (currentPage > 1) params.set("page", currentPage.toString());
    else params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    searchTerm,
    selectedCategory,
    articles,
    searchParams,
    pathname,
    router,
    pagination.page,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Paginate results
  useEffect(() => {
    const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedArticles(filteredArticles.slice(startIndex, endIndex));
  }, [filteredArticles, pagination.page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = value;
    debouncedSearch(value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Articles</title>
        <meta
          name="description"
          content="Browse articles with search and category filters"
        />
      </Head>

      <main className="container mx-auto py-6 px-2 sm:px-4">
        <Link href="/" className="text-sm sm:text-base">
          Home
        </Link>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Articles
        </h1>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search articles..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-base w-full md:w-auto"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-500 mb-4 text-xs sm:text-base">{error}</p>
              <button
                onClick={handleRetry}
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
                <h2 className="text-base sm:text-xl font-semibold text-gray-800">
                  Showing {paginatedArticles.length} of{" "}
                  {filteredArticles.length}{" "}
                  {filteredArticles.length === 1 ? "Result" : "Results"}
                </h2>
                {pagination.totalPages > 1 && (
                  <div className="text-xs sm:text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                )}
              </div>

              {paginatedArticles.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500 text-xs sm:text-base">
                  No articles found matching your filters.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {paginatedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <PaginationUser
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
