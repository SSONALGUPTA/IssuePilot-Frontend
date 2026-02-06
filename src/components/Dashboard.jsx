import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ onViewChange, onEdit }) {
    const [stats, setStats] = useState([
        { label: 'Total Issues', value: '0', color: 'bg-blue-500', icon: '📋' },
        { label: 'Open', value: '0', color: 'bg-green-500', icon: '🟢' },
        { label: 'Closed', value: '0', color: 'bg-slate-500', icon: '🏁' },
        { label: 'Critical', value: '0', color: 'bg-red-500', icon: '🔥' },
    ]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/issues');
                const issues = response.data;
                
                // Calculate stats
                const total = issues.length;
                const open = issues.filter(i => {
                    const s = i.status?.toLowerCase();
                    return s === 'open' || s === 'todo';
                }).length;
                const closed = issues.filter(i => i.status?.toLowerCase() === 'closed').length;
                // Assuming 'Critical' maps to priority 'Critical' or 'High'
                const critical = issues.filter(i => {
                    const p = i.priority?.toLowerCase();
                    return p === 'critical';
                }).length;

                setStats([
                    { label: 'Total Issues', value: total.toString(), color: 'bg-blue-500', icon: '📋' },
                    { label: 'Open', value: open.toString(), color: 'bg-green-500', icon: '🟢' },
                    { label: 'Closed', value: closed.toString(), color: 'bg-slate-500', icon: '🏁' },
                    { label: 'Critical', value: critical.toString(), color: 'bg-red-500', icon: '🔥' },
                ]);

                // Mock recent activity based on latest issues (reversed list)
                const latest = [...issues].reverse().slice(0, 3);
                setRecentActivity(latest);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</h3>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity found.</p>
                        ) : (
                            recentActivity.map((issue) => (
                                <div key={issue.id} onClick={() => onEdit(issue)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        👤
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            <span className="font-bold">{issue.creator?.name || 'User'}</span> created issue <span className="text-primary-600 dark:text-primary-400">#{issue.id}</span>
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{issue.title}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">New</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-transparent transition-colors flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Quick Actions</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your project efficiently.</p>
                    </div>
                    
                    <div className="space-y-3 mt-8">
                        <button 
                            onClick={() => onViewChange('new-issue')}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                        >
                            <span>➕</span> Create New Issue
                        </button>
                        <button 
                             onClick={() => onViewChange('kanban')}
                            className="w-full py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl font-bold transition-colors"
                        >
                            View Kanban Board
                        </button>
                         <button 
                             onClick={() => onViewChange('issues')}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl font-bold transition-colors"
                        >
                            View All Issues
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
