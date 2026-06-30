// Her "npm run build" sonunda dist/version.json içine benzersiz bir
// buildId yazar. GitHub Actions üzerinde VITE_BUILD_ID=commit SHA olarak
// set edilir (deploy.yml); yerelde build alırsan zaman damgası kullanılır.
// UpdateChecker bileşeni bu dosyayı runtime'da (cache'siz) periyodik olarak
// çekip, derlenmiş halinden farklıysa "yeni sürüm var" uyarısı gösterir.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const buildId = process.env.VITE_BUILD_ID || String(Date.now());

mkdirSync(distDir, { recursive: true });
writeFileSync(path.join(distDir, "version.json"), JSON.stringify({ buildId }));
console.log(`version.json yazıldı: ${buildId}`);
