import express from "express";
import path from "path";

export function serveFrontend(app: express.Express, clientDistPath: string) {
  app.use(
    "/assets",
    express.static(path.join(clientDistPath, "assets"), {
      immutable: true,
      maxAge: "1y",
      etag: false,
      fallthrough: false,
    }),
  );

  app.use(
    express.static(clientDistPath, {
      etag: false,
      maxAge: 0,
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      },
    }),
  );

  app.get("/*splat", (_req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}
