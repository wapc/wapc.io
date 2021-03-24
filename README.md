# The waPC website and documentation

This repository houses the assets used to build and deploy the waPC website,
available at https://wapc.io. The site is built using the
[Hugo](https://gohugo.io) static site generator. Check out the
[Hugo quick start](https://gohugo.io/getting-started/quick-start/) for a quick
intro.

## Prerequisites

- **[Hugo, extended](https://gohugo.io/)**

## Serving the site locally

Initialize git submodules

```console
$ git submodile update --init --recursive
```

Run hugo

```console
$ hugo serve
```

_alternately_

Run hugo via `make` and use `make` for other useful tasks.

```console
$ make serve
```
