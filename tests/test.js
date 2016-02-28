var classesProvider = require('..');
var assert = require('assert');

describe('setClasses', function() {
    describe('primitives', function() {
        describe('strings', function() {
            it('must process string', function() {
                assert.equal(classesProvider.setClasses('test'), ' test');
            });

            it('must process strings', function() {
                assert.equal(classesProvider.setClasses('test', 'test2', 'test3'), ' test test2 test3');
            });

            it('must process repeated strings', function() {
                assert.equal(classesProvider.setClasses('test', 'test', 'test'), ' test');
            });

            it('must process string with several items', function() {
                assert.equal(classesProvider.setClasses('b a a'), ' b a');
            });
        });

        describe('booleans', function() {
            it('must process boolean variable = true', function() {
                assert.equal(classesProvider.setClasses(true), ' true');
            });

            it('must process boolean variable = false', function() {
                assert.equal(classesProvider.setClasses(false), '');
            });

            it('must process null, undefined', function() {
                assert.equal(classesProvider.setClasses(undefined, null), '');
            });
        });

        describe('numbers', function() {
            it('must process number', function() {
                assert.equal(classesProvider.setClasses(1), ' 1');
            });

            it('must process number = 0', function() {
                assert.equal(classesProvider.setClasses(0), ' 0');
            });

            it('must process numbers', function() {
                assert.equal(classesProvider.setClasses(1, 2, 3, 4, 5, 5, 0), ' 0 1 2 3 4 5');
            });
        });
    });

    describe('complex', function() {
        describe('arrays', function() {
            it('must process empty array', function() {
                assert.equal(classesProvider.setClasses([]), '');
            });

            it('must process simple array', function() {
                assert.equal(classesProvider.setClasses(['a', 'b', 'c']), ' a b c');
            });

            it('must process array with different data types', function() {
                assert.equal(classesProvider.setClasses(['a', 'b', 'c', true, false]), ' a b c true');
            });

            it('must process several arrays with different data types', function() {
                assert.equal(classesProvider.setClasses('a da', 'b', ['c', 'd'], ['e', 'a', 2]), ' 2 a da b c d e');
            });

            it ('must process array with simple object', function() {
                assert.equal(classesProvider.setClasses(['a', 'b', {a: false, c: true}]), ' b c');
            });

            it ('must process array with object with array', function() {
                assert.equal(classesProvider.setClasses(['a', 'b', {a: false, c: true, c_: ['a', 'b']}]), ' b c c_a c_b');
            });

            it ('must process array with object with array and complex string', function() {
                assert.equal(classesProvider.setClasses(['a', 'b', {a: false, c: true, c_: ['a', 'b r']}]), ' b c c_a c_b c_r');
            });
        });

        describe('objects', function() {
            it('must process simple objects', function() {
                assert.equal(classesProvider.setClasses({a: true, b: false}), ' a');
            });

            it('must process simple objects with overrides', function() {
                assert.equal(classesProvider.setClasses({a: true, b: false}, {c: true, b: true}, {a: false}), ' b c');
            });

            it('must process complex objects', function() {
                assert.equal(classesProvider.setClasses('a', {a_: {b: true, size_: 'medium'}}), ' a a_b a_size_medium');
            });

            it('must process complex objects with overrides', function() {
                assert.equal(classesProvider.setClasses('a', {a_: {b: true, size_: 'medium'}}, {a_b: false}), ' a a_size_medium');
            });

            it('must process complex objects with arrays', function() {
                assert.equal(classesProvider.setClasses('a', {
                    a: {
                        _: [
                            {
                                size_: ['medium', 'full']
                            },
                            'primary'
                        ]
                    }
                }), ' a a_size_medium a_size_full a_primary');
            });
        });
    });
});

describe('prefix', function() {
    describe('process', function() {
        it('must paste custom prefix to string', function() {
            assert.equal(classesProvider.prefix('.').process('test'), '.test');
        });

        it('must paste custom prefix to complex string', function() {
            assert.equal(classesProvider.prefix('.').process('test b'), '.test.b');
        });

        it('must paste custom prefix to number', function() {
            assert.equal(classesProvider.prefix('.').process(1), '.1');
        });

        it('must paste custom prefix to several params', function() {
            assert.equal(classesProvider.prefix('.').process('a', 'b'), '.a.b');
        });

        it('must paste custom prefix to array items', function() {
            assert.equal(classesProvider.prefix('|').process(['a', 'b'], ['c']), '|a|b|c');
        });

        it('must paste custom prefix to object items', function() {
            assert.equal(classesProvider.prefix('.').process({a: true, b_: {test: true}}), '.a.b_test');
        });
    });
});
