const sceleCrawler = require("./index");

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

  await sceleCrawler.login(username, password);

  console.log("=== PROFILE ===");
  const profile = sceleCrawler.getProfile();
  console.log(profile.npm);
  console.log(profile.fullName);
  console.log(profile.nickName);

  console.log("=== COURSES ===");
  const courses = sceleCrawler.getCourses();
  courses.forEach(course =>
    console.log(course.longTitle + " (" + course.shortTitle + ")")
  );
};

main();
