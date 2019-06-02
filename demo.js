/* eslint no-console: 0 */

const c = require('chalk');
const minimist = require('minimist');
const sceleCrawler = require('./index');

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  const { username } = argv;
  const { password } = argv;

  if (!username) {
    throw new Error('username required');
  }

  if (!password) {
    throw new Error('password required');
  }

  await sceleCrawler.login(username, password);

  console.log('=== PROFILE ===');
  const profile = sceleCrawler.getProfile();
  console.log(profile.npm);
  console.log(profile.fullName);
  console.log(profile.nickName);

  console.log('=== COURSES ===');
  const courses = sceleCrawler.getCourses();
  courses.forEach(course => console.log(`${course.longTitle} (${course.shortTitle})`));

  console.log('=== FETCH DETAIL ===');
  const courseDetail = await courses[0].fetchDetail();
  Object.keys(courseDetail).forEach((title) => {
    console.log(c.bgCyan.black(title));

    const section = courseDetail[title];

    if (section.announcement) {
      console.log('- announcement:');
      console.log(c.yellow(section.announcement));
    }

    if (section.contents.length > 0) {
      section.contents.forEach((content) => {
        console.log(`> ${c.green(content.title)} (${content.type})`);
        console.log(`  ${content.link}`);
        if (content.comment) {
          console.log(`  ${c.yellow(content.comment)}`);
        }
      });
    }
  });
};

main();
