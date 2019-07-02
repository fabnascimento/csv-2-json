const express = require('express');
const next = require('next');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/'
});
const csv = require('csvtojson')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post';
      const queryParams = {
        title: req.params.id
      };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.post('/csv-to-json', upload.single('csv'), (req, res, next) => {
      if (req.file) {
        csv()
          .fromFile(req.file.path)
          .then((jsonObj) => {
            fs.unlink(req.file.path, () => {
              res.setHeader('file-name', req.file.filename)
              res.json({jsonObj})
            })
          })
      }
    })

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });