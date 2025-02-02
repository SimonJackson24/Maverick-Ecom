import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_SUGGESTIONS } from '../../services/searchQueries';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'search';
  url: string;
  category?: {
    id: string;
    name: string;
    urlKey: string;
  };
  product?: {
    id: string;
    name: string;
    urlKey: string;
    price: number;
    images: {
      url: string;
      alt: string;
    }[];
  };
}

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const [getSuggestions, { data, loading }] = useLazyQuery(SEARCH_SUGGESTIONS, {
    variables: { query: debouncedQuery },
  });

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSuggestions();
    }
  }, [debouncedQuery, getSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.product?.urlKey}`);
    } else if (suggestion.type === 'category') {
      navigate(`/products/${suggestion.category?.urlKey}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="max-h-96 overflow-y-auto py-2">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading suggestions...</div>
            ) : data?.searchSuggestions?.length > 0 ? (
              <div>
                {data.searchSuggestions.map((suggestion: SearchSuggestion, index: number) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {suggestion.type === 'product' && suggestion.product && (
                      <div className="flex items-center space-x-3">
                        <img
                          src={suggestion.product.images[0]?.url}
                          alt={suggestion.product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.product.name}</div>
                          <div className="text-sm text-gray-500">
                            ${suggestion.product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                    {suggestion.type === 'category' && suggestion.category && (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-900">{suggestion.category.name}</span>
                      </div>
                    )}
                    {suggestion.type === 'search' && (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-900">{suggestion.text}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No suggestions found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
