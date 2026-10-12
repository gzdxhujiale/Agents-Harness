# Changesets

Hello and welcome! This folder contains changesets that are used to generate changelogs and publish packages.

To add a new changeset, run:

```bash
pnpm changeset
```

Follow the prompts to select the package(s), change type (patch, minor, major), and write a summary.
When merged into `main`, GitHub Actions will automatically aggregate these into a version PR.
