# 🌌 Küresel Astronomi Simülasyonu (Spherical Astronomy App)

Bu proje, lisans düzeyindeki Küresel Astronomi dersleri için geliştirilmiş etkileşimli bir **3 Boyutlu Problem Çözme ve Simülasyon** aracıdır.

Modern web teknolojileri (React, Three.js) kullanılarak geliştirilen uygulama, öğrencilerin soyut küresel geometri kavramlarını görselleştirmelerine ve karmaşık problemleri (Alan hesabı, Koordinat dönüşümleri, Gün doğumu simülasyonu) interaktif olarak çözmelerine olanak tanır.

## 🚀 Özellikler

Uygulama üç ana problem çözme modu içerir:

### 1. Küresel Üçgen ve Alan Hesabı 📐
*   Kullanıcı küre üzerinde noktalar seçerek üçgen oluşturabilir veya verileri manuel girebilir.
*   **İkizkenar Küresel Üçgenler** için özel çözücü.
*   **Küresel Fazla (Spherical Excess)** ve **Yüzey Alanı (km²)** hesabı.
*   Sonuçlar sürüklenebilir bir panelde gösterilir.

### 2. P-Z-S Üçgeni ve Koordinat Dönüşümü 🔄
*   Ekvatoral Sistemden (Dik Açıklık, Saat Açısı) Ufuk Sistemine (Yükseklik, Azimut) dönüşümü görselleştirir.
*   **Navigasyon Üçgeni (P-Z-S)** elemanlarını (Kutup, Zenit, Yıldız) dinamik olarak çizer.

### 3. Güneş Doğuş/Batış Simülasyonu (Kayseri) 🌅
*   Belirli bir enlem ve tarih için Güneş'in günlük hareketini (Günlük Çember) simüle eder.
*   **Atmosferik Kırılma (Refraction)** etkisini (-50') dikkate alarak doğuş/batış saatlerini hesaplar.
*   **Zaman ve Tarih Kaydırıcıları:** Kullanıcı tarihi değiştirerek mevsimsel etkileri, saati değiştirerek Güneş'in hareketini animasyonlu olarak izleyebilir.

## 🛠️ Teknolojiler

*   **Frontend:** React (Vite)
*   **3D Motoru:** React Three Fiber (Three.js)
*   **UI/Animasyon:** Framer Motion, Tailwind CSS
*   **Matematik:** Özel Küresel Trigonometri kütüphanesi

## 💻 Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

1.  Depoyu klonlayın:
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/celestial-sphere-app.git
    cd celestial-sphere-app
    ```

2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3.  Uygulamayı başlatın:
    ```bash
    npm run dev
    # Veya hazır script ile:
    # ./baslat.bat
    ```

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir. Serbestçe kullanılabilir ve değiştirilebilir.
