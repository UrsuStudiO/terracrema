import { ThemeProvider } from './context/ThemeContext.jsx'
import { ScrollToProvider } from './context/ScrollToContext.jsx'
import Navbar from './components/Navbar.jsx'
import CreamShowcase from './components/CreamShowcase.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToProvider>
        <Navbar />
        <main>
          <CreamShowcase />
        </main>
      </ScrollToProvider>
    </ThemeProvider>
  )
}
