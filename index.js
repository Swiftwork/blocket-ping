require('dotenv').config();

const request = require('request');
const PushBullet = require('pushbullet');
const { parse } = require('node-html-parser');
const pusher = new PushBullet('o.tZ74a8iQR3IgMhfuGIwpZGbf1lez9IWP');

let previous = '';

function search() {
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
  if (item.id !== previous) {
    previous = item.id;
    const content = item.querySelector('.media-heading a');
    notify(content.text, content.attributes.href);
  }
}

function notify(title, link) {
  pusher.link(null, 'Blocket New Article', link, title, (error, response) => {
    if (error) console.warn(error);
  });
}

setInterval(() => {
  search();
}, 30000);

search();
