/**
 * @type {import('@commitlint/types').UserConfig}
 *
 * Enforces Conventional Commits (feat:, fix:, docs:, chore:, ...).
 * Wired via the .husky/commit-msg hook.
 */
export default {
  extends: ['@commitlint/config-conventional'],
}
