const utils = require ('../src/utils')

test('can find major version from constraint', () => {
    expect(utils.getMajorVersionFromConstraint('^9.1')).toBe(9);
    expect(utils.getMajorVersionFromConstraint('^9.2@alpha')).toBe(9);
    expect(utils.getMajorVersionFromConstraint('8.9.x-dev')).toBe(8);
    expect(utils.getMajorVersionFromConstraint('dev-8.9.x')).toBe(8);
  });
