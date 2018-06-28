const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/', function(req, res){
    res.render('index');    
})

app.post("/news", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const category = req.body.category;
    const rows = req.body.rows;
    let url, quantity, title;
    switch(category) {
        case 'today':  
         url = 'https://rg.ru/news.html';
         title = 'сегодня';
         break;    
        case 'culture':  
          url = 'https://rg.ru/tema/kultura/';
          title = 'культуры';
          break;    
        case 'sport':
         url = 'https://rg.ru/tema/sport/';
         title = 'спорта';
         break;
        case 'economy':
         url = 'https://rg.ru/tema/ekonomika/';
         title = 'экономики';
         break;
      };
    let news = [];
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            switch(rows) {
                case 'all':  
                    quantity = $('.b-news-inner__list .b-news-inner__list-item').length;
                    break;    
                case '5':  
                    quantity = 5;
                    break;    
                case '10':
                    quantity = 10;
                    break;
              }
            $('.b-news-inner__list .b-news-inner__list-item').each(function(i, element){
                if(i<=quantity-1) {
                    const titleText = $(this).find('.b-news-inner__list-item-title a');
                    const timeText = $(this).find('.b-news-inner__list-item-date._date');
                    news.push(
                        {
                            newTitle: titleText.text(),
                            time: timeText.text()
                        }
                    );
                }
            });
        }
        res.render('news', {    
            news: news,
            title: title
        });
    });
    
});

app.listen(8888)


