# Scele Crawler

[![npm package](https://nodei.co/npm/scele-crawler.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/scele-crawler)

[![Build Status](https://travis-ci.org/scele-crawler/scele-crawler.svg?branch=master)](https://travis-ci.org/scele-crawler/scele-crawler)
[![Coverage Status](https://coveralls.io/repos/github/scele-crawler/scele-crawler/badge.svg?branch=master)](https://coveralls.io/github/scele-crawler/scele-crawler?branch=master)
![download status](https://img.shields.io/npm/dt/scele-crawler.svg)
![license status](https://img.shields.io/npm/l/scele-crawler.svg)
![dependencies status](https://img.shields.io/david/scele-crawler/scele-crawler.svg)

## API Documentation

### Install
```bash
npm i --save scele-crawler
```

### Import
```js
const sceleCrawler = require("scele-crawler");
```

### Login
```js
await sceleCrawler.login("SSO-USERNAME", "SSO-PASSWORD");
```

### Profile
```js
const profile = sceleCrawler.getProfile();

console.log(profile.npm);
console.log(profile.fullName);
console.log(profile.nickName);
```

### Courses
```js
const courses = sceleCrawler.getCourses();

courses.forEach(course => {
    console.log(course.longTitle);
    console.log(course.shortTitle);
});
```

### Fetch Course Detail
```js
const courseInfo = await courses[0].fetchInfo();
```

![Screenshot](documentation/section.png)

### Title
```js
Object.keys(courseInfo).forEach(title => {
    console.log(title);
});
```

### Announcement
```js
console.log(courseInfo[title].announcement);
```

### Files
```js
courseInfo[title].files.forEach(file => {
    console.log(file.fileName)
    console.log(file.fileType);
    console.log(file.link);
});
```