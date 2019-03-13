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

function createTag() {
  return gulp.src(["./package.json"]).pipe(tag());
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

gulp.task("release", gulp.series(versionBump, createCommit, createTag));
