const setResponseHeadersMW = function (req, res, next) {
  res.setHeader("Content-Type", "application/json;charset=UTF-8");
  res.setHeader("X-Frame-Options", "Deny");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");

  next();
};

export default setResponseHeadersMW;
