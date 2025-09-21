import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Your App</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover amazing restaurants, save your favorites, and manage your dining experiences all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            Get Started
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Favorites</h3>
          <p className="text-gray-600">
            Keep track of your favorite restaurants and never forget that perfect dining spot.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Rate & Review</h3>
          <p className="text-gray-600">
            Share your experiences and help others discover great places to eat.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Nearby</h3>
          <p className="text-gray-600">
            Discover restaurants near you with our location-based search feature.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of food lovers who are already using our platform to discover and share amazing dining experiences.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Sign Up Now
        </button>
      </div>
    </div>
  );
}