const cheerio = require('cheerio');
const request = require('request');

const baseURL = 'https://scele.cs.ui.ac.id';
const cookies = request.jar();

const profile = {};
let courses = [];

const req = (url, form, method) => new Promise((resolve, reject) => {
  const payload = {
    method: method || 'GET',
    url,
    followAllRedirects: true,
    jar: cookies,
    form: form || undefined,
  };
  request(payload, (error, res, body) => {
    if (!error && res.statusCode === 200) {
      resolve(cheerio.load(body));
    } else {
      reject(error);
    }
  });
});

const updateProfile = ($) => {
  const userText = $('.usertext').html();
  profile.npm = userText.split('- ')[1].split(' ')[0];
  profile.fullName = userText.split(' - ')[0];
  profile.nickName = userText.split(`${profile.npm} `)[1];
};

const fetchContent = ($, contentElement) => {
  const contents = [];
  $(contentElement)
    .find('.activity')
    .each((_, element) => {
      contents.push({
        title: $(element)
          .find('.instancename')
          .html()
          .split('<')[0],
        link: $(element)
          .find('a')
          .attr('href'),
        comment: $(element)
          .find('.contentafterlink')
          .text(),
        type: $(element)
          .attr('class')
          .split(' ')[1],
      });
    });

  const announcement = $(contentElement)
    .find('.summary')
    .text();

  return { contents, announcement };
};

const fetchDetail = async (link) => {
  const section = {};

  const $ = await req(link);
  const sectionSelector = '.course-content .content';

  $(sectionSelector).each((_, element) => {
    const title = $(element)
      .find('.sectionname')
      .text();

    section[title] = fetchContent($, element);
  });

  return section;
};

const updateCourses = ($) => {
  const selector = '#wrapper > header.navbar > nav > div > div > ul:nth-child(1) > li:nth-child(5) > ul > li > a';
  courses = [];
  $(selector).each((_, element) => {
    courses.push({
      link: $(element).attr('href'),
      longTitle: $(element).attr('title'),
      shortTitle: $(element).html(),
      fetchDetail: () => fetchDetail($(element).attr('href')),
    });
  });
};

exports.login = async (username, password) => {
  const $ = await req(`${baseURL}/login/`, { username, password }, 'POST');

  if ($('.loginerrors').length > 0) {
    throw new Error('Login failed');
  }

  updateProfile($);
  updateCourses($);
};

exports.getProfile = () => profile;
exports.getCourses = () => courses;
