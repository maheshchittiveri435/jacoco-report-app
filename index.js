const express = require('express');

//code fom crash course
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // if (req.url === '/') {
  //   fs.readFile(
  //     path.join(__dirname, 'public', 'index.html'),
  //     (err, content) => {
  //       if (err) throw err;
  //       res.writeHead(200, { 'Content-Type': 'text/html' });
  //       res.end(content);
  //     }
  //   );
  // }

  // if (req.url === '/api/users') {
  //   const users = [
  //     { name: 'Bob Smith', age: 40 },
  //     { name: 'John Doe', age: 30 }
  //   ];
  //   res.writeHead(200, { 'Content-Type': 'application/json' });
  //   res.end(JSON.stringify(users));
  // }

  // Build file path
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  // Extension of file
  let extname = path.extname(filePath);

  // Initial content type
  let contentType = "text/html";

  // Check ext and set content type
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Check if contentType is text/html but no .html file extension
  if (contentType == "text/html" && extname == "") filePath += ".html";

  // log the filePath
  console.log(filePath);

  // Read File
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == "ENOENT") {
        // Page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content, "utf8");
          }
        );
      } else {
        //  Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Serve static files (like HTML reports) from the 'public' directory

app.get('/', (req, res) => {
    res.send('<h1>Heyy, Welcome to the report app!</h1><p>Visit these links:<br><a href="/reports/reportNewer/reportNewer.html">Report 1</a><br><a href="/reports/reportNew.html">Report 2</a></p>');

});

app.get('/reports/:reportNew', (req, res) => {
    const reportName = req.params.reportNew;
    const filePath = path.join(__dirname, 'reports', reportName);
    console.log('Report Name:', reportName);
    console.log('File Path:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Report not found');
        }
    });
});
app.get('/reports/reportNewer/reportNewer.html', (req, res) => {
    const reportName = req.params.reportNewer;
    const filePath = path.join(__dirname, 'reports/reportNewer', 'reportNewer.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Report not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
