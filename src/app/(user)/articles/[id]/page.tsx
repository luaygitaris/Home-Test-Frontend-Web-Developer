"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    username: string;
  };
};

type RelatedArticle = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
};

export default function ArticleDetail() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch main article
        const articleResponse = await fetch(
          `https://test-fe.mysellerpintar.com/api/articles/${params.id}`
        );
        if (!articleResponse.ok) {
          throw new Error("Article not found");
        }
        const articleData = await articleResponse.json();
        setArticle(articleData);

        if (articleData?.category?.id) {
          const relatedResponse = await fetch(
            `https://test-fe.mysellerpintar.com/api/articles?categoryId=${articleData.category.id}&limit=3`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();

            setRelatedArticles(
              (relatedData.data as RelatedArticle[])
                .filter((a) => a.id !== String(params.id))
                .slice(0, 3)
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-0">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-xs sm:text-base">
          {error}
        </div>
        <Link
          href="/articles"
          className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-base">
          Back to Articles
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-0">
        <p className="text-gray-500 mb-4 text-xs sm:text-base">
          Article not found
        </p>
        <Link
          href="/articles"
          className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-base">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{article.title} | My Blog</title>
        <meta name="description" content={article.content.substring(0, 160)} />
      </Head>

      <main className="container mx-auto py-6 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/articles"
            className="text-blue-500 hover:text-blue-700 mb-2 sm:mb-4 inline-block text-xs sm:text-base">
            ← Back to Articles
          </Link>

          <article className="bg-white rounded-lg shadow-md overflow-hidden mb-6 sm:mb-8">
            <div className="h-56 sm:h-96 relative">
              <Image
                src={article.imageUrl || "/tshirt.jpg"}
                alt={article.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/tshirt.jpg";
                  target.onerror = null;
                }}
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                  {article.category.name}
                </span>
                <time className="text-gray-500 text-xs sm:text-sm">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <h1 className="text-lg sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                {article.title}
              </h1>

              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-gray-600 text-xs sm:text-base">
                    {article.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium text-xs sm:text-base">
                    {article.user.username}
                  </p>
                </div>
              </div>

              <div
                className="prose max-w-none text-xs sm:text-base"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>
          {relatedArticles.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <h2 className="text-base sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                More in {article.category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.id}`}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 sm:h-48 relative">
                      <Image
                        src={related.imageUrl || "/tshirt.jpg"}
                        alt={related.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/tshirt.jpg";
                          target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
                        {related.title}
                      </h3>
                      <time className="text-gray-500 text-[10px] sm:text-xs">
                        {new Date(related.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
