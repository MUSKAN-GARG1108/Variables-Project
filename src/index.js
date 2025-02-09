const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const LogInCollection = require("./mongodb");
const fs = require("fs");

const templatePath = path.join(__dirname, '../templates'); // Path to the templates directory
const cssPath = path.join(__dirname, '../css'); // Path to the css directory

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the css directory
app.use('/css', express.static(cssPath));
// Serve static files from the templates directory
app.use(express.static(templatePath));

app.get("/", (req, res) => {
  res.sendFile(path.join(templatePath, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(templatePath, "signup.html"));
});

app.post("/signup", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = {
      name: req.body.name,
      email: req.body.email, // Include email here
      password: hashedPassword,
    };

    await LogInCollection.insertMany([data]);

    // Render home.html with dynamic data
    const homeTemplate = fs.readFileSync(path.join(templatePath, "home.html"), 'utf8');
    const renderedHome = homeTemplate.replace("{{naming}}", req.body.name);
    res.send(renderedHome);
  } catch (error) {
    console.error(`Signup error: ${error.message}`);
    console.error(error.stack);
    res.status(500).send("Error occurred during signup");
  }
});


app.post("/login", async (req, res) => {
  try {
    const user = await LogInCollection.findOne({ name: req.body.name });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

      if (isPasswordMatch) {
        // Render home.html with dynamic data
        const homeTemplate = fs.readFileSync(path.join(templatePath, "home.html"), 'utf8');
        const renderedHome = homeTemplate.replace("{{naming}}", req.body.name);
        res.send(renderedHome);
      } else {
        res.send("Incorrect password");
      }
    } else {
      res.send("User not found");
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    console.error(error.stack);
    res.status(500).send("Error occurred during login");
  }
});

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying another port...`);
      startServer(port + 1);
    } else {
      console.error(`Server error: ${err.message}`);
    }
  });
};

startServer(3000);