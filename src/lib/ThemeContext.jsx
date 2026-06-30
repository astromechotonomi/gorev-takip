import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const BG_BY_THEME = { dark: "#0b0e1a", light: "#eef1f6" };

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("at-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("at-theme", theme);

    // index.html'deki FOUC-önleme script'i sayfa ilk açıldığında <html>
    // elementinin arka planını TEK SEFER elle set ediyor. Kullanıcı
    // uygulama içinden tema değiştirdiğinde bu inline stil hiç
    // güncellenmiyordu — body/header doğru renge geçerken <html>'in kendisi
    // eski temada kalıyor, body'nin kaplamadığı bölgelerde (sayfaya göre
    // değişen yerlerde) bu eski renk görünüyordu. Burada her tema
    // değişiminde aynı script'in mantığını tekrar uygulayıp ikisini
    // senkron tutuyoruz.
    document.documentElement.style.backgroundColor = BG_BY_THEME[theme] || BG_BY_THEME.dark;
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme, ThemeProvider içinde kullanılmalı");
  return ctx;
}
