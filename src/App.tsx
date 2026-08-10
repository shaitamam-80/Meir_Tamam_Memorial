import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { StoryPage } from '@/pages/StoryPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { AlbumPage } from '@/pages/AlbumPage'
import { WordsPage } from '@/pages/WordsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:albumId" element={<AlbumPage />} />
          <Route path="/words" element={<WordsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
