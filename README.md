# Setup Drupal in GitHub Actions

GitHub Action to setup Drupal for testing an extension

## Inputs

### `version`

The version constraint for Drupal. Defaults to `^9.0`

Examples:

* `^9.1`
* `^8.8.9`
* `~9.0`

### `path`

Where to build Drupal. Defaults to `~/drupal`.

### `dependencies`

Extra dependencies to install.

### `allow_plugins`

Additional packages to configure with `allow-plugins`.

## Example usage

```
uses: bluehorndigital/setup-drupal@v1
with:
  version: '9.2.x-dev'
  dependencies: 'drupal/token drupal/ctools'
```
