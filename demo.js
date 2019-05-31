const sceleCsCrawler = require("./index");

const main = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  const username = argv.username;
  const password = argv.password;

  if (!username) {
    throw new Error("username required");
  }

  if (!password) {
    throw new Error("password required");
  }

  await sceleCsCrawler.login(username, password);

  console.log("=== PROFILE ===");
  console.log(sceleCsCrawler.getProfile().npm);
  console.log(sceleCsCrawler.getProfile().fullName);
  console.log(sceleCsCrawler.getProfile().nickName);

  console.log("=== COURSES ===");
  sceleCsCrawler
    .getCourses()
    .forEach(course =>
      console.log(course.longTitle + " (" + course.shortTitle + ")")
    );
};

main();
