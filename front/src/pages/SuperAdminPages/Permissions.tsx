import { UserCheck } from "lucide-react";

export function Permissions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <UserCheck className="w-8 h-8 text-purple-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access Control</h3>
          <p className="text-gray-600">Manage user roles and permissions across the platform</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Super Administrator</h4>
                <p className="text-sm text-gray-600">Full system access and control</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Full Access
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Restaurant Administrator</h4>
                <p className="text-sm text-gray-600">Manage restaurant-specific data and users</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Limited Access
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Regular User</h4>
                <p className="text-sm text-gray-600">Basic user permissions for app usage</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Basic Access
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
