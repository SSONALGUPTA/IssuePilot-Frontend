import { useState } from 'react';

export default function Layout({ children, currentView, onViewChange, onLogout, theme, toggleTheme, user }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'issues', label: 'Issues', icon: '🐛' },
        { id: 'kanban', label: 'Kanban Board', icon: '📋' },
        { id: 'new-issue', label: 'New Issue', icon: '➕' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Sidebar */}
            <aside className={`bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl`}>
                <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-slate-800">
                    <div className={`font-bold text-xl tracking-wide ${!isSidebarOpen && 'hidden'}`}>
                        <span className="text-primary-400">Issue</span>Pilot
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-3">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                currentView === item.id 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                                : 'text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Theme Toggle & User */}
                <div className="p-4 border-t border-slate-700 dark:border-slate-800 space-y-4">
                     <button 
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 dark:bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'} {isSidebarOpen && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div>
                                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                                <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300">Sign Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 shadow-sm transition-colors duration-200">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 capitalize">
                        {navItems.find(i => i.id === currentView)?.label || (currentView === 'kanban' ? 'Kanban Board' : '')}
                    </h2>
                    <div className="flex items-center gap-4">
                        {/* Version removed */}
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
                <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p>Copyright © Sonal2026</p>
                    <a 
                        href="https://www.linkedin.com/in/sonal-gupta2004/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        LinkedIn Profile
                    </a>
                </footer>
            </main>
        </div>
    )
}
