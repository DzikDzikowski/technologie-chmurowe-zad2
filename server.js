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