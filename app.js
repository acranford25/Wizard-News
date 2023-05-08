const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.use(express.static("public"));
app.use(morgan("dev"));

/*
app.get('/posts/:id', (req, res) => {
  console.log(req.params.id);
})

app.get(`/users/:name`, (req,res) => {
  console.log( req.params.name)
})
*/

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
  <div class="news-list">
  <header><img src="/logo.png"/>Wizard News</header>
  ${posts
    .map(
      (post) => `
      <div class='news-item'>
      <p>
      <span class="news-position">${post.id}. ▲</span>
      <a href="/posts/${post.id}">${post.title}</a>
      <small>(by ${post.name})</small>
      </p>
      <small class="news-info">
      ${post.upvotes} upvotes | ${post.date}
      </small>
      </div>`
    )
    .join("")}
      </div>
      </body>
      </html>`;

  res.send(html);
});

app.get(`/posts/:id`, (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);
  try {
    if (post.id) {
      const html = `<!DOCTYPE html>
          <html>
          <head>
          <title>Wizard News</title>
          <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
          <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          <div class='news-item'>
          <p>
          <span class="news-position">${post.id}. ▲</span>
          ${post.title}
          <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
          </small>
          </div>
          </div>
          </body>
          </html>`;
      res.send(html);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send({
    name: err.name,
    message: err.message,
  });
});

app.get("*", (req, res, next) => {
  res.status(404).send(`oops, that endpoint doesn't exist!`);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
