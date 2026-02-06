import { useEffect, useState } from 'react'
import axios from 'axios'

export default function IssueList({ onEdit }) {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterStatus, setFilterStatus] = useState('All Status')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/api/issues')
            .then(r => {
                setIssues(r.data)
                setLoading(false)
            })
            .catch(e => {
                console.error(e)
                setError('Failed to fetch issues')
                setLoading(false)
            })
    }, [])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'closed': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
            case 'in_progress': 
            case 'in progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600';
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'critical': return 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
            default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600';
        }
    }

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this issue?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/issues/${id}`)
            setIssues(issues.filter(i => i.id !== id))
        } catch (e) {
            console.error(e)
            alert("Failed to delete issue")
        }
    }

    const filteredIssues = issues.filter(issue => {
        let matchesStatus = false;
        const s = issue.status?.toLowerCase();
        
        if (filterStatus === 'All Status') {
            matchesStatus = true;
        } else if (filterStatus === 'Open') {
            matchesStatus = s === 'open' || s === 'todo';
        } else {
            matchesStatus = s === filterStatus.toLowerCase();
        }

        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading issues...</div>

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">All Issues</h2>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Search issues..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                        <option>All Status</option>
                        <option>Open</option>
                        <option>Closed</option>
                        <option>In Progress</option>
                    </select>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredIssues.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    No issues found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredIssues.map(issue => (
                                <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">#{issue.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{issue.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(issue.priority)}`}>
                                            {issue.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{issue.description}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => onEdit(issue)}
                                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline p-2"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(issue.id)}
                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium hover:underline p-2"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center text-sm">
                    {error}. Please check the backend connection.
                </div>
            )}
        </div>
    )
}
