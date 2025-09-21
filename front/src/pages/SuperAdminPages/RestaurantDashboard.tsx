import { BarChart3, ChefHat, Users } from "lucide-react";

export function RestaurantDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <ChefHat className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Management</h3>
          <p className="text-gray-600 mb-4">Update your restaurant menu, prices, and availability.</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Manage Menu
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Analytics</h3>
          <p className="text-gray-600 mb-4">Track your restaurant's performance and revenue.</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            View Analytics
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Reviews</h3>
          <p className="text-gray-600 mb-4">Monitor and respond to customer feedback.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
