import formidable from "formidable";

export function multipartParser(req, res, next) {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return next();
  }

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }

    const body = {};
    for (const [key, value] of Object.entries(fields)) {
      const raw = Array.isArray(value) ? value[0] : value;
      if (key === "progress") {
        body[key] = parseInt(raw, 10) || 0;
      } else {
        body[key] = raw;
      }
    }

    const mappedFiles = {};
    for (const [key, value] of Object.entries(files)) {
      if (key === "imageFile") {
        mappedFiles.imageUrl = Array.isArray(value) ? value : [value];
      } else if (key === "moduleFile") {
        mappedFiles.moduleUrl = Array.isArray(value) ? value : [value];
      } else {
        mappedFiles[key] = Array.isArray(value) ? value : [value];
      }
    }

    req.body = body;
    req.files = mappedFiles;
    next();
  });
}
