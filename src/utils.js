const path = require('path');
const semverMajor = require('semver/functions/major')
const smeverCoerce = require('semver/functions/coerce')

function resolvePath(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return path.resolve(filepath)
}

function getMajorVersionFromConstraint(constraint) {
    return semverMajor(smeverCoerce(constraint))
}


module.exports = {
    resolvePath,
    getMajorVersionFromConstraint
}
