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
    const allowPlugins = utils.stringToArray(core.getInput('allow_plugins'))

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
        ['require', '--dev', `drupal/core-dev:${drupalVersion}`],
        ['config', 'repositories.0', `{"type": "path", "url": "${githubWorkspacePath}", "options": {"symlink": false}}`],
        ['config', 'repositories.1', 'composer', 'https://packages.drupal.org/8'],
    ];

    if (utils.getMajorVersionFromConstraint(drupalVersion) === 8) {
        commands.push(['config', '--no-plugins', 'allow-plugins.drupal/core-composer-scaffold', 'true']);
        commands.push(['config', '--no-plugins', 'allow-plugins.drupal/core-project-message', 'true']);
    }
    commands.push(['config', '--no-plugins', 'allow-plugins.composer/installers', 'true']);
    commands.push(['config', '--no-plugins', 'allow-plugins.dealerdirect/phpcodesniffer-composer-installer', 'true']);
    commands.push(['config', '--no-plugins', 'allow-plugins.phpstan/extension-installer', 'true']);

    allowPlugins.forEach(package => {
        commands.push(['config', '--no-plugins', 'allow-plugins.' + package, 'true']);
    });

    if (utils.getMajorVersionFromConstraint(drupalVersion) > 8) {
        commands.push(['require', '--dev', '--with-all-dependencies', 'phpspec/prophecy-phpunit:^2']);
    }

    if (extraDependencies) {
        commands.push(['require', extraDependencies]);
    }

    for (command of commands) {
        core.debug(`Executing: composer ${command}`)
        await exec.exec('composer', command, {
            cwd: drupalPath,
        });
    }
}

doScript().catch(error => core.setFailed(error.message));
