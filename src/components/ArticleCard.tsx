"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  category: {
    name: string;
  };
  user: {
    username: string;
  };
};

export default function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);
  const maxContentLength = 100; // Maximum characters before showing "Read More"
  
  // Function to safely render HTML content
  const renderHTML = (html: string) => {
    return { __html: html };
  };

  // Strip HTML tags for content preview
  const strippedContent = article.content.replace(/<[^>]*>?/gm, '');
  const shouldTruncate = strippedContent.length > maxContentLength;
  const displayContent = expanded 
    ? strippedContent 
    : shouldTruncate 
      ? strippedContent.substring(0, maxContentLength) + '...' 
      : strippedContent;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image Container - Fixed Height */}
      <div className="h-48 relative">
        <Link href={`/articles/${article.id}`} passHref>
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            className="hover:opacity-90 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/tshirt.jpg";
              target.onerror = null;
              target.className = "w-full h-full object-cover bg-gray-200";
            }}
          />
        </Link>
      </div>

      {/* Content Container - Flexible but constrained */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/articles/${article.id}`} passHref>
            <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {article.category.name}
          </span>
        </div>

        {/* Text Content with Read More */}
        <div className="mb-3 flex-grow">
          <p className="text-sm text-gray-500 line-clamp-3">
            {displayContent}
          </p>
          {shouldTruncate && !expanded && (
            <button 
              onClick={() => setExpanded(true)}
              className="text-blue-500 text-sm mt-1 hover:underline focus:outline-none"
            >
              Read More
            </button>
          )}
          {expanded && (
            <button 
              onClick={() => setExpanded(false)}
              className="text-blue-500 text-sm mt-1 hover:underline focus:outline-none"
            >
              Show Less
            </button>
          )}
        </div>

        {/* Footer - Fixed Height */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>By {article.user.username}</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}