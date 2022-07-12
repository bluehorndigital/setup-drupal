const path = require('path');
const semverMajor = require('semver/functions/major')
const smeverCoerce = require('semver/functions/coerce');
const { access } = require('fs');

function resolvePath(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return path.resolve(filepath)
}

function getMajorVersionFromConstraint(constraint) {
    return semverMajor(smeverCoerce(constraint))
}
function stringToArray(string) {
    return string.split(/\r?\n/).reduce(
        (acc, line) =>
          acc
            .concat(line.split(","))
            .filter(pat => pat)
            .map(pat => pat.trim()),
        []
      );
}

module.exports = {
    resolvePath,
    getMajorVersionFromConstraint,
    stringToArray
}
