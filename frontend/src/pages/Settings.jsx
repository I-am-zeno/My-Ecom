import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Moon, Sun, Bell, Shield, User, Mail, Save } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const loadSettings = () => {
  try {
    const saved = localStorage.getItem('admin_settings')
    if (saved) return JSON.parse(saved)
  } catch {}
  return {
    emailNotifications: true,
    maintenanceMode: false,
    profile: { name: 'John Doe', email: 'john@example.com' },
  }
}

const Settings = () => {
  const { user } = useAuth()
  if (user?.role !== 'Admin') return <Navigate to="/products" replace />
  const { dark, toggle } = useTheme()
  const [settings, setSettings] = useState(loadSettings)
  const [profile, setProfile] = useState(settings.profile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem('admin_settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const handleSaveProfile = e => {
    e.preventDefault()
    updateSetting('profile', profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-4 md:space-y-6">
      <div className="bg-surface rounded-xl border border-card-border p-4 md:p-6">
        <h1 className="text-base md:text-lg font-semibold text-text-main">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Configure platform preferences and your profile.</p>
      </div>

      <div className="bg-surface rounded-xl border border-card-border divide-y divide-card-border">
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-element">
                {dark ? <Moon size={18} className="text-text-main" /> : <Sun size={18} className="text-amber-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">Dark Mode</p>
                <p className="text-xs text-text-muted mt-0.5">Switch between light and dark theme</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                dark ? 'bg-primary' : 'bg-element border border-card-border'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                dark ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-element">
                <Bell size={18} className="text-text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">Email Notifications</p>
                <p className="text-xs text-text-muted mt-0.5">Receive email alerts for important updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => updateSetting('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-11 h-6 rounded-full bg-element border border-card-border peer-checked:bg-primary peer-checked:border-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-element">
                <Shield size={18} className="text-text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">Maintenance Mode</p>
                <p className="text-xs text-text-muted mt-0.5">Disable public access during updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => updateSetting('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-11 h-6 rounded-full bg-element border border-card-border peer-checked:bg-primary peer-checked:border-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-card-border p-4 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-element">
            <User size={18} className="text-text-muted" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-main">Profile</h2>
            <p className="text-xs text-text-muted mt-0.5">Update your display name and email address</p>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-element text-text-main text-sm border border-card-border outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-element text-text-main text-sm border border-card-border outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
            {saved && (
              <span className="text-xs text-emerald-500 font-medium">Saved successfully</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
