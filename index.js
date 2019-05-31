const cheerio = require("cheerio");
const request = require("request");

const baseURL = "https://scele.cs.ui.ac.id";
const cookies = request.jar();

const profile = {};
let courses = [];

const req = (url, body, method) => {
  return new Promise((resolve, reject) => {
    const payload = {
      method: method || "GET",
      url: baseURL + url,
      followAllRedirects: true,
      jar: cookies,
      form: body || undefined
    };
    request(payload, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(cheerio.load(body));
      } else {
        reject(error);
      }
    });
  });
};

const updateProfile = $ => {
  const userText = $(".usertext").html();
  profile.npm = userText.split("- ")[1].split(" ")[0];
  profile.fullName = userText.split(" - ")[0];
  profile.nickName = userText.split(profile.npm + " ")[1];
};

const updateCourses = $ => {
  const selector =
    "#wrapper > header.navbar > nav > div > div > ul:nth-child(1) > li:nth-child(5) > ul > li > a";
  courses = [];
  $(selector).each((_, element) => {
    courses.push({
      link: $(element).attr("href"),
      longTitle: $(element).attr("title"),
      shortTitle: $(element).html()
    });
  });
};

exports.login = async (username, password) => {
  const $ = await req("/login/", { username, password }, "POST");
  updateProfile($);
  updateCourses($);
};

exports.getProfile = () => profile;
exports.getCourses = () => courses;
