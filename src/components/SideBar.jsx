import {
  Home,
  UserCircle,
  Car,
  Tags,
  Bookmark,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', value: 'dashboard' },
    { icon: <UserCircle size={20} />, label: 'Users', value: 'users' },
    { icon: <Car size={20} />, label: 'Vehicles', value: 'vehicles' },
    { icon: <Tags size={20} />, label: 'Categories', value: 'categories' },
    { icon: <Bookmark size={20} />, label: 'Marks', value: 'marks' }
  ];

  const handleLogout = () => {
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden group">
      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems?.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => setActiveTab(item.value)}
                className={`flex items-center w-full px-4 py-3 space-x-3 rounded-[10px] transition-all duration-200 ${
                  activeTab === item.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className={activeTab === item.value ? 'text-blue-700' : 'text-gray-500'}>
                  {item.icon}
                </div>
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 ">
                  {item.label}
                </span>
                {activeTab === item.value && (
                  <div className=" ml-auto h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full px-3 py-2 rounded-[10px] hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} />
          <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 hidden md:inline">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
