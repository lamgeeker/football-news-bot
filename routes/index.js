const functions = require('firebase-functions');
const axios = require('axios');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  if (intent === 'GetLatestFootballNews') {
    const apiKey = '5396ff8daa0c49fa97e42c63b16f0712';

    axios.get(`https://newsapi.org/v2/everything?q=football&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`)
      .then(response => {
        const articles = response.data.articles;

        if (articles.length === 0) {
          res.json({ fulfillmentText: 'Не вдалося знайти новини про футбол 😕' });
        } else {
          const newsList = articles.map(a => `📰 *${a.title}*\n${a.url}`).join('\n\n');
          res.json({
            fulfillmentMessages: [
              {
                text: {
                  text: ["Ось останні футбольні новини:"]
                }
              },
              {
                text: {
                  text: [newsList]
                }
              }
            ]
          });
        }
      })
      .catch(error => {
        console.error(error);
        res.json({ fulfillmentText: 'Сталася помилка при отриманні новин 😓' });
      });
  } else {
    res.json({ fulfillmentText: 'Інтенція не підтримується цим webhook' });
  }
});
