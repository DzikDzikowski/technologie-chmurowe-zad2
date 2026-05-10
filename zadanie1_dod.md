Sprawozdanie z części dodatkowej

Autor: Hubert Szydłowski

DockerHub Repo:

https://hub.docker.com/repository/docker/hubszy/zadanie1/general  

1. Wybór wariantu:

Multi-arch (linux/amd64, linux/arm64), driver `docker-container`, wykorzystałem cache w trybie MAX na zewnętrznym rejestrze oraz pobieranie kodu aplikacji z repozytorium przez `mount=type=secret` z pomocą BuildKit.

2. Analiza bezpieczeństwa przy użyciu Trivy:

Obraz został przeskanowany za pomocą narzędzia Trivy. 

Wynik skanowania: `Total: 15 (UNKNOWN: 0, LOW: 2, MEDIUM: 2, HIGH: 11, CRITICAL: 0)`

Uzasadnienie zignorowania podatności HIGH:

Wykryte podatności o statusie HIGH dotyczą wyłącznie wewnętrznych narzędzi i zależności menedżera pakietów `npm`, który jest fabrycznie dołączony do obrazu bazowego `node:20-alpine`. 
Aplikacja to prosty serwer HTTP, który nie wykorzystuje menedżera `npm`, nie przetwarza plików archiwów (`tar`) ani nie wykonuje poleceń powłoki systemowej na podstawie danych wejściowych użytkownika. Ze względu na brak realnego zagrożenia ataku w kontekście działania tej aplikacji, wykryte podatności można bezpiecznie zignorować.

![Skanowanie CVE](<wynik_skanu.png>)

3. Optymalizacja i warstwy:

Plik Dockerfile został wysoce zoptymalizowany:

- Multi-stage build: Umożliwia przygotowanie środowiska w pierwszej fazie, nie zaśmiecając finalnego obrazu narzędziami.

- Healthcheck: Wbudowany mechanizm sprawdzający sprawność kontenera na porcie 8080.

- Uprawnienia: Zastosowano USER node zamiast roota dla bezpieczeństwa.

4. Polecenia użyte do budowy zaawansowanej - Buildx

Inicjalizacja buildera:

`docker buildx create --use --name my-advanced-builder --driver docker-container`

Budowanie obrazu:

`docker buildx build --push --platform linux/amd64,linux/arm64 --secret id=my_secret,src=secret.txt --cache-to type=registry,ref=hubszy/zadanie1:cache,mode=max --cache-from type=registry,ref=hubszy/zadanie1:cache -t hubszy/zadanie1:v2-dodatkowe .`

