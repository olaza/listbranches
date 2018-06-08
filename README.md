# listbranches

A tool to help you get a quick overview of all your local repos.

### Installation

```
npm i -g https://github.com/mkartchner994/listbranches.git
```

This will install the command `listbranches` to your path.

### .listbranchesrc.json

In order for the `listbranches` command to work, you need to create the `.listbranchesrc.json` config file in your home directory - `~/.listbranchesrc.json`. The format of the file should be as follows - `"<repo name>": "<absolute path to the repo folder>"`. Example:

```json
{
  "one": "/Users/example/repos/one",
  "two": "/Users/example/repos/two",
  "three": "/Users/example/repos/three"
}
```

### Running the command

Running the `listbranches`command will give you an output for all of your repos defined in the `.listbranchesrc.json` config -- something like:

| Key | Repo  | Branch | Behind | Ahead |
| --- | ----- | ------ | ------ | ----- |
| 0   | ONE   | master | 0      | 0     |
| 1   | TWO   | master | 0      | 0     |
| 2   | THREE | master | 0      | 0     |

If you want to get a more update-to-date view for the `Behind` and `Ahead` commit numbers, run `listbranches` with the `--fetch` or `-f` flag. This will run a `git fetch` on all the repos before returning the data table.

If you want to pull changes in the particular repo, run `listbranches` with the `--pull` or `-p` flag. This will show the table of your repos and following message - `Input the 'Key' and hit enter to pull changes to the repo.` You can `<Enter>` key of your repo and it will run a `git pull` for the appropriate repo.

The `listbranches` command also gives you the option of entering in a corresponding key from the table to copy the path to the repo - `Input the 'Key' and hit enter to copy the path of the repo.` You can `<Enter>` with an empty value or `<Ctl-C>` to exit.

### Contributing

To contribute, fork the main project and checkout your forked version. Create a new branch with your changes and push it to your fork.

Override the `listbranches` command to point to your forked version. `cd` into your forked repo's directory, then run:

`npm link`

Test your changes. If everything works, create a pull request from your forked branch back to my master branch on Github.

If your pull request gets merged, you can then reinstall from this package to get the latest updates.

```
npm i -g https://github.com/mkartchner994/listbranches.git
```
