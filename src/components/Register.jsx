import { useState } from 'react'
// import axios from 'axios'
import api from './auth'

export default function Register({ onRegister, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const r = await api.post('/api/auth/register', formData)
            // Assuming r.data is the token string or success message
            // If it returns token immediately, we can log them in
            onRegister(r.data)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || err.response?.data || 'Registration failed. Email might already be taken.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
                <div className="bg-slate-900 dark:bg-slate-950 p-8 text-center transition-colors">
                    <h1 className="text-3xl font-bold text-white mb-2"> <span className="text-primary-400">Bug</span>Tracker</h1>
                    <p className="text-slate-400">Create a new account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <div className="text-center text-sm text-slate-400 dark:text-slate-500">
                        Already have an account?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
