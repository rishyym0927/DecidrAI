/**
 * User Profile Page
 * User's saved tools, flow history, and preferences
 */

'use client';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <div className="border rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold">{/* User name */}</h2>
              <p className="text-gray-600">{/* Email */}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Flows Completed</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Tools Saved</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Comparisons Made</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b flex gap-4">
              <button className="px-4 py-2 border-b-2 border-black dark:border-white font-semibold">
                Saved Tools
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-black dark:hover:text-white">
                Flow History
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-black dark:hover:text-white">
                Preferences
              </button>
            </div>
          </div>

          {/* Saved Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map saved tools */}
          </div>
        </div>
      </div>
    </div>
  );
}
