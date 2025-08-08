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

        // Fetch related articles from same category
        if (articleData?.category?.id) {
          const relatedResponse = await fetch(
            `https://test-fe.mysellerpintar.com/api/articles?categoryId=${articleData.category.id}&limit=3`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current article
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          href="/articles"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Articles
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Article not found</p>
        <Link
          href="/articles"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/articles"
            className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
            ← Back to Articles
          </Link>

          <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-96 relative">
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

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {article.category.name}
                </span>
                <time className="text-gray-500 text-sm">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-600">
                    {article.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    {article.user.username}
                  </p>
                </div>
              </div>

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                More in {article.category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.id}`}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 relative">
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
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {related.title}
                      </h3>
                      <time className="text-gray-500 text-xs">
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
