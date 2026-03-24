/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const serveStatic = require("serve-static");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3002; // Ensure port is correctly set
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        // Serve static files
        if (req.url.startsWith("/public")) {
            const serve = serveStatic(path.join(__dirname, "public"));
            serve(req, res, () => { });
            return;
        }

        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === "/a") {
            app.render(req, res, "/a", query);
        } else if (pathname === "/b") {
            app.render(req, res, "/b", query);
        } else {
            handle(req, res, parsedUrl);
        }
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });

    server.on("error", (err) => {
        console.error(err);
        process.exit(1);
    });
});

