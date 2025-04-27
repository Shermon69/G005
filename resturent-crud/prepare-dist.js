const fs = require("fs");
const path = require("path");

// Read the original app.js
const appJsPath = path.join(__dirname, "app.js");
let appJsContent = fs.readFileSync(appJsPath, "utf8");

// Replace ./src/ paths with ./
appJsContent = appJsContent.replace(/\.\/src\//g, "./");

// Write the modified app.js to dist
const distAppJsPath = path.join(__dirname, "dist", "app.js");
fs.writeFileSync(distAppJsPath, appJsContent);

console.log("Modified app.js created in dist folder");
