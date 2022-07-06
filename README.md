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

## Example usage

```
uses: cactus-blossom-it-services-limited/setup-drupal@v1
with:
  version: '9.3.x'
  dependencies: 'drupal/token drupal/ctools'
```
