var isObject = require('isobject');

module.exports = function unset(obj, prop) {
    if (!isObject(obj)) {
        throw new TypeError('expected an object.');
    }
    if (obj.hasOwnProperty(prop)) {
        delete obj[prop];
        return obj;
    }

    var segs = prop.split('.');
    var last = segs.pop();
    while (segs.length && segs[segs.length - 1].slice(-1) === '\\') {
        last = segs.pop().slice(0, -1) + '.' + last;
    }
    while (segs.length) obj = obj[prop = segs.shift()];
    delete obj[last];

    return obj;
};