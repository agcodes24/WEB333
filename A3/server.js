/********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*  Name: Ashmit George / Student ID:185084233 / Date: 2025-12-06
*  Published URL: _____https://web333assignment-02-lnwd2023f-ashmit-georges-projects.vercel.app/______________________________________________________
********************************************************************************/

const express = require("express");
const path = require("path");
const session = require("client-sessions");
require("dotenv").config();

const projectService = require("./modules/projects");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// sessions
app.use(
    session({
        cookieName: "session",
        secret: process.env.SESSIONSECRET,
        duration: 24 * 60 * 60 * 1000,
    })
);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.set("view engine", "ejs");

// middleware
function ensureLogin(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    next();
}

// HOME
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));

// PROJECT LIST
app.get("/solutions/projects", (req, res) => {
    projectService.getAllProjects()
        .then(data => res.render("projects", { projects: data }))
        .catch(() => res.render("500"));
});

// PROJECT DETAILS
app.get("/solutions/projects/:id", (req, res) => {
    projectService.getProjectById(req.params.id)
        .then(data => {
            if (data) res.render("project", { project: data });
            else res.render("404");
        })
        .catch(() => res.render("404"));
});

// ADD PROJECT
app.get("/solutions/addProject", ensureLogin, (req, res) => {
    res.render("addProject");
});

app.post("/solutions/addProject", ensureLogin, (req, res) => {
    projectService.addProject(req.body)
        .then(() => res.redirect("/solutions/projects"))
        .catch(() => res.render("500"));
});

// EDIT PROJECT
app.get("/solutions/editProject/:id", ensureLogin, (req, res) => {
    projectService.getProjectById(req.params.id)
        .then(data => res.render("editProject", { project: data }))
        .catch(() => res.render("500"));
});

app.post("/solutions/editProject", ensureLogin, (req, res) => {
    projectService.editProject(req.body.id, req.body)
        .then(() => res.redirect("/solutions/projects"))
        .catch(() => res.render("500"));
});

// DELETE PROJECT
app.get("/solutions/deleteProject/:id", ensureLogin, (req, res) => {
    projectService.deleteProject(req.params.id)
        .then(() => res.redirect("/solutions/projects"))
        .catch(() => res.render("500"));
});

// LOGIN
app.get("/login", (req, res) => {
    res.render("login", { errorMessage: "", userName: "" });
});

app.post("/login", (req, res) => {
    const { userName, password } = req.body;

    if (
        userName === process.env.ADMINUSER &&
        password === process.env.ADMINPASSWORD
    ) {
        req.session.user = { userName };
        return res.redirect("/solutions/projects");
    }

    res.render("login", {
        errorMessage: "Invalid User Name or Password",
        userName,
    });
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

projectService.initialize().then(() => {
    app.listen(8080, () => console.log("Server started"));
});
