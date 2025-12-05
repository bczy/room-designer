# Contributing to Room Designer

Thank you for your interest in contributing to Room Designer! This document provides guidelines and information for contributors.

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must adhere to this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `build` | Changes that affect the build system or external dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |

### Examples

```bash
# Feature
feat: add AR furniture placement functionality

# Bug fix
fix: correct furniture rotation calculation

# Documentation
docs: update installation instructions

# Breaking change
feat!: redesign API for furniture management

BREAKING CHANGE: API endpoints have been renamed
```

### Validation

Commit messages are automatically validated using [commitlint](https://commitlint.js.org/) and [Husky](https://typicode.github.io/husky/).

If your commit message doesn't follow the conventional format, it will be rejected with an error message explaining what's wrong.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Make your changes
5. Commit using the conventional format
6. Push and create a pull request

## Development Setup

After cloning the repository, run:

```bash
yarn install
```

This will automatically set up Husky git hooks to validate your commit messages.
