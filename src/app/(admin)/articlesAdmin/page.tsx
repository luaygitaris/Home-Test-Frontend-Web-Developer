"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "@/lib/axiosInstance";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

const API_BASE_URL = "https://test-fe.mysellerpintar.com/api";
const ARTICLES_URL = `${API_BASE_URL}/articles`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;

// Validasi
const articleFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(5000),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Invalid URL").optional(),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;
type Article = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
};
type Category = { id: string; name: string };

export default function AdminArticlesPage() {
  // const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ArticleFormValues | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handlePreview = (data: ArticleFormValues) => {
    setPreviewData(data);
    setShowPreview(true);
  };

  const handleEditFromPreview = () => {
    setShowPreview(false);
  };

  const handleSubmitFromPreview = async () => {
    if (!previewData) return;

    try {
      setIsSubmitting(true);
      if (currentArticle) {
        await axios.put(`${ARTICLES_URL}/${currentArticle.id}`, previewData);
        toast.success("Article updated successfully");
      } else {
        await axios.post(ARTICLES_URL, previewData);
        toast.success("Article created successfully");
      }
      fetchData(currentPage);
      setOpenDialog(false);
      setShowPreview(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: { title: "", content: "", categoryId: "", imageUrl: "" },
  });

  // Fetch data
  const fetchData = async (page: number) => {
    try {
      setIsLoading(true);
      const [articlesRes, categoriesRes] = await Promise.all([
        axios.get(ARTICLES_URL, {
          params: {
            limit: limit,
            page: page,
          },
        }),
        axios.get(CATEGORIES_URL),
      ]);

      setArticles(articlesRes.data.data);
      setTotalPages(Math.ceil(articlesRes.data.total / limit));
      setCategories(categoriesRes.data.data || categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...articles];

    if (selectedCategory !== "all") {
      result = result.filter(
        (article) => article.categoryId === selectedCategory
      );
    }

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.category.name.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(result);
  }, [articles, selectedCategory, debouncedSearchQuery]); // Changed from searchQuery to debouncedSearchQuery

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (currentArticle) {
      form.reset({
        title: currentArticle.title,
        content: currentArticle.content,
        categoryId: currentArticle.categoryId,
        imageUrl: currentArticle.imageUrl || "",
      });
    } else {
      form.reset({
        title: "",
        content: "",
        categoryId: "",
        imageUrl: "",
      });
    }
  }, [currentArticle, form]);

  const handleDelete = async () => {
    if (!currentArticle) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${ARTICLES_URL}/${currentArticle.id}`);
      toast.success("Article deleted successfully");
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      setCurrentArticle(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <Link href="/" className="text-sm sm:text-base">
          Home
        </Link>
        <h1 className="text-lg sm:text-2xl font-bold text-center md:text-left">
          Manage Articles
        </h1>
        <button
          onClick={() => {
            setCurrentArticle(null);
            setOpenDialog(true);
          }}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto text-sm sm:text-base"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Article
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto text-sm sm:text-base"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Created At
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Updated At
                </th>
                <th className="px-2 flex sm:px-4 py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm sm:w-1/4">
                      {article.title}
                    </td>
                    <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                      {article.category.name}
                    </td>
                    <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="flex justify-end items-end px-2 sm:px-4 sm:w-fit py-4 text-right space-x-2 text-xs sm:text-sm">
                      <button
                        onClick={() => {
                          setCurrentArticle(article);
                          setOpenViewDialog(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentArticle(article);
                          setOpenDialog(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentArticle(article);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500 text-xs sm:text-sm"
                  >
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 text-xs sm:text-sm">
        <div className="text-gray-500">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-base">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-xl font-semibold">
                {currentArticle ? "Edit Article" : "Add New Article"}
              </h2>
              <button
                onClick={() => setOpenDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {!showPreview ? (
              <form
                onSubmit={form.handleSubmit(handlePreview)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    {...form.register("title")}
                    placeholder="Article title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    {...form.register("content")}
                    placeholder="Article content"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="categoryId"
                    {...form.register("categoryId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium mb-1"
                  >
                    Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    {...form.register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.imageUrl && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.imageUrl.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={form.handleSubmit(handlePreview)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    )}
                    {currentArticle ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-2">
                    {previewData?.title}
                  </h3>
                  {previewData?.imageUrl && (
                    <Image
                      src={previewData.imageUrl}
                      alt={previewData.title}
                      width={600}
                      height={400}
                      className="max-h-64 w-full object-contain mb-4"
                    />
                  )}
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: previewData?.content || "",
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    Category:{" "}
                    {
                      categories.find((c) => c.id === previewData?.categoryId)
                        ?.name
                    }
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={handleEditFromPreview}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSubmitFromPreview}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    )}
                    Confirm {currentArticle ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-xs sm:text-base">
            <h2 className="text-base sm:text-xl font-semibold mb-2">Are you sure?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. This will permanently delete the article.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {openViewDialog && currentArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-base">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-xl font-semibold">View Article</h2>
              <button
                onClick={() => setOpenViewDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{currentArticle.title}</h3>
                <p className="text-sm text-gray-500">
                  Category: {currentArticle.category.name}
                </p>
              </div>

              {currentArticle.imageUrl && (
                <div className="my-4">
                  <Image
                    src={currentArticle.imageUrl}
                    alt={currentArticle.title}
                    width={500}
                    height={300}
                    className="max-h-64 w-full object-contain rounded-md"
                  />
                </div>
              )}

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              />

              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>
                  Created: {new Date(currentArticle.createdAt).toLocaleString()}
                </span>
                <span>
                  Updated: {new Date(currentArticle.updatedAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
