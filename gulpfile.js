var gulp = require("gulp"),
  bump = require("gulp-bump"),
  git = require("gulp-git"),
  tag = require("gulp-tag-version"),
  error = require("plugin-error"),
  min = require("minimist");
const spawn = require("child_process").spawn;

const gitOptions = {
  semver: ""
};

function changelog(done) {
  const image = "ferrarimarco/github-changelog-generator";
  const version = require("./package.json").version;
  const ghToken = process.env.GITHUB_TOKEN;

  var run = spawn(
    "docker",
    [
      "run",
      "-it",
      "--rm",
      "-v",
      process.cwd() + ":/usr/local/src/your-app",
      image,
      "--token",
      ghToken,
      "--future-release",
      "v" + version
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit"
    }
  );

  run.on("exit", function(exitCode) {
    done(exitCode);
  });
}

function createTag() {
  return gulp.src(["./package.json"]).pipe(tag_version());
}

function createCommit() {
  return gulp
    .src(["./package.json", "./package-lock.json", "./.github/CHANGELOG.md"])
    .pipe(git.commit("version bump"));
}

function versionBump(done) {
  var options = min(process.argv.slice(2), gitOptions);
  return gulp
    .src(["./package.json", "package-lock.json"])
    .pipe(bump({ type: options.semver }))
    .pipe(gulp.dest("./"))
    .on("end", () => {
      done();
    });
}

gulp.task("changelog", gulp.series(changelog));
gulp.task(
  "release",
  gulp.series(versionBump, changelog, createCommit, createTag)
);
