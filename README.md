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

The `listbranches` command also gives you the option of entering in a corresponding key from the table to copy the path to the repo - `Input the 'Key' and hit enter to copy the path of the repo.` You can `<Enter>` with an empty value or `<Ctl-C>` to exit.
