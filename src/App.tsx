import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

// Create a React Query client with sensible defaults for cemetery use
// (stale time longer to reduce refetches on poor connectivity)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
    },
  },
})

// Placeholder pages - will be implemented in Phase 2
function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="font-heading text-4xl text-primary mb-4">לזכרו של מאיר תמם</h1>
      <p className="text-muted-foreground text-center max-w-md">
        אתר זיכרון זה מוקדש לזכרו של אבא היקר
      </p>
      <div className="mt-8 flex gap-4">
        <a href="/story" className="text-primary hover:underline">סיפור חיים</a>
        <a href="/gallery" className="text-primary hover:underline">גלריה</a>
        <a href="/recipes" className="text-primary hover:underline">מתכונים</a>
        <a href="/memories" className="text-primary hover:underline">זכרונות</a>
      </div>
    </div>
  )
}

function StoryPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl text-primary mb-4">סיפור חיים</h1>
      <p className="text-muted-foreground">דף זה יכיל את סיפור חייו של אבא</p>
    </div>
  )
}

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl text-primary mb-4">גלריית תמונות</h1>
      <p className="text-muted-foreground">דף זה יכיל את גלריית התמונות</p>
    </div>
  )
}

function RecipesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl text-primary mb-4">ספר המתכונים</h1>
      <p className="text-muted-foreground">דף זה יכיל את מתכוני אבא</p>
    </div>
  )
}

function MemoriesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl text-primary mb-4">קיר זיכרונות</h1>
      <p className="text-muted-foreground">דף זה יאפשר שיתוף זכרונות</p>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl text-primary mb-4">לוח בקרה</h1>
      <p className="text-muted-foreground">ניהול תוכן האתר</p>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="font-heading text-4xl text-primary mb-4">404</h1>
      <p className="text-muted-foreground">הדף לא נמצא</p>
      <a href="/" className="mt-4 text-primary hover:underline">חזרה לדף הבית</a>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:albumId" element={<GalleryPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipesPage />} />
          <Route path="/memories" element={<MemoriesPage />} />

          {/* Admin routes (will be protected in Phase 3) */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global toast notifications */}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
