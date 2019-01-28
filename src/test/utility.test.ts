import { Utility } from "../utility";
import * as assert from "assert";

suite("Utility Tests", () => {
  let util = new Utility();

  suite("Get Configuration Checks", () => {
    test("Get Jvm Memory", () => {
      assert.equal(util.getJvmMemory(), "768m");
    });
    test("Get Java Class Path", () => {
      assert.equal(util.getJavaClassPath(), null);
    });
    test("Get FitNesse Jar Location", () => {
      assert.equal(
        util.getFitJar(),
        "C:\\someLocation\\testing\\fitnesse\\fitnesse-standalone.jar"
      );
    });
    test("Get FitNesse Port", () => {
      assert.equal(util.getFitPort(), "8080");
    });
    test("Get Root Path", () => {
      assert.equal(util.getRootPath(), null);
    });
    test("Get FitNesse Root", () => {
      assert.equal(util.getFitnesseRoot(), null);
    });
    test("Get Log Level", () => {
      assert.equal(util.getLogLevel(), null);
    });
    test("Get Log Directory", () => {
      assert.equal(util.getLogDirectory(), null);
    });
    test("Get Version Controller Days", () => {
      assert.equal(util.getVersionsControllerDays(), null);
    });
    test("Get Omitting Updates", () => {
      assert.equal(util.getOmittingUpdates(), null);
    });
    test("Get Redirect Output", () => {
      assert.equal(util.getRedirectOutput(), null);
    });
    test("Get Plugins", () => {
      assert.equal(util.getPlugins(), null);
    });
    test("Get Pre Execution Command", () => {
      assert.equal(util.getPreExecCommand(), null);
    });
    test("Get Post Execution Command", () => {
      assert.equal(util.getPostExecCommand(), null);
    });
    test("Get Top Page", () => {
      assert.equal(util.getTopPage(), "FrontPage");
    });
  });
  suite("Get Command Checks", () => {
    test("Get Other Command Arguments", () => {
      assert.equal(util.getOtherCommandArguments(), "");
    });
  });
});
