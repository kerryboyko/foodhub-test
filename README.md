Next.js

No Tailwind (Tailwind is essentially syntactic sugar for CSS, but eliminates specificity by storing everything at 'class' level specificity. In practice, I've found it creates hard to debug CSS errors.)

Yes React Compiler. I had not used this before but essentially it automatically memorizes parts of the code. Manual memorization clutters the code.

I'm in favor of anything which reduces the amount of boilerplate that needs to be written, as additional code = more places for bugs to hide. For a simple app such as this, it's overkill, but I also don't see a reason _not_ to use it. One note is that to use React Compiler, it assumes you're following the Rules of React, which is why ESLint is so important - it'll catch when you don't. https://www.debugbear.com/blog/react-compiler The tradeoff is that you need to use React Developer Tools Profile to investigate the issue rather than checking explicit React.memo, useMemo, or useCallback calls in your code. This, in the long term, makes debugging performance issues more challenging.

Because of my policy of: "Always try to learn something new on a code challenge," I weighed the tradeoffs and went with React Compiler.

### State management

Redux would be disproportionate for this exercise. The app only needs lightweight shared state for the cart and checkout flow, so I used Zustand with development-only debugging middleware. This provides observable state transitions without adding significant boilerplate.

### React Compiler

I used React Compiler for the following reasons:

- This is a greenfield project.
- React Compiler is production-ready.
- Manual useMemo, useCallback, and memo introduce complexity
- Less code means fewer oppertunities for bugs and less cognative load.

There are tradeoffs I'm aware of, see: https://www.debugbear.com/blog/react-compiler

### Runtime Validation at System Boundaries

While Typescript can help with catching type errors at compile time, Zod helps catch them at runtime.

### Vitest

Fast unit and integration testing.

### Playwright

Realistic user-flow testing

### Github Actions

Automated quality gates.

Added:

- Zustand
- Zod
- vitest
- testinglibrary-react
- plywright
- prettier

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### IDE-side testing/local automation

Added

- Playwright for VSCode
- Husky / Lint-staged

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
