/**
 * OpenWeatherMap API Service
 * Free tier: 1000 calls/day
 * Sign up: https://openweathermap.org/api
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a city
 */
export async function getCurrentWeather(city, state) {
    if (!API_KEY) {
        console.warn('⚠️ No OpenWeatherMap API key - using fallback');
        return null;
    }

    try {
        const query = `${city},${state},US`;
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(query)}&units=imperial&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            console.error('Weather API error:', response.status);
            return null;
        }

        const data = await response.json();
        
        return {
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.error('Weather fetch failed:', error);
        return null;
    }
}

/**
 * Get 5-day forecast
 */
export async function getWeatherForecast(city, state) {
    if (!API_KEY) {
        return null;
    }

    try {
        const query = `${city},${state},US`;
        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&units=imperial&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        
        // Get daily summaries (one per day at noon)
        const dailyForecasts = data.list.filter(item => 
            item.dt_txt.includes('12:00:00')
        ).slice(0, 5);

        return dailyForecasts.map(day => ({
            date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(day.main.temp_max),
            low: Math.round(day.main.temp_min),
            condition: day.weather[0].main
        }));
    } catch (error) {
        console.error('Forecast fetch failed:', error);
        return null;
    }
}

/**
 * Format weather for display
 */
export function formatCurrentWeather(weather) {
    if (!weather) return 'Weather data unavailable';
    return `${weather.temp}°F ${weather.condition} - ${weather.description}`;
}

export function formatForecast(forecast) {
    if (!forecast || forecast.length === 0) return 'Forecast unavailable';
    const summary = forecast.map(d => `${d.date}: ${d.high}°`).join(', ');
    return summary;
}



