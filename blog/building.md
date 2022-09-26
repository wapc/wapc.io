---
slug: building
title: "Building WebAssembly platforms with waPC"
date: 2021-04-22T10:07:21+06:00
# post image
image: "images/blog/led-matrix.webp"
# post type (regular/featured)
type: "featured"
# meta description
summary: "How to build platforms on top of WebAssembly with waPC"
# post draft
draft: false
authors:
  - joverson
attribution_link: https://unsplash.com/photos/C-wJ54y-gms
attribution: Maximalfocus
---

WebAssembly is exciting at first glance but quickly turns into an adventure in software archeology. You spend most of your time piecing together clues from abandoned sites (github projects) and ancient texts (websites) searching for the holy grail.


While waPC is not the holy grail, it's a satisfying solution to the headache of getting productive with WebAssembly. When WebAssembly's "Hello World" can leave you with more questions than answers, waPC scales with you from starter projects to [enterprise application meshes](https://wasmcloud.com).

### What is waPC?

The [WebAssembly Procedure Calls (waPC)](https://github.com/wapc/) project is like a standard module interface for WebAssembly on top of an extensible RPC framework. It irons out the wrinkles between native code and WebAssembly guests to make passing and receiving complex data types trivial. Under the hood, waPC defines an opaque protocol that allows you to broker arbitrary, dynamic calls across native logic, WebAssembly, from WebAssembly to other WebAssembly, or across the internet without knowing anything about the call's data structure or serialization algorithms.

WaPC is great for platform builders but covers common use cases just as well. Even though the goal is broader than some other projects, the waPC experience is so intuitive and powerful that you should keep it in your toolbox no matter what you end up using.

### waPC vs wasm-bindgen (et al)?

#### Similar looking tools, different audiences

If you write Rust and want to target the web browser alone, the [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) project is mature and tailored specifically to this use case. WaPC is more generic. WaPC is better suited for building cross-platform applications than fast browser code.

WaPC has host implementations in [Rust](github.com/wapc/wapc-rust), [Go](https://github.com/wapc/wapc-go), and [JavaScript](https://github.com/wapc/wapc-js) ([nodejs](https://www.npmjs.com/package/@wapc/host) + [browser](https://unpkg.com/@wapc/host@0.0.1/dist/index.bundle.js)) and guest SDKs for [Rust](https://github.com/wapc/wapc-guest-rust), [TinyGo](https://github.com/wapc/wapc-guest-tinygo), [AssemblyScript](https://github.com/wapc/as-guest), and [Zig](https://github.com/wapc/wapc-guest-zig). If you're looking for the "portable" part of WebAssembly, waPC is for you. If you're looking to make lightning fast web application, wasm-bindgen is forging the path there.

Both wasm-bindgen and waPC are made of layers that could complement each other, but they aren't made to coexist at the moment.

### The waPC suite

_Do you learn better by copy/pasting code and running things yourself? Try heading to [Getting started with waPC](/blog/getting-started-with-wapc-and-webassembly/) and use this post as a reference when you need it._

#### The waPC protocol

The waPC protocol is a handful of complementary host and guest methods that act as the communication contract across the WebAssembly boundary. They provide an interface for calling operations, reading data, communicating errors, and exposing a logger. Check out this [TypeScript representation of the waPC protocol](https://github.com/wapc/wapc-js/blob/main/src/protocol.ts) from the host's side for a glimpse into the technicals.

#### waPC Hosts

A waPC host is the native implementation that loads and initializes a WebAssembly guest and makes requests over the waPC protocol. WaPC has host implementations for [Rust](github.com/wapc/wapc-rust), [Go](https://github.com/wapc/wapc-go), and [JavaScript](https://github.com/wapc/wapc-js). If you don't see your platform, the protocol is small and you could create a host implementation in a day or two. This is another reason we committed to waPC, each layer of the technology revolves around a dense but understandable core.

#### waPC Guests

WaPC guests are WebAssembly modules that implement the guest portion of the waPC protocol. "Operations" are an important part of waPC guests and hosts. Operations are like the exported functions you could expose when compiling to wasm normally, but waPC adds a layer of abstraction that keeps the interface in and out of wasm consistent. This keeps reliable bindings for hosts while maintaining a dynamic interface to internal guest functionality.

Guests can also make host calls, i.e. native function calls. These are operations in the reverse direction that include the input payload and the requested operation name as well as strings representing a namespace and binding. The additional data gives hosts flexibility to define the interface it exposes to its guests. A host could provide native functionality like a custom stdlib, or it could dynamically load and forward those calls to another WebAssembly module. WaPC has guest implementations for [Rust](https://github.com/wapc/wapc-guest-rust), [TinyGo](https://github.com/wapc/wapc-guest-tinygo), [AssemblyScript](https://github.com/wapc/as-guest), and [Zig](https://github.com/wapc/wapc-guest-zig).

The actual process of implementing the guest bindings is abstracted away from you via the `wapc` CLI and Apex (see below).

#### Apexlang

Apex is an interface definition language for describing waPC modules. It's easier to understand with an example:

```idl
interface {
  # This defines an add operation that takes
  # two numbers and returns another
  add(left: number, right: number): number

  # This is a more complex example that shows an example
  # HTTP Request operation
  request(url: string): HttpResponse
}

type HttpResponse {
  status:number
  headers: [Header]
  body: string
}

type Header {
  name: string
  value: string
}
```

The `wapc` CLI uses Apex like this to generate type definitions and integration code for waPC guests and hosts. For most usage, you define your interface with Apex and `wapc` generates everything else. You're left writing only your business logic.

The [Apex spec](https://github.com/wapc/Apex-spec) defines the types and syntax of additional features. The [Apex parser](https://github.com/wapc/Apex-js) and [Apex-codegen](https://github.com/wapc/Apex-codegen-js) are written in JavaScript and available as npm modules or browser bundles.

#### The `wapc` CLI

`wapc` is a command line interface to helper methods:

- `wapc new` automatically creates new waPC guests with default templates in the language of your choice.
- `wapc generate` automatically generates integration code from your Apex schemas.
- `wapc update` keeps the `wapc` internals up-to-date.

The officially supported [CLI](https://github.com/wapc/cli-go) is a Go program and the logic is written as JavaScript and available on npm with bundles for browser environments. [Rust](https://github.com/wapc/wapc-cli) & [nodejs](https://github.com/wapc/cli) versions of the CLI exist to show how you can embed `wapc` functionality like I did with the [Apex-validator](https://jsoverson.github.io/Apex-validator/). The validator does all the parsing and code generation on the client side. No servers were harmed in this demo.

### Passing and receiving complex data types

The waPC protocol doesn't prescribe a data serialization algorithm, but `wapc` generates code that uses MessagePack as a default. MessagePack is a sensible option while waPC's format-agnostic stance means you can substitute something more efficient for your data or build brokers that pass the data along without deserialization.

### How it looks

Linked here are some sample projects for you to get a feel for what Rust guests look like: [jsoverson/wapc-guest-examples](https://github.com/jsoverson/wapc-guest-examples/). The contained projects were all generated via the `wapc new` command.

The echo example sends returns the input string value as output and has the following schema Apex:

```idl
interface {
  echo(msg: string): string
}
```

Here is the compiled wasm running live in the browser:

{{< wapc-loader url="/wasm/rust_echo_string.wasm" operation="echo" >}}

### Writing your own waPC hosts and guests

That's it! The next step is to start working with actual code yourself. Check out our guest and host tutorial over at [Getting started with waPC](/blog/getting-started-with-wapc-and-webassembly/).
