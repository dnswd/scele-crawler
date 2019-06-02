const nock = require("nock");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const fs = require("fs");
const sceleCrawler = require("./index");

const mockHomepage = fs.readFileSync("mock/homepage.html");
const mockLoginFailed = fs.readFileSync("mock/login-failed.html");
const mockCourseDetail = fs.readFileSync("mock/course-detail.html");

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
    .reply(200, mockLoginFailed);

  await expect(sceleCrawler.login("abc", "def")).to.be.rejectedWith(
    "Login failed"
  );
});

it("can login properly", async () => {
  nock("https://scele.cs.ui.ac.id")
    .post("/login/", { username: "abc", password: "def" })
    .reply(200, mockHomepage);

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
  expect(courses[0].fetchDetail).to.be.instanceOf(Function);

  expect(courses[1].shortTitle).to.equal("AP-Gasal");
  expect(courses[1].longTitle).to.equal("Advanced Programming");
  expect(courses[1].link).to.equal(
    "https://scele.cs.ui.ac.id/course/view.php?id=2"
  );
  expect(courses[1].fetchDetail).to.be.instanceOf(Function);

  expect(courses[2].shortTitle).to.equal("Alin-Gasal");
  expect(courses[2].longTitle).to.equal("Aljabar Linier");
  expect(courses[2].link).to.equal(
    "https://scele.cs.ui.ac.id/course/view.php?id=3"
  );
  expect(courses[2].fetchDetail).to.be.instanceOf(Function);
});

it("can get course detail", async () => {
  nock("https://scele.cs.ui.ac.id")
    .get("/course/view.php?id=1")
    .reply(200, mockCourseDetail);

  const courseDetail = await courses[0].fetchDetail();

  expect(Object.keys(courseDetail)).to.deep.equal([
    "General",
    "Mekanika",
    "Latihan Soal Mekanika",
    "Listrik dan Magnet",
    "Latihan UAS",
    "Topic 5",
    "Topic 6"
  ]);

  expect(courseDetail["General"]).to.deep.equal({
    announcement: "",
    contents: [
      {
        type: "forum",
        link: "https://scele.cs.ui.ac.id/mod/forum/view.php?id=21758",
        title: "Announcements",
        comment: ""
      },
      {
        type: "resource",
        link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=22146",
        title: "Detail Silabus",
        comment: ""
      },
      {
        type: "resource",
        link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=22794",
        title: "Update Silabus",
        comment: ""
      },
      {
        type: "choice",
        link: "https://scele.cs.ui.ac.id/mod/choice/view.php?id=23409",
        title: "Jadwal Asistensi Kelas A",
        comment: ""
      },
      {
        type: "choice",
        link: "https://scele.cs.ui.ac.id/mod/choice/view.php?id=24468",
        title: "poling asistensi kelas C",
        comment: ""
      }
    ]
  });

  expect(courseDetail["Latihan UAS"].announcement).to.equal(
    "Silahkan menghadiri kelas tambahan:\nSabtu 13.00 - 15.00 di 3113\nSenin 18.00 - 20.00 di 3113"
  );

  expect(courseDetail["Latihan UAS"].contents).to.deep.equal([
    {
      title: "Asistensi 1",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27485",
      comment: "",
      type: "resource"
    },
    {
      title: "Asistensi 2",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27486",
      comment: "Nilai x menjadi 3",
      type: "resource"
    },
    {
      title: "Asistensi 3",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27487",
      comment: "",
      type: "resource"
    },
    {
      title: "Asistensi 4",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27488",
      comment: "",
      type: "resource"
    },
    {
      title: "Jawaban Asistensi 1 dan 4",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27489",
      comment: "",
      type: "resource"
    },
    {
      title: "Jawaban Asistensi 2",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27490",
      comment: "",
      type: "resource"
    },
    {
      title: "Jawaban Asistensi 3",
      link: "https://scele.cs.ui.ac.id/mod/resource/view.php?id=27491",
      comment: "",
      type: "resource"
    },
    {
      title: "Announcements",
      link: "https://scele.cs.ui.ac.id/mod/forum/view.php?id=21758",
      comment: "",
      type: "forum"
    },
    {
      title: "Pengumpulan tugas penambahan nilai",
      link: "https://scele.cs.ui.ac.id/mod/assign/view.php?id=32661",
      comment: "",
      type: "assign"
    },
    {
      title: "Tambahan materi",
      link: "https://scele.cs.ui.ac.id/mod/url/view.php?id=28296",
      comment: "",
      type: "url"
    },
    {
      title: "Past Homeworks/Exams",
      link: "https://scele.cs.ui.ac.id/mod/folder/view.php?id=28302",
      comment: "",
      type: "folder"
    }
  ]);
});
