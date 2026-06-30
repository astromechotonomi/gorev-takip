import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages bir alt klasör (https://kullanici.github.io/REPO_ADI/) üzerinden
// yayın yaptığı için base yolunun repo adınla eşleşmesi gerekiyor.
// Repo adınız "gorev-takip" değilse aşağıdaki satırı güncelleyin.
export default defineConfig({
  plugins: [react()],
  base: '/gorev-takip/',
})
