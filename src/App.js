import React from 'react';
import HealthcareGraph from './components/HealthcareGraph';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">G</div>
        </div>
        {/* Icons */}
        <nav className="flex-1 flex flex-col gap-6 items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" role="presentation" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" role="presentation" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" role="presentation" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" role="presentation" />
        </nav>
        {/* User Avatar */}
        <div className="mt-8">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <div className="font-semibold text-gray-800">Emily Carter</div>
              <div className="text-xs text-gray-400">Leadgen.ai admin</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Create HCP</button>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400">🔔</span>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400">⋮</span>
            </div>
          </div>
        </header>
        {/* Main Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Info Card and Graph */}
          <HealthcareGraph />
        </main>
      </div>
    </div>
  );
}

export default App;
