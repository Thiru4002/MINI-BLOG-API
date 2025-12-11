const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

// security headers
app.use(helmet());

// enable cors
app.use(cors());

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later"
});
app.use("/api", limiter);

// parse JSON
app.use(express.json());

// routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const {swaggerUi,swaggerSpec} = require("./config/swagger");

/* ---------------------------
   SWAGGER SETUP
----------------------------*/

const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    requestInterceptor: (req) => {
      // header names can be lower/upper case depending on environment
      const header = req.headers.Authorization || req.headers.authorization;

      if (header) {
        // if header exists but does NOT already start with "Bearer "
        if (!/^Bearer\s/i.test(header)) {
          // set the correctly prefixed header
          req.headers.Authorization = "Bearer " + header;
        }
      }
      return req;
    }
  }
};

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

/* ---------------------------
   API ROUTES
----------------------------*/
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


/* ---------------------------
   GLOBAL ERROR HANDLER
----------------------------*/
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ error: err.message || 'something went wrong' });
});

module.exports = app;
