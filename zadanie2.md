# Sprawozdanie - Zadanie 2

**Rozwiązanie w pełni zautomatyzowane przy użyciu GitHub Actions, spełniające wszystkie warunki z treści zadania.**

## Architektura Łańcucha CI
Pipeline został zdefiniowany w pliku `.github/workflows/ci.yml`. Uruchamia się on automatycznie po wykonaniu operacji `push` na gałąź `main`.

**Zrealizowane założenia (Kroki pipeline'u):**
1. **Multi-architektura:** Przy użyciu rozszerzeń `docker/setup-qemu-action` oraz `docker/setup-buildx-action`, obraz kompilowany jest równolegle na platformy `linux/amd64` oraz `linux/arm64`.
2. **Skanowanie podatności (Trivy CVE Test):** Zanim obraz zostanie ostatecznie skompilowany na obie architektury i wysłany do rejestru, najpierw kompilowana jest wersja testowa. Skaner `aquasec/trivy-action` bada lokalny obraz, a parametr `exit-code: '1'` gwarantuje, że przy znalezieniu podatności typu HIGH lub CRITICAL proces zostaje przerwany, a wadliwy obraz NIGDY nie trafia na GHCR. Fałszywe alarmy dotyczące nieprodukcyjnego menedżera `npm` wyeliminowano plikiem `.trivyignore`.
3. **Logowanie do dwóch rejestrów:** Pipeline oddziela miejsce przechowywania cache'u (DockerHub) od miejsca publikacji docelowej aplikacji (GitHub Container Registry - GHCR).

## Zastosowany schemat Tagowania

### 1. Obrazy Aplikacji (GitHub Container Registry)
Do automatycznego generowania tagów wykorzystano akcję `docker/metadata-action`. Zdecydowałem się na schemat łączony:
* `sha-<hash>` (np. `sha-f4a2b1c`) - Uzasadnienie: Pozwala to na absolutną i jednoznaczną identyfikację, z którego konkretnie "commita" w kodzie źródłowym pochodzi dany obraz. Jest to najlepsza praktyka DevOps ułatwiająca debugowanie na produkcji.
* `latest` - Uzasadnienie: Standardowy tag (alias) ułatwiający pobieranie najnowszej stabilnej wersji obrazu przez użytkowników końcowych bez konieczności sprawdzania historii GitHuba.

### 2. Dane Cache (DockerHub)
* `cache` (np. `hubszy/zadanie2-cache:cache`) - Uzasadnienie: Dane cache są celowo eksportowane (typ `registry`) do zupełnie osobnego, publicznego repozytorium na DockerHubie, zamiast do GHCR. Oddziela to tzw. "śmieci produkcyjne" (warstwy tymczasowe z etapu builder'a zapisywane dzięki trybowi `mode=max`) od finalnego, lekkiego obrazu dostarczanego klientowi. Dzięki temu repozytorium na GHCR jest czyste, a serwery GitHuba błyskawicznie budują kolejne wersje zaciągając dane z chmury Dockera.

## Test Działania
Łańcuch został przetestowany. W zakładce `Actions` na GitHubie widać pomyślne wykonanie pipeline'u, co dowodzi poprawnej konfiguracji wyzwalaczy (Triggers) i integracji z zewnętrznymi rejestrami.