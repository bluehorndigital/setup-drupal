const core = require('@actions/core');
const exec = require('@actions/exec');
const semverMajor = require('semver/functions/major')

try {
    const drupalVersion = core.getInput('version');
    const drupalPath = core.getInput('path');
    const extraDependencies = core.getInput('dependencies')

    exec('composer', [
        'create-project',
        `drupal/recommended-project:${drupalVersion}`,
        drupalPath,
        '--no-interaction'
    ]);

    const commands = [
        ['config', 'minimum-stability', 'dev'],
        ['config', 'prefer-stable', 'true'],
        ['config', 'preferred-install', 'dist'],
        // @todo requires composer 2
        ['require', `drupal/core-dev:${drupalVersion}`, '--dev', '-W']
    ];
    if (semverMajor(drupalVersion) > 8) {
        commands.push(['require', '--dev', 'phpspec/prophecy-phpunit:^2']);
    }
    if (extraDependencies) {
        commands.push(['require', extraDependencies]);
    }

    // @todo allow adding current repo.
    // composer config repositories.0 "{\"type\": \"path\", \"url\": \"$GITHUB_WORKSPACE\", \"options\": {\"symlink\": false}}"
    // composer config repositories.1 composer https://packages.drupal.org/8
    for (command of commands) {
        exec('composer', command, {
            cwd: drupalPath,
            env: {
                COMPOSER_MEMORY_LIMIT: -1,
            }
        });
    }

} catch (error) {
    core.setFailed(error.message);
}
