@echo off
echo ==========================================
echo   Celestial Sphere - Hizli Baslangic
echo ==========================================

:: Scriptin bulundugu dizine git
cd /d "%~dp0"

:: Node modulleri yoksa yukle
if not exist node_modules (
    echo [BILGI] Ilk calistirma tespit edildi. Kutuphaneler yukleniyor...
    call npm install
    if errorlevel 1 (
        echo [HATA] Yukleme basarisiz oldu. Internet baglantinizi kontrol edin.
        pause
        exit /b
    )
)

:: Tarayiciyi ac (biraz bekleme ekleyebiliriz veya server acilinca manuel acilir)
echo [BILGI] Uygulama baslatiliyor...
echo [BILGI] Tarayici otomatik acilacak: http://localhost:5173

:: Vite serverini baslat
start http://localhost:5173
call npm run dev

pause
