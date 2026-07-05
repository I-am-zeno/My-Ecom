import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogIn, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface rounded-xl border border-card-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-text-on-primary mb-3">
            <ShoppingCart size={22} />
          </div>
          <h1 className="text-xl font-bold text-text-main">Welcome back</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 pr-10 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-text-muted">
              <input type="checkbox" className="rounded border-card-border accent-primary" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {submitting ? <Loader size={16} className="animate-spin" /> : <LogIn size={16} />}
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
