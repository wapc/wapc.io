---
slug: nodejs
title: "Building a waPC host in nodejs"
date: 2021-04-24T10:07:21+06:00
# post type (regular/featured)
type: "featured"
summary: "How to build a waPC WebAssembly runner in nodejs"
draft: false
authors:
  - joverson
attribution_link: https://unsplash.com/photos/WkJPu3rEeJE
attribution: Steve Johnson
---

## Intro

This is the last post in our Intro to waPC series. Make sure to check out part 1: [Building WebAssembly platforms with waPC](/blog/building/), and part 2: [Getting started with waPC and WebAssembly](/blog/getting-started/).

## Writing your waPC host

We're using nodejs as our host platform because we've already dealt with Go, Rust, and web browsers so let's keep the trend going. Why stick to one platform in this crazy new WebAssembly world?

There are also host implementations for [Rust](https://github.com/wapc/wapc-rust) and [Go](https://github.com/wapc/wapc-go) and if you are more familiar with those languages. The differences aren't extensive, but because of how rich Rust's WebAssembly scene is, the Rust host abstracts the WebAssembly runtime away behind a `WebAssemblyEngineProvider` so you can swap out runtimes and ignore their API differences.

#### New to nodejs?

I recommend using [`nvm`](https://github.com/nvm-sh/nvm) to install node and npm. `nvm` makes swapping versions easier and does all its magic without needing root access.

```shell
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

After starting a new shell or `source`-ing the configuration as it suggests, run this command to install the latest version of node:

```shell
$ nvm install node # "node" is an alias for the latest version
```

Verify your installation of node and npm with `node -v && npm -v`

### Create a new nodejs project

Create a new directory and run `npm init` to initialize a `package.json` file. `package.json` files store metadata and dependencies for nodejs projects.

```shell
$ mkdir wapc-host-test && cd wapc-host-test && npm init -y
```

Use `npm` to add `@wapc/host` and `@msgpack/msgpack` as dependencies:

```shell
$ npm install @wapc/host @msgpack/msgpack
```

Create a file called `index.js` and add this JavaScript source:

```shell
const { instantiate } = require("@wapc/host");
const { encode, decode } = require("@msgpack/msgpack");
const { promises: fs } = require("fs");
const path = require("path");

// Argument as index 0 is the node executable, index 1 is the script filename
// Script arguments start at index 2
const wasmfile = process.argv[2];
const operation = process.argv[3];
const json = process.argv[4];

// If we dont have the basic arguments we need, print usage and exit.
if (!(wasmfile && operation && json)) {
  console.log("Usage: node index.js [wasm file] [waPC operation] [JSON input]");
  process.exit(1);
}

async function main() {
  // Read wasm off the local disk as Uint8Array
  buffer = await fs.readFile(path.join(__dirname, wasmfile));

  // Instantiate a WapcHost with the bytes read off disk
  const host = await instantiate(buffer);

  // Parse the input JSON and encode as msgpack
  const payload = encode(JSON.parse(json));

  // Invoke the operation in the wasm guest
  const result = await host.invoke(operation, payload);

  // Decode the results using msgpack
  const decoded = decode(result);

  // log to the console
  console.log(`Result: ${decoded}`);
}

main().catch((err) => console.error(err));
```

The first four lines import nodejs standard libraries as well as the waPC JavaScript host library, `@wapc/host`, and a JavaScript implementation of MessagePack, `@msgpack/msgpack`

```shell
const { instantiate } = require("@wapc/host");
const { encode, decode } = require("@msgpack/msgpack");
const { promises: fs } = require("fs");
const path = require("path");
```

Why MessagePack? WaPC — the protocol — does not prescribe a serialization algorithm, but `wapc` — the CLI — generates guests that use MessagePack as a default.

The code that follows grabs positional arguments passed via the command line starting with the filepath to the wasm, the operation as a string, and a JSON string that we'll serialize and pass to the guest as input. If we don't receive all those parameters then print some basic help before exiting.

```shell
// Argument as index 0 is the node executable, index 1 is the script filename
// Script arguments start at index 2
const wasmfile = process.argv[2];
const operation = process.argv[3];
const json = process.argv[4];

// If we don't have the basic arguments we need, print usage and exit.
if (!(wasmfile && operation && json)) {
  console.log("Usage: node index.js [wasm file] [waPC operation] [JSON input]");
  process.exit(1);
}
```

The `async main(){}` function allows us to use the more intuitive `await` syntax for Promises. JavaScript doesn't run any functions by default so we have to manually invoke `main()` immediately after.

```shell
async function main() {
  /* ... */
}

main().catch((err) => console.error(err));
```

Inside our main function we read our bytes off disk:

```shell
buffer = await fs.readFile(path.join(__dirname, wasmfile));
```

Pass the wasm bytes to `instantiate()` which returns a waPC host:

```shell
const host = await instantiate(buffer);
```

Parse the passed input as JSON and encode it with MessagePack:

```shell
const payload = encode(JSON.parse(json));
```

Invoke the operation we received from the command line arguments with the MessagePack-ed payload.

```shell
const result = await host.invoke(operation, payload);
```

Decode our response (again with MessagePack) and log it to the console.

```shell
const decoded = decode(result);
console.log(`Result: ${decoded}`);
```

In the previous tutorial we built a waPC guest that exposed two operations, `toUppercase` and `toLowercase`. If you don't have a waPC guest wasm file handy, download the tutorial result here: [wapc_tutorial.wasm](/wasm/wapc_tutorial.wasm)

Run our nodejs host with the command `node index.js` and pass it three arguments: your wasm file (e.g. `wapc_tutorial.wasm`), the operation to execute (e.g. `toUppercase`), and a JSON payload (e.g. `'{"name":"Samuel Clemens"}'`).

```shell
$ node index.js wapc_tutorial.wasm toUppercase '{"name":"Samuel Clemens"}'
Result: SAMUEL CLEMENS
```

That's it! You're running logic written in Rust from nodejs! You can use this same experience to build waPC guests in Go, Zig, or AssemblyScript and run them in Rust, Go, or JavaScript like we did here.

## Extra credit

Remember the `wapc_guest::prelude` I mentioned in the waPC guest tutorial? That included a `host_call` function which you can use to issue arbitrary calls from a waPC guest to a waPC host.

It looks something like this:

```shell
let result = host_call("binding", "namespace", "operation", &serialize("your data")?)?;
```

You can respond to these by defining a host call handler in your host. In the nodejs script above that would look something like this:

```shell
const host = await instantiate(
  buffer,
  (binding, namespace, operation, data) => {
    console.log(
      `I got a call for operation ${operation} with ${data.length} bytes of data`
    );
  }
);
```

You can respond to these host call functions however you like. You can build something like a stdlib for native functionality, you could broker calls between guests, or you can build a pluggable interface that dynamically loads other wasm and forwards operations along!

## Wrap-up

This is the final post in our waPC introduction and thank you for sticking with it! We've only scratched the surface of what you can do with waPC and WebAssembly. In the future we'll go over how to get started with WasmCloud and soon we'll introduce new tools to get you working with Vino and all WebAssembly.

If you build anything you want to share, let us know on [twitter at @vinodotdev](https://twitter.com/vinodotdev) and we'll pass it along!
