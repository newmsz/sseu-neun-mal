sseu-neun-mal (쓰는 말)
======================

Korean term extraction module for nodejs
한국어 용언(쓰는 말) 추출기

Install
-------
```
npm install sseu-neun-mal
```

Database
--------
Database used in this library are from:
- Korean Post Office Online System ePost (http://www.epost.go.kr/main/eng/Enpost_Introduction1.html)
- Road Name Address Online System (http://www.juso.go.kr/openIndexPage.do)
- The National Institute of The Korean Language (http://www.korean.go.kr/eng_new/index.jsp)
- Wikipedia


Usage
-----
```
var snm = require('sseu-neun-mal');

console.log(snm.extract('대전광역시'));
/**
 * [ '대전광역시' ]
 */
 
console.log(snm.extract('ㅋㅋ청와대ㅋㅋ 한글날'));
/**
 * [ '청와대', '한글날' ]
 */
 
console.log(snm.extract('abc frg hjl'));
/**
 * [ 'abc', 'frg', 'hjl' ]
 */
 
console.log(snm.extract('힝ㅎㅎ 가끔 밥은 먹고 다니냐ㅎㅎㅎ 건강 각별히 주의하고, 모두 자주 연락해라^^'));
/**
 * [ '밥', '건강' ]
 */
 
console.log(snm.extract('어제 가족과 함께 용산에 놀러갔었는데, 글쎄 그곳에서 친구를 만났다.'));
/**
 * [ '가족', '용산', '친구' ]
 */
 
console.log(snm.extract('우도에서'));
/**
 * [ '우도' ]
 */  
```

License
-------
Copyright (C) newms@newms.org
License LGPLv3+:
GNU Lesser GPL version 3 or later <http://gnu.org/licenses/lgpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
