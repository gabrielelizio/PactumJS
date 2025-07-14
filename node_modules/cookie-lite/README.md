<p align="center" style="text-align: center;"><img src="./docs/public/banner.svg" width="300" alt="cookie-lite logo"/></p>
Super lightweight cookie parser and serializer


---
> Friendly fork of ethan7g/cookieLite post it's deprecation https://github.com/ethan7g/cookieLite/issues/3

> Super lightweight cookie parser and serializer

[Full documentation](https://github.com/leelaprasadv/cookie-lite) | [GitHub](https://github.com/leelaprasadv/cookie-lite) | [NPM](https://www.npmjs.com/package/cookie-lite)

## Installation

```shell
npm i --save cookie-lite
```

## Parsing cookie strings

```javascript
const cookieLite = require('cookie-lite')

cookieLite.parse('foo=bar; copyright=%C2%A9;another=test') // {foo: 'bar', copyright: '©', another: 'test'}
```

## Serializing objects to cookie strings

```javascript
cookieLite.serialize({
	name: 'Choco',
	'HttpOnly': null
}) // 'name=Choco;HttpOnly'
```

## Why cookie-lite?

cookie-lite is super lightweight. It's over much more lightweight than cookie, another popular cookie package. cookie-lite is the way to go for efficiency as it parses using JS regular expressions!



