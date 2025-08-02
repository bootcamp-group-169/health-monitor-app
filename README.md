# Health Monitor App

Modern ve kullanıcı dostu sağlık takip uygulaması. React, TypeScript, Vite ve Material-UI kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Dashboard**: Sağlık verilerinizi görselleştirin
- **AI Assistant**: Google AI ile sağlık tavsiyeleri alın
- **Intestinal Tracker**: Bağırsak sağlığınızı takip edin
- **Meal Tracker**: Yemek alışkanlıklarınızı kaydedin
- **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- **Dark/Light Theme**: Kişiselleştirilebilir tema seçenekleri

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI (MUI)
- **Styling**: Tailwind CSS, Emotion
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **AI Integration**: Google Generative AI, LangChain
- **Forms**: React Hook Form, Zod validation
- **Animations**: Framer Motion

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd health-monitor-app
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment variables'ları ayarlayın**
   ```bash
   cp env.example .env.local
   ```
   
   `.env.local` dosyasını düzenleyerek gerekli API anahtarlarını ekleyin:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

5. **Tarayıcınızda açın**
   ```
   http://localhost:3000
   ```

## 🏗️ Build ve Deploy

### Production Build

```bash
npm run build
```

### Vercel ile Deploy

1. **Vercel CLI'yi yükleyin**
   ```bash
   npm i -g vercel
   ```

2. **Vercel'e giriş yapın**
   ```bash
   vercel login
   ```

3. **Deploy edin**
   ```bash
   vercel
   ```

### Manuel Deploy

1. GitHub repository'nizi Vercel'e bağlayın
2. Environment variables'ları Vercel dashboard'da ayarlayın
3. Deploy butonuna tıklayın

## 🔧 Scripts

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run preview` - Build'i önizler
- `npm run lint` - ESLint ile kod kontrolü yapar
- `npm run type-check` - TypeScript tip kontrolü yapar

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── pages/              # Sayfa bileşenleri
├── services/           # API servisleri
├── store/              # Zustand state management
├── theme/              # Tema konfigürasyonu
├── App.tsx             # Ana uygulama bileşeni
└── main.tsx            # Uygulama giriş noktası
```

## 🔐 Environment Variables

| Variable | Açıklama | Gerekli |
|----------|----------|---------|
| `VITE_GOOGLE_AI_API_KEY` | Google AI API anahtarı | ✅ |
| `VITE_APP_NAME` | Uygulama adı | ❌ |
| `VITE_APP_VERSION` | Uygulama versiyonu | ❌ |

## 🚀 Performance Optimizations

- **Code Splitting**: Otomatik chunk bölme
- **Lazy Loading**: Sayfa bazında lazy loading
- **Bundle Optimization**: Vendor chunk'ları ayrılmış
- **Caching**: Static asset'ler için cache headers

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız, lütfen GitHub Issues bölümünde bildirin. 