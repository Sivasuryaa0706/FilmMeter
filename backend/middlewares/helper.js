exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.trailer = JSON.parse(cast);
  if (genres) req.body.trailer = JSON.parse(genres);
  if (tags) req.body.trailer = JSON.parse(tags);
  if (writers) req.body.trailer = JSON.parse(writers);

  next();
};
