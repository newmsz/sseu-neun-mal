var hangul = require('hangul-js'),
    Db = require('./Db');

var __verbose = false;

exports.normalize = function (text) {
    if(!text) return null;
    text = text.replace(/\n/g, ' ');

    var ret = '', prev = '';
    for(var i=0; i<text.length; i++) {
        var ch = text[i],
            ub = getUnicodeBlock(ch);

        switch(ub) {
        case 'Hangul Compatibility Jamo': ch = ' '; break;
        case 'Basic Latin': ch = ch.replace(/[^\w\s]/gi, ' '); break;
        default:
        case 'Hangul Syllables':
        }

        if(ret == '' && ch == ' ') continue;
        if(prev == ' ' && ch == ' ') continue;
        ret += ch;
        prev = ch;
    }

    return ret.replace(/^\s+|\s+$/g, '');
};

exports.removeJosa = function (word) {
    if(__verbose) console.log('VERBOSE: removing josa from:', word);
    var disassembled = hangul.disassemble(word);
    var match = [], current = Db.josa;

    for(var i=disassembled.length-1; i>=0 ;i--) {
        if(current['null']) {
            var join = [];
            for(var j=0; j<=i; j++) join.push(disassembled[j]);
            match.push(hangul.assemble(join));
        }

        if(current[disassembled[i]]) {
            current = current[disassembled[i]];
        } else
            break;
    }

    return match;
};

exports.isKorean = function (text) {
    for(var i=0; i<text.length; i++) {
        var ub = getUnicodeBlock(text[i]);

        switch(ub) {
        case 'Hangul Compatibility Jamo':
        case 'Hangul Syllables': return true;
        }
    }

    return false;
};

var UnicodeBlocks = [];
function getUnicodeBlock (char) {
    for(var i=0; i<UnicodeBlocks.length; i++) {
        if(UnicodeBlocks[i].regex.test(char)) {
            return UnicodeBlocks[i].name;
        }
    }
    return null;
}

require('unicode-8.0.0').blocks.forEach(function (unicode_block) {
    UnicodeBlocks.push({
        name: unicode_block,
        regex: require('unicode-8.0.0/blocks/' + unicode_block + '/regex')
    });
});

exports.verbose = function () {
    __verbose = true;
    return this;
};