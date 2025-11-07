/********************************************************************************
*  WEB322 – Assignment 02
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*  Name: Ashmit George / Student ID:185084233 / Date: 2025-11-06
*  Published URL: ___________________________________________________________
********************************************************************************/

const express = require("express");
const path = require("path");
const {
  initialize,
  getAllProjects,
  getProjectsBySector,
  getProjectById
} = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 8080;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));


app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));


app.get("/solutions/projects", async (req, res) => {
  try {
    const { sector } = req.query;
    const projects = sector
      ? await getProjectsBySector(sector)
      : await getAllProjects();

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .render("404", { message: `No projects found${sector ? ` for sector: ${sector}` : ""}` });
    }
    res.render("projects", { projects });
  } catch (err) {
    res.status(404).render("404", { message: err?.message || String(err) });
  }
});


app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const project = await getProjectById(id);
    res.render("project", { project });
  } catch (err) {
    res.status(404).render("404", { message: err?.message || "Project not found" });
  }
});


app.use((_req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});


initialize()
  .then(() => {
    if (!process.env.VERCEL) {
      app.listen(PORT, () => console.log(`Server running locally on ${PORT}`));
    }
  })
  .catch(err => console.error("Initialization failed:", err));

module.exports = app;

