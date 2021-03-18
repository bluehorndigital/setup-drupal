const semverMajor = require('semver/functions/major')
const smeverCoerce = require('semver/functions/coerce')

function getMajorVersionFromConstraint(constraint) {
    return semverMajor(smeverCoerce(constraint))
}

module.exports = {
    getMajorVersionFromConstraint
}
