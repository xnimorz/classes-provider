!function(global) {
    'use strict';

    var spaceRegExp = /\s+/;

    function processObject(result, data, base) {
        base = base || '';
        var value;
        var type;
        var index;
        for (var i in data) {
            value = data[i];
            type = typeof value;
            index = base + i;

            if (value !== null || value !== undefined) {
                if (type === 'boolean') {
                    result[index] = !!value;
                } else if (type === 'number') {
                    result[index + value] = true;
                } else if (type === 'string') {
                    value = value.split(spaceRegExp);

                    for (var j = 0, l = value.length; j < l; j++) {
                        result[index + value[j]] = true;
                    }
                } else
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    processArray(result, value, index);
                } else if (type === 'object') {
                    processObject(result, value, index);
                }
            }

        }

        return result;
    }

    function processArray(result, ar, base) {
        var value;
        var type;
        base = base || '';

        for (var i = 0, len = ar.length; i < len; i++) {
            value = ar[i];
            type = typeof value;
            if (value !== null || value !== undefined) {
                if (type === 'boolean') {
                    if (value) {
                        result[base + value] = true;
                    }
                } else if (type === 'number') {
                    result[base + value] = true;
                } else if (type === 'string') {
                    value = value.split(spaceRegExp);

                    for (var j = 0, l = value.length; j < l; j++) {
                        result[base + value[j]] = true;
                    }
                } else if (Object.prototype.toString.call(value) === '[object Array]') {
                    processArray(result, value, base);
                } else if (type === 'object') {
                    processObject(result, value, base);
                }
            }
        }

        return result;
    }

    var classesProvider = {
        setClasses: function() {
            var result = processArray({}, arguments);

            var resultString = '';
            for (var i in result) {
                if (result[i]) {
                    resultString += ' ' + i;
                }
            }

            return resultString;
        },
        prefix: function(prefix) {
            return {
                process: function() {
                    var result = processArray({}, arguments);

                    var resultString = '';
                    for (var i in result) {
                        if (result[i]) {
                            resultString += prefix + i;
                        }
                    }

                    return resultString;
                }
            }
        }
    };


    (function(classesProvider) {
        if (typeof exports === 'object') {
            // CommonJS
            module.exports = classesProvider;
        } else if (typeof define === 'function' && define.amd) {
            // AMD.
            define(classesProvider);
        } else {
            // Global scope
            global.classesProvider = classesProvider;
        }
    })(classesProvider);
}(this);
