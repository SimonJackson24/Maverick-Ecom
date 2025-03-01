import React, { useState, useEffect } from 'react';
import { CustomerSupportService, FAQArticle, FAQCategory } from '../../services/support/CustomerSupportService';
import { useDebounce } from '../../hooks/useDebounce';

export const FAQ: React.FC = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<FAQArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportService = CustomerSupportService.getInstance();
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await supportService.getFAQCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err) {
        setError('Failed to load FAQ categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const results = await supportService.searchFAQ(debouncedSearch);
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search FAQ articles');
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleArticleClick = async (articleId: string) => {
    try {
      setIsLoading(true);
      const article = await supportService.getFAQArticle(articleId);
      setSelectedArticle(article);
    } catch (err) {
      setError('Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleRating = async (articleId: string, helpful: boolean) => {
    try {
      const updatedArticle = await supportService.rateFAQArticle(articleId, helpful);
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(updatedArticle);
      }
    } catch (err) {
      setError('Failed to rate article');
    }
  };

  const renderArticleList = () => {
    const articles = searchQuery
      ? searchResults
      : categories.find((c) => c.id === selectedCategory)?.articles || [];

    if (articles.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No articles found' : 'No articles in this category'}
        </div>
      );
    }

    return (
      <ul className="divide-y divide-gray-200">
        {articles.map((article) => (
          <li key={article.id}>
            <button
              onClick={() => handleArticleClick(article.id)}
              className="w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <h3 className="text-sm font-medium text-gray-900">{article.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {article.content.substring(0, 150)}...
              </p>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Find answers to common questions or create a support ticket if you need more help.
        </p>

        {/* Search */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500" />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Categories */}
            {!searchQuery && (
              <div className="p-6 border-r border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Categories</h2>
                <nav className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        selectedCategory === category.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Article List */}
            <div
              className={`border-t md:border-t-0 ${
                searchQuery ? 'md:col-span-4' : 'md:col-span-3'
              }`}
            >
              {selectedArticle ? (
                <div className="p-6">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to list
                  </button>
                  <article className="mt-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedArticle.title}
                    </h2>
                    <div
                      className="mt-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900">
                        Was this article helpful?
                      </h3>
                      <div className="mt-2 flex space-x-4">
                        <button
                          onClick={() => handleArticleRating(selectedArticle.id, true)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg
                            className="-ml-0.5 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          Yes ({selectedArticle.helpful})
                        </button>
                        <button
                          onClick={() => handleArticleRating(selectedArticle.id, false)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg
                            className="-ml-0.5 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                          No ({selectedArticle.notHelpful})
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                renderArticleList()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
