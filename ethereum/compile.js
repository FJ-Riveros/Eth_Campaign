const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
//Delete the build foler
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

//Compilation
const output = solc.compile(source, 1).contracts;
//Creates the build folder
fs.ensureDirSync(buildPath);
console.log(output);
//We iterate through the contracts and creating the output files in build
for (let contract in output) {
  let name = contract.replace(":", "");
  fs.outputJsonSync(path.resolve(buildPath, name + ".json"), output[contract]);
}
