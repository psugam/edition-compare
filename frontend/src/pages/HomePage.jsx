import React from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Filter } from "lucide-react";

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-gray-900 mb-4">
          Classical Text Editions Database
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare and analyze editions of ancient Greek, Latin, and Sanskrit
          texts
        </p>
        <Link
          to="/search"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Browse Texts
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Search className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search Texts
          </h3>
          <p className="text-gray-600 text-sm">
            Search through our comprehensive database of classical works by
            title, author, or language.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Filter className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Filter Editions
          </h3>
          <p className="text-gray-600 text-sm">
            Filter editions by publication date, commentary, translations,
            public domain status, and more.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compare Editions
          </h3>
          <p className="text-gray-600 text-sm">
            View detailed information about manuscripts, editors, reviews, and
            access options for each edition.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">
          About This Database
        </h2>
        <p className="text-gray-700 mb-4">
          This database provides scholars and students with a comprehensive tool
          for comparing different editions of classical texts. Each entry
          includes detailed information about editors, manuscripts used,
          available translations, commentary, and scholarly reviews.
        </p>
        <p className="text-gray-700">
          Whether you're researching textual variants, seeking the best edition
          for your needs, or exploring public domain resources, this database
          helps you make informed decisions about which editions to consult.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
