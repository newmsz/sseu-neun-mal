var snm = require('..');

var data = [{
    text: null,
    expected: []
}, {
    text: '',
    expected: []
}, {
    text: '대전광역시',
    expected: ['대전광역시']
}, {
    text: 'ㅋㅋ청와대ㅋㅋ 한글날',
    expected: ['청와대', '한글날']
}, {
    text: 'abc frg hjl',
    expected: ['abc', 'frg', 'hjl']
}, {
    text: '힝ㅎㅎ 가끔 밥은 먹고 다니냐ㅎㅎㅎ 건강 각별히 주의하고, 모두 자주 연락해라^^',
    expected: ['밥', '건강'],
}, {
    text: '어제 가족과 함께 용산에 놀러갔었는데, 글쎄 그곳에서 친구를 만났다.',
    expected: ['가족', '용산', '친구'],
}, {
    text: '우도에서',
    expected: ['우도'],
}, {
    text: 'ㅋㅋㅋ 내가 니들을 납치해왔다!\n        니들이 아무리 내 계획을 파괴하려해도 운전대는 내가 잡고있다!',
    expected: ['니들'],
}];


data.forEach(function (td) {
    var extracted = snm.extract(td.text);
    var fail = true;
    
    if(extracted && (extracted.length == td.expected.length)) {
        var i=0;
        for(i=0; i<extracted.length; i++) {
            if(extracted[i] != td.expected[i]) break; 
        }
        
        if(i == extracted.length) fail = false;
    }
    
    if(fail) console.log('TEST:', '"' + td.text + '" ->', snm.extract(td.text));
});