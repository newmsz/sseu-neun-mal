var hangul = require('hangul-js'),
    Normalizer = require('./lib/Normalizer'),
    Db = require('./lib/Db');

var __verbose = false;

exports.extract = function (text) {
    if(!text) return [];
    text = text.replace(/\n/g, ' ');
    var tsplit = text.split(' ');
    
    if(__verbose) console.log('VERBOSE: TTEXT: "' + text + '"');
    
    var ret = [];
    
    tsplit.forEach(function (word) {
        var glossary = extractGlossary(word);
        if(glossary) {
            if(ret.indexOf(glossary) < 0) ret.push(glossary);
        }
    });
    
    return ret;
};

function extractGlossary (word) {
    var normalized = Normalizer.normalize(word);
    if(!normalized) return null;
    
    var candidates = Normalizer.removeJosa(normalized);
    if(candidates.indexOf(word) < 0) candidates.push(word);
    if(candidates.indexOf(normalized) < 0) candidates.push(normalized);
    
    candidates.sort(function (a, b) { return hangul.disassemble(b).length - hangul.disassemble(a).length; });
    
    for(var i=0; i<candidates.length; i++) {
        if(Db.isInBacklist(candidates[i])) {
            if(__verbose) console.log('VERBOSE: word backlisted: ' + candidates[i]);
            return null;
        }    
    }

    for(var i=0; i<candidates.length; i++) {
        if(candidates[i].match(/^[0-9\s]$/)) return null;
        
        if(!Normalizer.isKorean(candidates[i])) {
            if(__verbose) console.log('VERBOSE: non-Korean: ' + normalized);
            return candidates[i];
        }
        
        if(Db.isInWhitelist(candidates[i])) {
            if(__verbose) console.log('VERBOSE: word whitelisted: ' + candidates[i]);
            return candidates[i];
        } 
    }
    
    if(__verbose) console.log('VERBOSE: no match: ' + normalized);
    return null;
}

exports.verbose = function () {
    __verbose = true;
    Normalizer.verbose();
    Db.verbose();
    return this;
};