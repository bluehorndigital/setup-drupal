const core = require('@actions/core');
const exec = require('@actions/exec');
const utils = require ('./utils')

async function doScript() {
    // taken from actions/checkout
    let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
    if (!githubWorkspacePath) {
        throw new Error('GITHUB_WORKSPACE not defined')
    }
    githubWorkspacePath = utils.resolvePath(githubWorkspacePath)

    const drupalVersion = core.getInput('version', {
        required: true,
    });
    const drupalPath = utils.resolvePath(core.getInput('path') || '~/drupal');
    const extraDependencies = core.getInput('dependencies')

    await exec.exec('composer', [
        'create-project',
        `drupal/recommended-project:${drupalVersion}`,
        drupalPath,
        '--no-interaction'
    ]);

    const commands = [
        ['config', 'minimum-stability', 'dev'],
        ['config', 'prefer-stable', 'true'],
        ['config', 'preferred-install', 'dist'],
        ['config', 'repositories.0', `{"type": "path", "url": "${githubWorkspacePath}", "options": {"symlink": false}}`],
        ['config', 'repositories.1', 'composer', 'https://packages.drupal.org/8']
        // @todo requires composer 2
        ['require', `drupal/core-dev:${drupalVersion}`, '--dev', '-W']
    ];
    if (utils.getMajorVersionFromConstraint(drupalVersion) > 8) {
        commands.push(['require', '--dev', 'phpspec/prophecy-phpunit:^2']);
    }
    if (extraDependencies) {
        commands.push(['require', extraDependencies]);
    }

    for (command of commands) {
        await exec.exec('composer', command, {
            cwd: drupalPath,
        });
    }
}

doScript().catch(error => core.setFailed(error.message));
