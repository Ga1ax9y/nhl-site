const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser()

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173', // 172.20.10.2:5173
    methods: ['GET'],
  })
);

app.get('/api/teams', async (req, res) => {
  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/franchise');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/standings/:season', async (req, res) => {
  try{
    let { season } = req.params || 'now'
    const response = await axios.get(`https://api-web.nhle.com/v1/standings/${season}`)
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
})

app.get('/api/standings-season', async (req, res) => {
  try{
    const response = await axios.get('https://api-web.nhle.com/v1/standings-season')
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
})

app.get('/api/stats/:season', async (req, res) => {
  try{
    let { season } = req.params
    if (season !== 'current') season = `${season}/2`

    const [skaterData, goalieData] = await Promise.all([
      axios.get(`https://api-web.nhle.com/v1/skater-stats-leaders/${season}?limit=50`),
      axios.get(`https://api-web.nhle.com/v1/goalie-stats-leaders/${season}?limit=50`)
    ]);
    const fullStats = Object.assign(skaterData.data, goalieData.data)
    res.json(fullStats)
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
})

app.get('/api/roster/:teamAbbrev', async (req, res) => {
  try {
    const { teamAbbrev } = req.params;

    if (!/^[A-Z]{3}$/.test(teamAbbrev)) {
      return res.status(400).json({ error: 'Invalid team abbreviation' });
    }

    const response = await axios.get(`https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`);
    res.json(response.data);

  } catch (error) {
    console.error(`Error fetching roster for ${req.params.teamAbbrev}:`, error.message);
    res.status(500).json({
      error: `Failed to fetch roster for team ${req.params.teamAbbrev}`
    });
  }
});

app.get('/api/player/:playerId', async (req, res) => {
  try{
    const { playerId } = req.params
    const response = await axios.get(`https://api-web.nhle.com/v1/player/${playerId}/landing`)
    res.json(response.data)
  }
  catch (error) {
    console.error('Error fetching player info:', error.message);
    res.status(500).json({ error: 'Failed to fetch player info' });
  }
});

app.get('/api/news', async (req, res) => {
  try{
    const response = await parser.parseURL('https://www.eliteprospects.com/rss/league/nhl/transactions')
    response.items.map(item =>{
      const statusMatch = item.contentSnippet.match(/^Status: .+?(?=\n|$)/);
      item.contentSnippet = statusMatch ? statusMatch[0] : item.contentSnippet;
      return item;
    }
    )
    res.json({
      items: response.items
    })
  }
  catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


const getSchedule = async (req, res) => {
  try {
    let { date } = req.params;

    if (date && date !== 'now' && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD or "now"' });
    }

    const response = await axios.get(`https://api-web.nhle.com/v1/schedule/${date || 'now'}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

app.get('/api/schedule', getSchedule);
app.get('/api/schedule/:date', getSchedule);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
