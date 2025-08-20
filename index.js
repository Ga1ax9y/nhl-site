const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser()

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET'],
  })
);

// Прокси для команд
app.get('/api/teams', async (req, res) => {
  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/franchise');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/standings', async (req, res) => {
  try{
    const response = await axios.get('https://api-web.nhle.com/v1/standings/now')
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    res.status(500).json({ error: 'Failed to fetch standings' });
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
})

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`🔗 Пример: http://localhost:${PORT}/api/teams`);
});
