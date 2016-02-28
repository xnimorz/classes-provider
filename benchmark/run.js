var fixtures = [
        ['one', 'two', 'three'],
        [{ one: true, two: true, three: false }],
        ['one', 'two', { four: true, three: false }],
        ['one', { two: true, three: false }, { four: 'four', five: true }, 6, {}],
        [['one', 'two'], ['three'], ['four', ['five']], [{ six: true }, { seven: false }]]
];

var cliff = require('cliff');
var classnames = require('classnames');
var dedupe = require('classnames/dedupe');
var classesProvider = require('../');

var assert = require('assert');
var benchmark = require('benchmark');

function test(f) {
    return function() {
        fixtures.forEach(function(data) {
            f(data);
        });
    }
}

var tests = {
    classnames: test(classnames),
    dedupe: test(dedupe),
    'classProvider.setClasses': test(classesProvider.setClasses),
    'classProvider.prefix(" ").process': test(classesProvider.prefix(' ').process)
};
var results = [];
var onTestComplited = function(name) {
    results.push({
        ''          : name,
        'mean time' : (this.stats.mean * 1000).toFixed(3) + 'ms',
        'ops/sec'   : (1 / this.stats.mean).toFixed(0)
    });
};
var suite = new benchmark.Suite(
    'comparison',
    {
        onComplete : function() {
            console.log(cliff.stringifyObjectRows(
                    results,
                    ['', 'mean time', 'ops/sec'],
                    ['red', 'green', 'blue']) + '\n');
            results = [];
        }
    });

Object.keys(tests).forEach(function(name) {
    suite.add(
        name,
        function() {
            tests[name]();
        },
        {
            onComplete : function() {
                onTestComplited.call(this, name);
            }
        });
});

suite.run();
