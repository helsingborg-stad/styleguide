# Municipio 6 release: Styleguide and design tokens

Municipio 6 introduces a token-based Styleguide architecture. This is a foundational change that makes visual decisions more consistent, easier to maintain, and safer to customize across implementations.

## Why this change was needed

In previous versions, visual values were often managed through a mix of hardcoded values, Sass variables, and component-specific patterns. This made it harder to:

- keep consistency between components
- scale and maintain themes over time
- safely customize implementations without side effects
- make design decisions explicit and traceable

The Municipio 6 token system solves this by making design tokens the source of truth for visual values such as color, spacing, radius, typography, and shadow.

## What changed in Styleguide

The Styleguide now uses a structured token flow:

1. Global tokens are defined in `source/data/design-tokens.json`.
2. Token Sass is generated from JSON into `source/sass/setting/_design-tokens.scss`.
3. Components declare which tokens they are allowed to consume via component manifests.
4. Component styles map and consume tokens through the token mixin pattern.
5. Components are informed about their context through dedicated `--inherit` variables.

This gives us:

- centralized design decisions
- predictable component-level token APIs
- better runtime theming through CSS custom properties
- schema validation for token usage
- components that adapt to their surroundings, reducing the risk of hard-to-read fields or buttons etc.

## What developers need to do

A migration is already in place in Municipio 6 for the Styleguide itself, but custom implementations and project-specific overrides may still need updates.

### 1. Review custom overrides and theme code

Custom CSS that targets old variables or hardcoded values may no longer behave as intended. Review and migrate to token-based overrides, for example:

```css
:root {
  --color--primary: #0052cc;
  --border-radius: 0.75;
}

.c-card--campaign {
  --c-card--color--surface: #111827;
  --c-card--border-radius: 1.5;
}
```

### 2. Validate custom integrations

After migration updates:

- verify visual output in your key templates
- test custom components that previously depended on Sass internals or legacy variable names

## Migration impact and compatibility

- Core Styleguide components are migrated to the token architecture.
- Most standard component usage should continue to work.
- The highest migration risk is in project-specific customizations:
  - custom Sass
  - overrides tied to legacy naming assumptions

## Recommended rollout plan

1. Upgrade Styleguide and build locally.
2. Audit custom components and theme overrides.
3. Migrate custom styling to token APIs.
4. Perform visual QA before release.

## Final note

Municipio 6 is not only a version upgrade. It is a move to a more durable design system contract between design and code. Teams that align custom code with token APIs will get more stable upgrades, clearer theming, and lower long-term maintenance costs. This update will serve as a foundation for the ability to add darkmode and high contrast modes on all Municipio siteas and finally complying with [EN 301 549](https://www.etsi.org/standards/get-standards#page=1&search=ETSI%20EN%20301%20549%20V3.2.1&title=1&etsiNumber=1&content=0&version=1&onApproval=1&published=1&withdrawn=1&historical=0&isCurrent=1&superseded=1&startDate=1988-01-15&endDate=2022-01-31&harmonized=0&keyword=&TB=&stdType=&frequency=&mandate=&collection=&sort=1). A simplified version is avabile in swedish here: https://www.digg.se/webbriktlinjer/alla-webbriktlinjer/respektera-anvandarens-installningar
