import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Flame, BookOpen, Camera, Heart } from 'lucide-react'

const navItems = [
  { to: '/', icon: Flame, label: 'בית', end: true },
  { to: '/story', icon: BookOpen, label: 'סיפור חיים', end: false },
  { to: '/gallery', icon: Camera, label: 'גלריה', end: false },
  { to: '/words', icon: Heart, label: 'מילים לזכרו', end: false },
]

/** Scrolls to top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      {/* Page content — bottom padding leaves room for the fixed nav */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Bottom navigation — mobile-first, always reachable with a thumb */}
      <nav
        aria-label="ניווט ראשי"
        className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur border-t border-border pb-safe"
      >
        <div className="max-w-md mx-auto grid grid-cols-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 ${isActive ? 'text-accent' : ''}`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
