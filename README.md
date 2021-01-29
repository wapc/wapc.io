# The waPC website and documentation

This repository houses the assets used to build and deploy the gRPC website, available at https://wapc.io. The site is built using the [Hugo](https://gohugo.io) static site generator. Check out the [Hugo quick start](https://gohugo.io/getting-started/quick-start/) for a quick intro.

## Prerequisites

- **[Hugo, extended version][hugo-install]**
- **[nvm][]**, the Node Version Manager

## Serving the site locally

First install NPM packages:

```console
$ npm install
```

To build and locally serve this site, you can use **any one** of the following
commands:

- Build and serve using [Hugo][], via `make`:

  ```console
  $ make serve
  ```

- Build and serve using [GitHub pages](https://pages.github.com/) using [Hugo](https://gohugo.io/hosting-and-deployment/hosting-on-github/):

  ```console
  $ TODO
  ```

## Publishing the site

TODO

## Site content

All of the [Markdown](https://www.markdownguide.org) content used to build the
site's documentation, blog, etc. is in the [content](content) directory.
