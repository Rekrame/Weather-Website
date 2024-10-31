const apiKey = 'e4c7d413beed7d8cc6521ae67ca4d8f0';
let lat;
let lon;
let lastCity;

// apiKey — зберігає ключ API для доступу до даних OpenWeather
// lat і lon — змінні для зберігання широти й довготи користувача
// lastCity — використовується для збереження назви останнього запитаного міста

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, () => {});
    } else {
        alert('Geolocation is not supported by this browser. Please enter a city name.');
    }
}

// Перевіряє, чи браузер підтримує геолокацію.
// Якщо так, отримує координати користувача і зберігає їх у lat і lon
// Викликає getWeatherByCoords для завантаження погоди за координатами
// Якщо геолокація не підтримується, виводить повідомлення про необхідність введення назви міста


function getSelectedUnit() {
    const unitSelect = document.getElementById('unitSelect');
    return unitSelect.checked ? "imperial" : 'metric';
}

// Перевіряє елемент з ідентифікатором unitSelect і визначає одиниці вимірювання на основі стану перемикача



async function getWeatherByCoords(lat, lon) {
    const unit = getSelectedUnit();
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    await fetchData(weatherUrl, forecastUrl, unit);
}

// Завантажує погоду, використовуючи lat і lon
// Створює URL-запити для поточної погоди (weatherUrl) та прогнозу (forecastUrl) з вибраними одиницями вимірювання
// Викликає fetchData для отримання даних за URL



async function getWeather() {
    let city = document.getElementById('cityInput').value;
    if (!city) {
        if (lastCity) {
            city = lastCity;
        } else if (lat && lon) {
            return getWeatherByCoords(lat, lon);
        }
    }

// Запитує у користувача місто (cityInput)
// Якщо місто не задано, перевіряє, чи є збережене lastCity, або координати. Якщо так, використовує getWeatherByCoords
// Зберігає вибране місто як lastCity
// Формує URL для поточної погоди та прогнозу з використанням міста
// Викликає fetchData для отримання погодних даних


    
    lastCity = city;
    const unit = getSelectedUnit();
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    await fetchData(weatherUrl, forecastUrl, unit);
}

async function fetchData(weatherUrl, forecastUrl, unit) {
    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('Unable to retrieve weather data');
        }
        const weatherData = await weatherResponse.json();

        document.getElementById('cityName').innerText = weatherData.name;
        document.getElementById('weatherResult').style.display = 'block';
        document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        document.getElementById('temperature').innerText = `${weatherData.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
        document.getElementById('weatherDescription').innerText = weatherData.weather[0].description;
        document.getElementById('humidity').innerText = `Humidity: ${weatherData.main.humidity}%`;
        document.getElementById('windSpeed').innerText = `Wind Speed: ${weatherData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
        document.getElementById('pressure').innerText = `Pressure: ${weatherData.main.pressure} hPa`;
        document.getElementById('visibility').innerText = `Visibility: ${weatherData.visibility / 1000} km`;
        document.getElementById('feelsLike').innerText = `Feels Like: ${weatherData.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}`;

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        document.getElementById('forecast').style.display = 'block';
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';
        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecastItem = forecastData.list[i];
            const date = new Date(forecastItem.dt_txt).toDateString();
            const icon = forecastItem.weather[0].icon;
            const temp = forecastItem.main.temp;

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <span>${date}</span>
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                    <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Humidity: ${forecastItem.main.humidity}%</span>
                    <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                    <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                    <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                </div>
            `;
        }

// Запит поточної погоди: надсилає HTTP-запит на weatherUrl. Якщо запит не вдалий, викидає помилку. У разі успішної відповіді отримує JSON-дані (weatherData), що містять деталі погоди.
// Відображення інформації: оновлює елементи сторінки значеннями з weatherData. Зокрема, це назва міста, іконка погоди, температура, опис погоди, вологість, швидкість вітру, тиск, видимість і "відчувається як" (feels like).
// Запит прогнозу: надсилає HTTP-запит на forecastUrl для отримання 5-денного прогнозу погоди.
// Формування прогнозу на день: створює та оновлює елементи для відображення прогнозу на найближчі дні, відбираючи один прогноз щодоби (по одному прогнозу кожні 24 години з інтервалом у 3 години).


        
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayString = nextDay.toISOString().split('T')[0];

        const hourlyForecast = forecastData.list.filter(item => item.dt_txt.startsWith(nextDayString));
        if (hourlyForecast.length > 0) {
            document.getElementById('hourlyForecast').style.display = 'block';
            const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
            hourlyForecastContainer.innerHTML = '';
            hourlyForecast.forEach(forecastItem => {
                const time = new Date(forecastItem.dt_txt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                const icon = forecastItem.weather[0].icon;
                const temp = forecastItem.main.temp;

                hourlyForecastContainer.innerHTML += `
                    <div class="forecast-hour">
                        <span>${time}</span>
                        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                        <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Humidity: ${forecastItem.main.humidity}%</span>
                        <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                        <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                        <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                    </div>
                `;
            });
        }
            
// Генерація дати на наступний день: визначає завтрашню дату (nextDayString), щоб відфільтрувати дані прогнозу для наступної доби.
// Фільтрування годинного прогнозу: відбирає прогнози на певні години для завтрашнього дня.
// Оновлення відображення: створює HTML-елементи для кожної години з інформацією про погоду — час, іконка погоди, температура, вологість, швидкість вітру, тиск, видимість і "відчувається як".


    
        // Add drag-to-scroll functionality
        const scrollContainers = document.querySelectorAll('.horizontal-forecast');
        scrollContainers.forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                container.classList.add('active');
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });
            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mouseup', () => {
                isDown = false;
                container.classList.remove('active');
            });
            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 3; // Scroll-fast
                container.scrollLeft = scrollLeft - walk;
            });
        });
        
// Ініціалізація горизонтальних контейнерів для прокрутки: вибирає всі елементи з класом .horizontal-forecast для реалізації прокрутки
// Перемінні для контролю прокрутки: оголошує змінні для відстеження натискання, початкової позиції, і зсуву для контейнера
// Додає події для прокрутки:
// mousedown: активує режим прокрутки, зберігає початкову позицію та поточну прокрутку
// mouseleave та mouseup: завершує прокрутку, скидаючи активний стан
// mousemove: змінює положення прокрутки залежно від руху миші, створюючи плавну прокрутку на контейнері



    } catch (error) {
        alert(error.message);
    }
}

// Обробка помилок: якщо відбувається помилка під час завантаження даних, відображається повідомлення з описом помилки
// Завантаження даних при старті сторінки: при завантаженні сторінки викликає getLocation(), щоб визначити місце розташування і завантажити прогноз погоди


