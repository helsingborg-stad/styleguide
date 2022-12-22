# Helsingborg Stad Styleguide
The style guide is intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.

## Development
### Testing
#### JavaScript
Jest is used as testing framework for JavaScript in the StyleGuide.

Test files should be added adjacent to the file that is the subject fo testing. Naming convention for test files is to use the same name as the file that is subject for testing and be appended with ".test.js" or "test.ts". The ".ts" file ending enables some IDE's, like VS Code, to add intellisense for Jest.

Example file accompanied by test file:
```
source
└── js
    ├── source/js/gallery.js
    └── source/js/gallery.test.ts
```

#### Running test scripts
```bash
# Runs jest as is.
npm test
```
```bash
# Runs jest with the --watch flag.
npm run test:dev
```