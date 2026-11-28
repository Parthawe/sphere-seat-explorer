# CodeRabbit reviews

The root `.coderabbit.yaml` enables automatic reviews of ready pull requests and incremental reviews on subsequent pushes. Draft PRs are skipped. Reviews focus on seat/venue accuracy, Three.js performance and resource cleanup, mobile interactions, accessibility and Worker/D1 privacy boundaries. Automatic approvals and generated finishing-touch commits are disabled.

Open changes as a pull request targeting `main`. CodeRabbit reviews pull requests; a direct push to `main` does not get the same review flow. Address actionable findings and run the checks relevant to the change before merging. CodeRabbit does not replace tests or measured venue evidence.

The CodeRabbit GitHub App must have access to `Parthawe/sphere-seat-explorer`. Its account installation and repository selection are managed at https://github.com/apps/coderabbitai/installations/new. Prefer selecting this repository rather than expanding access to other projects. A committed config file alone does not prove the app is connected: verify a `coderabbitai` review/check on an actual PR.

To request a review on a ready PR, use the documented `@coderabbitai review` command in a PR comment. Repository-specific access and the account's CodeRabbit plan determine which review features are available. No API token or GitHub Actions secret is required by this configuration.

References:
- https://docs.coderabbit.ai/getting-started/quickstart
- https://docs.coderabbit.ai/reference/configuration
