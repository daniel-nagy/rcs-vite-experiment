# React Server Components + Vite Experiment

This is an experiment to create a framework for React server components and server actions using Vite.

## Introduction

React 19 includes new server-only features. Specifically, React 19 introduces server components and server actions. Unfortunately, these features are not easily accessible to developers unless they use a meta-framework.

The goal of this repo is to try to create a framework for React server components and server actions on top of Vite. My hope is that this work will accelerate the development of an official Vite integration by providing a starting point as well as a basic understanding of what needs to be done.

## Getting Started

This repo contains a simple web application. It's a blog for my cat, Coco. While intentionally silly, it is a complete application that uses server components, client components, and server actions. It is a good representation for a class of applications that may benefit from server components and server actions. You can find a deployed version of this app at https://rcs-vite-experiment.fly.dev.

To run this app locally, start by cloning the git repo:

```
git clone git@github.com:daniel-nagy/rcs-vite-experiment.git
```

Next, install Node.js and yarn:

```
cd rcs-vite-experiment
asdf install
```

If you're not using [asdf](https://asdf-vm.com/), then you can consult the [.tool-versions](.tool-versions) file to find the required version of these dependencies

Finally, install the node module dependencies using yarn:

```
yarn install
```

You can now run the app locally using the `dev` command:

```
yarn dev
```

This will start the dev server on port `4000`.

To build the app for production, run the `build` command:

```
yarn build
```

This will create a directory called **build** where you can inspect the compiled code. To run the build locally, use the `start` command:

```
yarn start
```

This will run the production-ready version of the app on port `4000`.

## Known Issues

The following is a summary of the known issues with this project. It is possible that there are more issues that are still unknown.

### Integration Issues

Solving these issues will require integrating with RSCs at the bundler level. It would be good to see React provide bundler-agnostic APIs that do the heavy lifting but can be easily integrated with any bundler.

1. Importing server actions in client components is not supported. Server actions must be passed as props to client components from server components.

2. The `"use server"` directive cannot be used in a function body. Server actions must be placed in a module with the `"use server"` directive.

3. `export *` doesn't work from a file with the `"use client"` directive.

4. Loading modules at runtime requires hacks on top of Webpack's runtime API using the [react-server-dom-webpack](https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack) package.

### Vite Configuration Issues

These issues are specific to Vite or how Vite is configured.

For this project, I decided to use [`vite-node`](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node) in place of `node` during development to run the node server. So I'm using Vite both for the server and the client.

I create a second Vite dev server in middleware mode to load the client modules.

1. When starting the dev server, an error is logged by the WebSocket server, even though it seems to work.

> [!CAUTION]
> WebSocket server error: Port is already in use

2. If you save a server component and then save a client component, an error is thrown in the browser.

> [!CAUTION]
> Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
>
> 1. You might have mismatching versions of React and the renderer (such as React DOM)
> 2. You might be breaking the Rules of Hooks
> 3. You might have more than one copy of React in the same app

3. Saving a server component will not update the UI in the browser. You must manually refresh the page in the browser to update it. This is a major productivity issue.

4. A warning is logged for each module with a `"use client"` directive when building for production. See https://github.com/vitejs/vite/issues/15012.

> [!WARNING]
> Error when using sourcemap for reporting an error: Can't resolve original location of error.

5. There appears to be an issue with the module cache, preventing any in-memory state from working properly in development because more than one version of a module exists at runtime. This can be seen by liking a post in dev and then reloading the page. The like count will be reset.

6. Occasionally, an error will be thrown during HMR indicating that the server port is already in use. I believe this is because stopping the Hono server is asynchronous. You can reproduce this pretty reliably by quickly saving a file twice.

   Hono isn't strictly necessary, but a web server of some kind is necessary to use React server components. I arbitrarily picked Hono.

> [!Caution]
> listen EADDRINUSE: address already in use 0.0.0.0:4000

### React Router Issues

These issues are specific to React Router v6.

There is no technical reason, in my opinion, to couple RSCs to a router. You should be able to use whatever router your app is currently using with RSCs, which is why I created [react-distributed-components](https://github.com/daniel-nagy/react-distributed-components) to prove that there is an alternative path that is router agnostic.

With that said, I believe most people not using a meta-framework are using React Router. So I think it makes sense to focus on React Router.

1. React Router components are client components because they rely on the context API. Therefore, they can only be used in other client components or must be re-exported from a file with the `"use client"` directive.

2. The browser's back button triggers a suspense fallback even though the RSC payload is cached. I'm wondering if React Router is not wrapping these state changes in a transition.

3. A `key` must be used on a router component with path arguments to properly trigger the suspense fallback when navigating to a page with a different path argument. Not a big deal, but according to the React docs, routers should add this key automagically.
