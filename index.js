require('dotenv').config();

const http = require('http');
const request = require('request');
const PushBullet = require('pushbullet');
const { parse } = require('node-html-parser');
const pusher = new PushBullet(process.env.PUSHBULLET);

let previous = {};

function search() {
  console.debug(`Searching on ${process.env.URL}`);
  request(
    process.env.URL || 'https://www.blocket.se/hela_sverige',
    (error, response, body) => {
      if (error) console.warn(error);
      extract(body);
    },
  );
}

function extract(html) {
  const root = parse(html);
  const item = root.querySelector('#item_list .item_row_first');
  if (item.id !== previous.id) {
    console.debug(`New top item is ${item.id}, previous was ${previous.id}`);
    const content = item.querySelector('.media-heading a');
    previous = {
      id: item.id,
      title: content.text,
      link: content.attributes.href,
    };
    notify(previous.title, previous.link);
  }
}

function notify(title, link) {
  pusher.link(null, 'Blocket New Article', link, title, (error, response) => {
    if (error) console.warn(error);
    console.debug(`Notified all devices`);
  });
}

setInterval(() => {
  search();
}, 60 * 1000);

search();

http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
      `New top item is <a href="${previous.link}">${previous.title}</a>`,
    );
    res.end();
  })
  .listen(8080);
