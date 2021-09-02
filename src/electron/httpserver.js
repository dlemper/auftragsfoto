const finalhandler = require("finalhandler");
const http = require("http");
const serveStatic = require("serve-static");
const formidable = require("formidable");
const path = require("path");
const mv = require("mv");
const fs = require("fs").promises;

const { getPath } = require("./getpath");

const serve = serveStatic(path.join(__dirname, "client", "dist"), {
  index: ["index.html", "index.htm"],
});

const fromParse = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable();

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });

const mvClob = (from, to) =>
  new Promise((resolve, reject) =>
    mv(from, to, { clobber: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );

// Create server
const server = http.createServer(async function onRequest(req, res) {
  const { pathname, searchParams } = new URL(
    req.url,
    `http://${req.headers.host}`
  );
  const method = req.method.toLowerCase();
  console.log(pathname, searchParams, method);

  if (pathname === "/api/file" && method === "head") {
    try {
      await fs.stat(searchParams.get("name"));

      res.writeHead(200);
      res.end();
    } catch {
      res.writeHead(404);
      res.end();
    }
  } else if (pathname === "/api/upload" && method === "post") {
    try {
      const { files } = await fromParse(req);
      const uploadDir = await getPath();

      for (const file of Object.values(files)) {
        await mvClob(file.path, path.join(uploadDir, file.name));
      }

      res.writeHead(200);
      res.end();
    } catch (e) {
      if (e.message.startsWith("EEXIST")) {
        res.writeHead(403);
      } else {
        res.writeHead(500);
      }

      res.write(e.message);
      res.end();
    }
  } else {
    console.log("serve file");
    serve(req, res, finalhandler(req, res));
  }
});

// Listen
server.listen(3000);
