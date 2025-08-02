# 🚀 Vercel Deployment Rehberi

Bu rehber, Health Monitor App'inizi Vercel'e deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- [Vercel hesabı](https://vercel.com/signup)
- [GitHub hesabı](https://github.com)
- Projenizin GitHub'da yayınlanmış olması

## 🔧 Yerel Deploy (CLI ile)

### 1. Vercel CLI ile Deploy

```bash
# Vercel'e giriş yapın
npx vercel login

# Projeyi deploy edin
npx vercel

# Production'a deploy etmek için
npx vercel --prod
```

### 2. Deploy Sırasında Sorulacak Sorular

```
? Set up and deploy "~/Desktop/health-monitor-app"? [Y/n] y
? Which scope do you want to deploy to? [your-username]
? Link to existing project? [y/N] n
? What's your project's name? health-monitor-app
? In which directory is your code located? ./
```

## 🌐 GitHub Integration ile Deploy

### 1. GitHub Repository Hazırlığı

```bash
# Git repository'yi başlatın (eğer yoksa)
git init

# Dosyaları ekleyin
git add .

# Commit yapın
git commit -m "Initial commit for Vercel deployment"

# GitHub'a push yapın
git remote add origin https://github.com/username/health-monitor-app.git
git push -u origin main
```

### 2. Vercel Dashboard'da Deploy

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Framework Preset olarak "Vite" seçin
5. "Deploy" butonuna tıklayın

## 🔐 Environment Variables Ayarlama

### Vercel Dashboard'da:

1. Proje sayfanıza gidin
2. "Settings" sekmesine tıklayın
3. "Environment Variables" bölümüne gidin
4. Aşağıdaki değişkenleri ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_GOOGLE_AI_API_KEY` | `your_google_ai_api_key_here` | Production, Preview, Development |

### Yerel .env Dosyası:

```bash
# .env.local dosyası oluşturun
cp env.example .env.local

# API anahtarınızı ekleyin
echo "VITE_GOOGLE_AI_API_KEY=your_actual_api_key" >> .env.local
```

## 🏗️ Build Konfigürasyonu

Proje zaten Vercel için optimize edilmiştir:

- ✅ `vercel.json` konfigürasyonu mevcut
- ✅ Build script'i: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing için rewrite kuralları
- ✅ Static asset caching

## 🔍 Deploy Sonrası Kontroller

### 1. Build Logları

Deploy sırasında şu çıktıları görmelisiniz:

```
✓ Built in 8.53s
✓ Deployed to https://your-app.vercel.app
```

### 2. Uygulama Testleri

Deploy sonrası şunları kontrol edin:

- [ ] Ana sayfa yükleniyor mu?
- [ ] Routing çalışıyor mu?
- [ ] AI Assistant API çağrıları çalışıyor mu?
- [ ] Responsive design doğru mu?

### 3. Performance Kontrolleri

- [ ] Lighthouse skorları
- [ ] Bundle boyutu (target: < 500KB)
- [ ] First Contentful Paint
- [ ] Time to Interactive

## 🚨 Yaygın Sorunlar ve Çözümleri

### 1. Build Hatası: "Module not found"

**Çözüm:**
```bash
# Bağımlılıkları yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

### 2. Environment Variables Çalışmıyor

**Çözüm:**
- Vercel dashboard'da environment variables'ları kontrol edin
- Değişkenlerin `VITE_` prefix'i ile başladığından emin olun
- Deploy sonrası environment'ı yeniden deploy edin

### 3. Routing Sorunları

**Çözüm:**
- `vercel.json` dosyasındaki rewrite kurallarını kontrol edin
- SPA routing için tüm route'ların `index.html`'e yönlendirildiğinden emin olun

### 4. API CORS Sorunları

**Çözüm:**
- Google AI API'nin CORS ayarlarını kontrol edin
- Vercel'in CORS headers'ını kullandığından emin olun

## 📊 Monitoring ve Analytics

### 1. Vercel Analytics

```bash
# Analytics'i etkinleştirin
npx vercel analytics
```

### 2. Error Tracking

- Vercel Function Logs'u kontrol edin
- Browser console hatalarını izleyin
- User feedback'lerini toplayın

## 🔄 Continuous Deployment

### GitHub Actions ile Otomatik Deploy

`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Destek

Deploy sorunları için:

1. [Vercel Documentation](https://vercel.com/docs)
2. [Vercel Community](https://github.com/vercel/vercel/discussions)
3. [Vite Documentation](https://vitejs.dev/guide/deploy.html)

## 🎉 Başarılı Deploy Sonrası

Deploy başarılı olduktan sonra:

1. Custom domain ekleyin (opsiyonel)
2. SSL sertifikası otomatik olarak sağlanır
3. CDN ile global dağıtım
4. Otomatik scaling
5. Preview deployments her PR için

---

**Not:** Bu rehber sürekli güncellenmektedir. En güncel bilgiler için Vercel'in resmi dokümantasyonunu kontrol edin. 