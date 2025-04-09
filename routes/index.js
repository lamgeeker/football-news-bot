const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.post('/webhook', async (req, res) => {
  try {
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything?q=football&language=en&pageSize=3&apiKey=${NEWS_API_KEY}`
    );

    const articles = newsResponse.data.articles;
    const messages = articles.map((a, i) => `${i + 1}. ${a.title}\n${a.url}`).join('\n\n');

    return res.json({
      fulfillmentText: `Ось найсвіжіші футбольні новини:\n\n${messages}`,
    });
  } catch (error) {
    console.error('Помилка при отриманні новин:', error.message);
    return res.json({
      fulfillmentText: 'Вибач, не вдалося отримати новини 🥲',
    });
  }
});

app.get('/', (req, res) => {
  res.send('Football bot is running!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущено');
});
