const { homedir } = require("os");
const { readFile } = require("fs");
const { exec } = require("child_process");
const { blue, magenta, green, red, cyan } = require("chalk");
const Table = require("cli-table");
const readline = require("readline");
const ncp = require("copy-paste");

/*---------- Exported Function ----------*/

function listBranches() {
  readFile(`${homedir}/.listbranchesrc.json`, "utf8", async (err, repos) => {
    // The user doesn't have their repo config file set, so we don't know what repos they want to search.
    if (!repos) {
      console.error(
        red(
          `Could not find the \`.listbranchesrc.json\` config file in your home directory - ${homedir}`
        )
      );
      return;
    }
    // Found the config, moving on.
    try {
      repos = JSON.parse(repos);
    } catch (e) {
      console.error(
        red(
          "Could not correctly parse the JSON in your `.listbranchesrc.json` config file."
        )
      );
      return;
    }

    const repoNames = Object.keys(repos);

    let args = {};
    process.argv.forEach((arg, index) => {
      args[arg] = index;
    });

    if (args["--help"] || args["-h"]) {
      console.log(`\nusage: listbranches  [--help | -h] [--fetch | -f]\n`);
      let helpTable = new Table();
      helpTable.push(["--help, -h", " Shows this help menu."]);
      helpTable.push([
        "--fetch, -f",
        " Calls `git fetch` for all the repos\n before showing the data table.\n Useful for getting more\n accurate `Behind` and `Ahead`\n commit numbers."
      ]);
      console.log(helpTable.toString());
      return;
    }

    // If we pass in the --fetch or -f arg.
    if (args["--fetch"] || args["-f"]) {
      console.log(`Fetching...\n`);

      for (const repoName of repoNames) {
        const repoPath = repos[repoName];
        await execPromise(`git -C ${escapeShellArg(repoPath)} fetch`);
      }
    } else {
      // Give our selves some spacing.
      console.log("");
    }

    let table = new Table();
    table.push(["Key", "Reop", "Branch", "Behind", "Ahead"]);

    for (const [index, repoName] of repoNames.entries()) {
      const repoPath = repos[repoName];
      const { branchName, commitsBehind, commitsAhead } = await getRepoInfo(
        repoPath
      );
      table.push([
        index,
        blue(repoName.toUpperCase()),
        magenta(branchName),
        red(commitsBehind),
        green(commitsAhead)
      ]);
    }

    console.log(`${table.toString()}\n`);

    // After we have output the branch info, let see
    // if we want to copy any of the repo info.
    console.log("Input the `Key` and hit enter to copy the path of the repo.");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // On the `<Enter>`, or `<Return>` key.
    rl.on("line", input => {
      if (!input) {
        rl.close();
      } else {
        const repoNameToCopy = repoNames[input];
        if (repoNameToCopy) {
          const repoPath = repos[repoNameToCopy];
          ncp.copy(repoPath, function() {
            console.log(`${repoNameToCopy.toUpperCase()} Copied`);
          });
        } else {
          console.log("Not a valid key. Try again.");
        }
      }
    });
    // Let ourselves know we are done.
    rl.on("close", () => {
      console.log(cyan(`DONE!\n`));
    });
  });
}

/*---------- Helper Methods ----------*/

function getRepoInfo(repoPath) {
  return new Promise(async (resolve, reject) => {
    const branchName = await gitBranchName(repoPath);
    const commitsBehind = await gitAheadOrBehine(
      repoPath,
      branchName,
      `origin/${branchName}`
    );
    const commitsAhead = await gitAheadOrBehine(
      repoPath,
      `origin/${branchName}`,
      branchName
    );
    resolve({ branchName, commitsBehind, commitsAhead });
  });
}

async function gitAheadOrBehine(path, branchOne, branchTwo) {
  return await execPromise(
    `git -C ${escapeShellArg(path)} rev-list ${branchOne}..${branchTwo} --count`
  )
    .then(({ stdout, stderr }) => {
      return stdout.trim();
    })
    .catch(e => {
      // Probably cant find it on origin
      return "none";
    });
}

async function gitBranchName(path) {
  return await execPromise(
    `git -C ${escapeShellArg(path)} rev-parse --abbrev-ref HEAD`
  ).then(({ stdout, stderr }) => {
    return stdout.trim();
  });
}

function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

module.exports = listBranches;
