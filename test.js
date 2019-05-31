const nock = require("nock");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const fs = require("fs");
const sceleCrawler = require("./index");

const homepage = fs.readFileSync("mock/homepage.html");
const loginFailed = fs.readFileSync("mock/login-failed.html");
const courseDetail = fs.readFileSync("mock/course-detail.html");

let courses = null;

it("throw error when access broken link", async () => {
  nock("https://scele.cs.ui.ac.id")
    .post("/login/", { username: "abc", password: "def" })
    .reply(404);

  await expect(sceleCrawler.login("abc", "def")).to.be.rejected;
});

it("throw error when login failed", async () => {
  nock("https://scele.cs.ui.ac.id")
    .post("/login/", { username: "abc", password: "def" })
    .reply(200, loginFailed);

  await expect(sceleCrawler.login("abc", "def")).to.be.rejectedWith(
    "Login failed"
  );
});

it("can login properly", async () => {
  nock("https://scele.cs.ui.ac.id")
    .post("/login/", { username: "abc", password: "def" })
    .reply(200, homepage);

  await expect(sceleCrawler.login("abc", "def")).to.be.fulfilled;
});

it("can get profile", () => {
  profile = sceleCrawler.getProfile();
  expect(profile).to.deep.equal({
    npm: "1706028695",
    fullName: "Muhammad Indra Ramadhan",
    nickName: "Indra"
  });
});

it("can get courses", () => {
  courses = sceleCrawler.getCourses();

  expect(courses).to.have.lengthOf(3);

  expect(courses[0].shortTitle).to.equal("Fisdas-Gasal");
  expect(courses[0].longTitle).to.equal("Fisika Dasar");
  expect(courses[0].link).to.equal(
    "https://scele.cs.ui.ac.id/course/view.php?id=1"
  );
  expect(courses[0].fetchInfo).to.be.instanceOf(Function);

  expect(courses[1].shortTitle).to.equal("AP-Gasal");
  expect(courses[1].longTitle).to.equal("Advanced Programming");
  expect(courses[1].link).to.equal(
    "https://scele.cs.ui.ac.id/course/view.php?id=2"
  );
  expect(courses[1].fetchInfo).to.be.instanceOf(Function);

  expect(courses[2].shortTitle).to.equal("Alin-Gasal");
  expect(courses[2].longTitle).to.equal("Aljabar Linier");
  expect(courses[2].link).to.equal(
    "https://scele.cs.ui.ac.id/course/view.php?id=3"
  );
  expect(courses[2].fetchInfo).to.be.instanceOf(Function);
});

it("can get course detail", async () => {
  nock("https://scele.cs.ui.ac.id")
    .get("/course/view.php?id=1")
    .reply(200, courseDetail);

  const courseInfo = await courses[0].fetchInfo();

  expect(Object.keys(courseInfo)).to.deep.equal([
    "General",
    "Mekanika",
    "Latihan Soal Mekanika",
    "Listrik dan Magnet",
    "Latihan UAS",
    "Topic 5",
    "Topic 6",
    "Topic 7"
  ]);

  expect(courseInfo["General"]).to.deep.equal({
    announcement: "",
    files: [
      {
        fileType: "Forum",
        link: "https://scele.cs.ui.ac.id/mod/forum/view.php?id=21758",
        fileName: "Announcements"
      },
      {
        fileType: "File",
        link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=22146",
        fileName: "Detail Silabus"
      },
      {
        fileType: "File",
        link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=22794",
        fileName: "Update Silabus"
      },
      {
        fileType: "Choice",
        link: "https://scele.cs.ui.ac.id/mod/choice/view.php?id=23409",
        fileName: "Jadwal Asistensi Kelas A"
      },
      {
        fileType: "Choice",
        link: "https://scele.cs.ui.ac.id/mod/choice/view.php?id=24468",
        fileName: "poling asistensi kelas C"
      }
    ]
  });

  expect(courseInfo["Latihan UAS"].announcement).to.equal(
    "Silahkan menghadiri kelas tambahan:\nSabtu 13.00 - 15.00 di 3113\nSenin 18.00 - 20.00 di 3113"
  );
});
