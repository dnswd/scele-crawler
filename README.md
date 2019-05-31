# Scele Crawler

[![npm package](https://nodei.co/npm/scele-crawler.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/scele-crawler)

![download status](https://img.shields.io/npm/dt/scele-crawler.svg?style=flat-square)
![license status](https://img.shields.io/npm/l/scele-crawler.svg?style=flat-square)
![dependencies status](https://img.shields.io/david/scele-crawler/scele-crawler.svg?style=flat-square)

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