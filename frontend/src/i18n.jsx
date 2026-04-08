const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "en" } catch { return "en" }
  })

  function t(key) {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key
  }

  function switchLang(l) {
    setLang(l)
    try { localStorage.setItem("lang", l) } catch {}
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang: switchLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  // Fallback if called outside provider
  if (!ctx) return { lang: "en", t: k => EN[k] || k, setLang: () => {} }
  return ctx
}