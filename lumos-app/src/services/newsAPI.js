/**
 * NewsAPI Service
 * Free tier: 100 requests/day (dev only, localhost)
 * Sign up: https://newsapi.org/register
 */

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Get local news for a city/state
 */
export async function getLocalNews(city, state, limit = 3) {
    if (!API_KEY) {
        console.warn('⚠️ No NewsAPI key - using fallback');
        return [];
    }

    // State to full name mapping
    const stateNames = {
        'TX': 'Texas',
        'CA': 'California',
        'NY': 'New York',
        'FL': 'Florida',
        'IL': 'Illinois',
        'PA': 'Pennsylvania',
        'OH': 'Ohio',
        'GA': 'Georgia',
        'AZ': 'Arizona',
        'CO': 'Colorado'
    };

    // Major metro areas for better results
    const metroAreas = {
        'McKinney': 'Dallas',
        'Plano': 'Dallas',
        'Frisco': 'Dallas',
        'Arlington': 'Dallas',
        'Fort Worth': 'Dallas',
        'Irving': 'Dallas',
        'Garland': 'Dallas'
    };

    const stateName = stateNames[state] || state;
    const metro = metroAreas[city] || city;

    try {
        // Search for news about the city, metro area, and state
        const query = `"${city}" OR "${metro}" OR "${stateName}"`;
        console.log('📰 News query:', query);
        
        const response = await fetch(
            `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${limit * 2}&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('News API error:', response.status, errorData);
            return [];
        }

        const data = await response.json();
        console.log('📰 News API returned:', data.totalResults, 'articles');
        
        // Filter out irrelevant results and limit
        const filtered = data.articles
            .filter(a => a.title && !a.title.includes('[Removed]'))
            .slice(0, limit);

        return filtered.map(article => ({
            title: article.title,
            source: article.source.name,
            url: article.url,
            publishedAt: article.publishedAt,
            recency: getRecency(article.publishedAt)
        }));
    } catch (error) {
        console.error('News fetch failed:', error);
        return [];
    }
}

/**
 * Get sports news for state teams
 */
export async function getSportsNews(state, limit = 2) {
    if (!API_KEY) {
        return [];
    }

    // Map states to their major sports teams - be specific
    const stateTeams = {
        'TX': '"Dallas Cowboys" OR "Dallas Mavericks" OR "Texas Rangers" OR "Houston Texans" OR "San Antonio Spurs" OR "Dallas Stars"',
        'CA': '"Los Angeles Lakers" OR "San Francisco 49ers" OR "LA Dodgers" OR "Golden State Warriors"',
        'NY': '"New York Yankees" OR "New York Giants" OR "Brooklyn Nets" OR "New York Knicks"',
        'FL': '"Miami Heat" OR "Tampa Bay Buccaneers" OR "Miami Dolphins" OR "Jacksonville Jaguars"',
        'IL': '"Chicago Bulls" OR "Chicago Bears" OR "Chicago Cubs" OR "Chicago White Sox"',
        'PA': '"Philadelphia Eagles" OR "Pittsburgh Steelers" OR "Philadelphia 76ers"',
        'OH': '"Cleveland Cavaliers" OR "Cincinnati Bengals" OR "Cleveland Browns"',
        'GA': '"Atlanta Braves" OR "Atlanta Falcons" OR "Atlanta Hawks"',
        'AZ': '"Arizona Cardinals" OR "Phoenix Suns" OR "Arizona Diamondbacks"',
        'CO': '"Denver Broncos" OR "Denver Nuggets" OR "Colorado Rockies"'
    };

    const teamQuery = stateTeams[state] || `${state} sports`;
    console.log('🏈 Sports query:', teamQuery);

    try {
        const response = await fetch(
            `${BASE_URL}/everything?q=${encodeURIComponent(teamQuery)}&language=en&sortBy=publishedAt&pageSize=${limit * 2}&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Sports API error:', response.status, errorData);
            return [];
        }

        const data = await response.json();
        console.log('🏈 Sports API returned:', data.totalResults, 'articles');
        
        // Filter and limit
        const filtered = data.articles
            .filter(a => a.title && !a.title.includes('[Removed]'))
            .slice(0, limit);

        return filtered.map(article => ({
            headline: article.title,
            source: article.source.name,
            team: extractTeamName(article.title, state),
            url: article.url,
            recency: getRecency(article.publishedAt)
        }));
    } catch (error) {
        console.error('Sports news fetch failed:', error);
        return [];
    }
}

/**
 * Calculate recency string
 */
function getRecency(dateString) {
    const now = new Date();
    const published = new Date(dateString);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
}

/**
 * Extract team name from headline
 */
function extractTeamName(headline, state) {
    const teams = {
        'TX': ['Cowboys', 'Mavericks', 'Rangers', 'Texans', 'Spurs', 'Astros', 'Stars'],
        'CA': ['Lakers', '49ers', 'Dodgers', 'Warriors', 'Rams', 'Chargers', 'Clippers', 'Giants', 'Padres'],
        'NY': ['Yankees', 'Giants', 'Nets', 'Knicks', 'Jets', 'Mets', 'Bills', 'Rangers'],
        'FL': ['Heat', 'Buccaneers', 'Dolphins', 'Gators', 'Jaguars', 'Lightning', 'Marlins'],
        'IL': ['Bulls', 'Bears', 'Cubs', 'White Sox', 'Blackhawks'],
        'PA': ['Eagles', 'Steelers', '76ers', 'Phillies', 'Penguins', 'Flyers'],
        'OH': ['Cavaliers', 'Bengals', 'Browns', 'Buckeyes', 'Reds', 'Guardians'],
        'GA': ['Braves', 'Falcons', 'Hawks', 'United'],
        'AZ': ['Cardinals', 'Suns', 'Diamondbacks', 'Coyotes'],
        'CO': ['Broncos', 'Nuggets', 'Rockies', 'Avalanche']
    };

    const stateTeams = teams[state] || [];
    for (const team of stateTeams) {
        if (headline.toLowerCase().includes(team.toLowerCase())) {
            return team;
        }
    }
    return state + ' Sports';
}

