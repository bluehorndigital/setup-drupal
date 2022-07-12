const utils = require ('../src/utils')

test('resolved path', () => {
  expect(utils.resolvePath('~/drupal')).toBe(`${process.env.HOME}/drupal`);
});

test('can find major version from constraint', () => {
    expect(utils.getMajorVersionFromConstraint('^9.1')).toBe(9);
    expect(utils.getMajorVersionFromConstraint('^9.2@alpha')).toBe(9);
    expect(utils.getMajorVersionFromConstraint('8.9.x-dev')).toBe(8);
    expect(utils.getMajorVersionFromConstraint('dev-8.9.x')).toBe(8);
  });

test('can get array from string', () => {
  expect(utils.stringToArray("composer/installers\nphpstan/extension-installer")).toEqual([
    'composer/installers',
    'phpstan/extension-installer'
  ]);
  expect(utils.stringToArray("composer/installers\r\nphpstan/extension-installer")).toEqual([
    'composer/installers',
    'phpstan/extension-installer'
  ]);
  expect(utils.stringToArray("composer/installers,phpstan/extension-installer")).toEqual([
    'composer/installers',
    'phpstan/extension-installer'
  ]);
})
