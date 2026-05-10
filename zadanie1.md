Sprawozdanie z zadania 1 Technologie Chmurowe

Autor: Hubert Szydłowski

GitHub Repo: 

https://github.com/DzikDzikowski/technologie-chmurowe-zad1

DockerHub: 

https://hub.docker.com/repository/docker/hubszy/zadanie1/general

1. Opis:

Aplikacja napisana w środowisku Node do sprawdzania pogody. Podaje informacje w logach o informację o dacie uruchomienia, imieniu i nazwisku autora programu oraz porcie TCP.

2. Dockerfile:

S
FROM node:20-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

RUN --mount=type=secret,id=my_secret \
    git clone https://github.com/DzikDzikowski/technologie-chmurowe-zad1.git .

FROM node:20-alpine

LABEL org.opencontainers.image.authors="Hubert"

ENV NODE_ENV=production PORT=8080
WORKDIR /app

COPY --from=builder /app/server.js .

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

USER node
EXPOSE 8080

CMD ["node", "server.js"]

3. Server.js

const http = require('http');

const cities = {
    "Warszawa": { lat: 52.2298, lon: 21.0118 },
    "Lublin": { lat: 51.2465, lon: 22.5684 },
    "Berlin": { lat: 52.5200, lon: 13.4050 },
    "Monachium": { lat: 48.1371, lon: 11.5754 }
};

const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const url = new URL(req.url, `http://${req.headers.host}`);
    const city = url.searchParams.get('city');

    if (city && cities[city]) {
        try {
            const { lat, lon } = cities[city];
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await response.json();
            const temp = data.current_weather.temperature;
            
            res.end(`<h2>Pogoda dla: ${city}</h2><p>Aktualna temperatura: <b>${temp}°C</b></p><a href="/">Powrót</a>`);
        } catch (error) {
            res.end(`<h2>Błąd pobierania pogody</h2><a href="/">Powrót</a>`);
        }
    } else {
        res.end(`
            <h1>Aplikacja Pogodowa</h1>
            <p>Autor: Hubert</p>
            <form>
                <label>Wybierz miasto:</label>
                <select name="city">
                    <option value="Warszawa">Polska - Warszawa</option>
                    <option value="Lublin">Polska - Lublin</option>
                    <option value="Berlin">Niemcy - Berlin</option>
                    <option value="Monachium">Niemcy - Monachium</option>
                </select>
                <button type="submit">Sprawdź</button>
            </form>
        `);
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`[Data uruchomienia]: ${new Date().toISOString()}`);
    console.log(`[Autor]: Hubert Szydlowski`);
    console.log(`[Port TCP]: ${PORT}`);
});

4. Użyte polecenia:

Docker build:

![Docker build](<Docker_build.png>)

Docker images - rozmiar obrazu:

![Docker images - rozmiar obrazu](<Docker_images.png>)

Docker history - warstwy:

![Docker history - warstwy (10)](<Docker_history.png>)

Uruchomienie kontenera i logi:

![Uruchomienie kontenera i logi](<run.png>)
