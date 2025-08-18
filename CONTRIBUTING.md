# Contributing to iptv-util

Thank you for your interest in contributing to `iptv-util`! We welcome contributions from the community to help improve this IPTV utility library. Whether you're fixing bugs, adding features, or improving documentation, your efforts are greatly appreciated.

## How to Contribute

Follow these steps to contribute to the project:

1. **Fork the Repository**  
   Fork the `iptv-util` repository to your own GitHub account by clicking the "Fork" button at the top of the [repository page](https://github.com/sefakozan/iptv-util).

2. **Clone the Forked Repository**  
   Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/iptv-util.git
   ```

## Scripts

Aşağıdaki script'ler, proje geliştirme sürecini kolaylaştırmak için `package.json` dosyasında tanımlanmıştır:

- **`npm run test`**: Vitest ile tüm testleri çalıştırır ve sonuçları raporlar.
- **`npm run coverage`**: Vitest ile testleri çalıştırır ve kod kapsayıcılık (coverage) raporunu oluşturur.
- **`npm run benchmark`**: Vitest ile performans testlerini (benchmarks) çalıştırır ve detaylı bir rapor sunar.
- **`npm run format`**: Biome ile tüm proje dosyalarını formatlar (ör. girinti, satır uzunluğu) ve değişiklikleri kaydeder.
- **`npm run format:all`**: Biome ile tüm dosyaları formatlar, linting hatalarını düzeltir ve import'ları sıralar (eğer etkinse).
- **`npm run format:check`**: Biome ile formatlama ve linting sorunlarını kontrol eder, ancak değişiklik yapmaz.
- **`npm run lint`**: Biome ile yalnızca linting kurallarını (kod kalitesi) kontrol eder, formatlama yapmaz.