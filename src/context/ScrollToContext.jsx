import { createContext, useContext } from 'react'

const ScrollToContext = createContext(null)

function scrollToSelector(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function ScrollToProvider({ children }) {
  return <ScrollToContext.Provider value={scrollToSelector}>{children}</ScrollToContext.Provider>
}

export function useScrollTo() {
  const ctx = useContext(ScrollToContext)
  if (!ctx) throw new Error('useScrollTo debe usarse dentro de <ScrollToProvider>')
  return ctx
}
