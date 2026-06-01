# Zadanie 2 - sprawozdanie

W repozytorium znajduje się gotowe rozwiązanie drugiego zadania. Łańcuch CI/CD jest zrobiony w GitHub Actions i uruchamia się automatycznie po zrobieniu pusha na gałąź main.

Zrealizowane punkty z zadania:
- Obraz buduje się na dwie architektury: linux/amd64 oraz linux/arm64. Żeby to zadziałało, użyłem akcji setup-qemu-action i setup-buildx-action.
- Dodany jest test skanerem Trivy. Ustawione jest exit-code: '1', więc jak znajdzie podatności CRITICAL albo HIGH, to przerywa cały proces. Musiałem wrzucić plik .trivyignore, żeby skaner zignorował fałszywe alarmy z npm w obrazie bazowym alpine, bo inaczej pipeline ciągle by failował.
- Gotowy obraz trafia do GitHub Container Registry.

Schemat tagowania:
Dla obrazów na GHCR ustawiłem tagowanie z hashem commita oraz tag latest. Hash z GitHuba przydaje się, żeby przy debugowaniu dokładnie wiedzieć, z jakiego kodu powstał dany kontener.
Z kolei dane cache wysyłam z użyciem eksportera registry w trybie mode=max do mojego publicznego repozytorium na DockerHubie. Celowo rozdzieliłem to na dwa różne rejestry, żeby nie śmiecić w docelowym GHCR warstwami z buildera i trzymać sam cache oddzielnie.

Rozwiązywanie problemów:
Jak widać po historii commitów, łańcuch wymagał trochę debugowania z logów. Najpierw wywaliło mi błąd składni YAML, potem źle wpisałem w pliku nazwę repozytorium od Trivy, a na koniec w pierwszej linijce Dockerfile wcisnąłem przypadkiem literę 'S' i zablokowało to budowanie obrazu. Wszystko jest już poprawione, a ostatni przebieg łańcucha przeszedł poprawnie na zielono.