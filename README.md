# Scele Crawler

[![npm package](https://nodei.co/npm/scele-crawler.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/scele-crawler)

![Build Status](https://travis-ci.org/scele-crawler/scele-crawler.svg?branch=master)
![Coverage Status](https://coveralls.io/repos/github/scele-crawler/scele-crawler/badge.svg?branch=master)
![download status](https://img.shields.io/npm/dt/scele-crawler.svg)

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
const courseDetail = await courses[0].fetchDetail();
```

![Screenshot](documentation/section.png)

### Title
```js
Object.keys(courseDetail).forEach(title => {
    console.log(title);
});
```

### Announcement
```js
console.log(courseDetail[title].announcement);
```

### Content
```js
courseDetail[title].contents.forEach(content => {
    console.log(content.title)
    console.log(content.type);
    console.log(content.link);
    console.log(content.comment);
});
```