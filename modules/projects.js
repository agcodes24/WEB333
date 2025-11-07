const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = projectData.map(proj => {
        const sector = sectorData.find(s => s.id === proj.sector_id);
        return { ...proj, sector: sector ? sector.sector_name : "Unknown" };
      });
      resolve();
    } catch (err) {
      reject("Failed to initialize projects: " + err);
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    projects.length > 0 ? resolve(projects) : reject("No projects available");
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const proj = projects.find(p => p.id === projectId);
    proj ? resolve(proj) : reject("Unable to find requested project");
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const results = projects.filter(p =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );
    results.length > 0
      ? resolve(results)
      : reject("Unable to find projects for sector: " + sector);
  });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
