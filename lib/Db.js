var fs = require('fs'),
    hangul = require('hangul-js');

var whitelist = {}, blacklist = [];
exports.josa = {};

var __verbose = false,
    __experimental = false,
    __experimental2 = __experimental && true,
    __whitelist_wordlength_limit = 5;

exports.isInWhitelist = function (word) {
    if(__experimental) {
        var current = whitelist;
        if(__experimental2) word = hangul.disassemble(word);
        for(var i=0; i<word.length; i++) {
            if(!current[word[i]]) return false;
            current = current[word[i]];
        }    
        if(current['null']) return true;
        else return false;
    } else {
        return !!whitelist[word];
    }
};

exports.isInBacklist = function (word) {
    return (blacklist.indexOf(word) >= 0);
};

function addToWhitelist (word) {
    if(word.length > __whitelist_wordlength_limit) return;
    
    if(__experimental) {
        var current = whitelist;
        if(__experimental2) word = hangul.disassemble(word);
        for(var i=0; i<word.length; i++) {
            if(!current[word[i]]) current[word[i]] = {};
            current = current[word[i]];
        }    
        current['null'] = true;
    } else {
        whitelist[word] = true;    
    }
};

function loadToWhitelist(name) {
    if(!name.match(/\.db$/)) return;
    var list = fs.readFileSync('db/white/' + name).toString().split(',');
    for(var i=0; i<list.length; i++) addToWhitelist(list[i]);
    if(__verbose) console.log('VERBOSE:', name + ':', list.length + ' items loaded to whitelist');
}

function loadToBlacklist(name) {
    if(!name.match(/\.db$/)) return;
    var list = fs.readFileSync('db/black/' + name).toString().split(',');
    for(var i=0; i<list.length; i++) {
        if(blacklist.indexOf(list[i]) < 0) blacklist.push(list[i]);
    }
    if(__verbose) console.log('VERBOSE:', name + ':', list.length + ' items loaded to blacklist');
}

function loadJosa() {
    var list = fs.readFileSync('db/josa.db').toString().split(',');
    for(var i=0; i<list.length; i++) {
        var josa_reversed = hangul.disassemble(list[i]).reverse();
        var current = exports.josa;
        for(var j=0; j<josa_reversed.length; j++) {
            if(!current[josa_reversed[j]]) current[josa_reversed[j]] = { };
            current = current[josa_reversed[j]];
        }
        current['null'] = true;
    }
    
    if(__verbose) console.log('VERBOSE: ' + list.length + ' josa loaded to complete the map');
}

var ts = new Date().getTime();
fs.readdirSync('db/white').forEach(loadToWhitelist);
fs.readdirSync('db/black').forEach(loadToBlacklist);
loadJosa();

var loaded = 'VERBOSE: ' + (new Date().getTime() - ts) / 1000 + 's to load data ' + parseInt(process.memoryUsage().heapUsed / 1000)/1000 + 'MB heap used';

exports.verbose = function () {
    __verbose = true;
    console.log(loaded);
    return this;  
};