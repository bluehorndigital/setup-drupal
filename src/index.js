const core = require('@actions/core');
const exec = require('@actions/exec');
const utils = require ('./utils')

async function doScript() {
    const drupalVersion = core.getInput('version');
    const drupalPath = core.getInput('path');
    const extraDependencies = core.getInput('dependencies')

    await exec.exec('composer', [
        'create-project',
        `drupal/recommended-project:${drupalVersion}`,
        drupalPath,
        '--no-interaction'
    ]);

    await exec.exec('pwd', [], {
        cwd: drupalPath
    });

    const commands = [
        ['config', 'minimum-stability', 'dev'],
        ['config', 'prefer-stable', 'true'],
        ['config', 'preferred-install', 'dist'],
        // @todo requires composer 2
        ['require', `drupal/core-dev:${drupalVersion}`, '--dev', '-W']
    ];
    if (utils.getMajorVersionFromConstraint(drupalVersion) > 8) {
        commands.push(['require', '--dev', 'phpspec/prophecy-phpunit:^2']);
    }
    if (extraDependencies) {
        commands.push(['require', extraDependencies]);
    }

    // @todo allow adding current repo.
    // composer config repositories.0 "{\"type\": \"path\", \"url\": \"$GITHUB_WORKSPACE\", \"options\": {\"symlink\": false}}"
    // composer config repositories.1 composer https://packages.drupal.org/8
    for (command of commands) {
        await exec.exec('composer', command, {
            cwd: drupalPath,
        });
    }
}

doScript().catch(error => core.setFailed(error.message));
