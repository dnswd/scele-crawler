const sceleCrawler = require("./index");
const c = require("chalk");

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

  console.log("=== FETCH DETAIL ===");
  const courseInfo = await courses[0].fetchDetail();
  Object.keys(courseInfo).forEach(title => {
    console.log(c.bgCyan.black(title));

    const content = courseInfo[title];

    if (content.announcement) {
      console.log("- announcement:");
      console.log(c.yellow(content.announcement));
    }

    if (content.contents.length > 0) {
      content.contents.forEach(content => {
        console.log("> " + c.green(content.title) + " (" + content.type + ")");
        console.log("  " + content.link);
        if (content.comment) {
          console.log("  " + c.yellow(content.comment));
        }
      });
    }
  });
};

main();
