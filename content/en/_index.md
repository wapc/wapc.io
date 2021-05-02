+++
title = "waPC"
linkTitle = "wPC"

+++

{{< blocks/cover image_anchor="top" height="full" >}}

<img src="/img/logos/wapc-logo.svg" class="o-logo" />

<h2 class="display-2 o-heading">
	The waPC suite gives you the tools to build <strong>dynamic</strong> applications with <a href="https://webassembly.org/" target="_blank">WebAssembly</a>.
</h2>

<div class="mx-auto">
	<a class="btn btn-lg btn-primary mr-3 mb-4" href='/docs'>
		Learn More <i class="fas fa-arrow-alt-circle-right ml-2"></i>
	</a>
	<a class="btn btn-lg btn-secondary mr-3 mb-4" href="https://github.com/wapc/cli" target="_blank">
		Download <i class="fab fa-github ml-2 "></i>
	</a>
	<p class="lead mt-5">
The WebAssembly Procedure Call project — waPC for short — is a suite of tools and specifications that allow native code to make, receive, and forward arbitrary calls to or from WebAssembly guests.
</p>
<p>
WaPC has host implementations for Rust, Go, Node.js, and browser environments and guest libraries for Rust, Go, and AssemblyScript. 
</p>

{{< blocks/link-down color="info" >}}

</div>
{{< /blocks/cover >}}

{{% blocks/lead color="primary" %}}

<h2>The waPC tool suite</h2>
{{% /blocks/lead %}}

{{< blocks/section color="dark" >}}

{{% blocks/feature icon="fas fa-cogs" title="The waPC protocol"%}}
The core of waPC is a protocol for communicating into and out of WebAssembly.

Use waPC for everything from small libraries to [distributed application platforms](https://wasmcloud.com).
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-puzzle-piece" title="waPC Hosts & Guests"%}}
waPC hosts manage the lifecycle and communication of WebAssembly guests.

Hosts and guests give you a universal interface for dynamic behavior in both native and WebAssembly.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-tools" title="WIDL & the waPC CLI"%}}
Use the WebAssembly Interface Definition Language (WIDL) to define your WebAssembly's schema and the `wapc` CLI to generate all the code except your business logic.

{{% /blocks/feature %}}

{{< /blocks/section >}}

{{<blocks/lead color="secondary" >}}

<h1>How it works</h1>

{{< /blocks/lead >}}

{{<blocks/section>}}

<div class="col-6 text-center"><img src='/img/wapc-arch.svg' width="100%"></div>
<div class="col-6">
 <dl>
  <dt>waPC Host</dt>
  <dd>Once initialized with a WebAssembly intepreter and a wasm binary, the wapc-host library can start executing functions in the wasm guest. The host and guest operate over the waPC communication protocol to satisfy bindings for compiled languages. This protocol takes an operation name and input data, serializes it, and calls the receiving waPC method in the wasm guest.</dd>
  <dt>waPC Guest</dt>
  <dd>The wasm binary — built with the wapc-guest bindings — accepts the waPC call, deserializes the input, executes the requested operation by name, serializes the return value, and passes it back over the waPC protocol back to the host.</dd>
  <dt>WIDL</dt>
  <dd>Your WIDL definition is the description of your wasm module's interface. It includes the exposed operations, the input types, return types, namespaces, and more. The waPC CLI uses a widl definition to generate Rust, Go, or AssemblyScript code. <a href="https://github.com/wapc/widl-spec">(see more)</a></dd>
  <dt>waPC CLI</dt>
  <dd>The waPC command line tool automates the process of creating new projects and generating waPC-compliant integration code.</dd>
</dl> 
</div>

{{</blocks/section>}}

{{<blocks/section color="dark">}}

<div class="container-fluid col-8">
<h1>Example schema.widl</h1>
<style>
  .highlight pre{
    font-size:smaller; 
     height:38em;
     overflow-y:scroll;
     border-radius:4px;
  }
  </style>

```go
namespace "my:httpserver"

interface {
  "Handles an HTTP request"
  handleRequest{request: Request}: Response
}

"Represents an HTTP request, handled by the guest module"
type Request {
  method: string
  path: string
  queryString: string
  header: {string : string}
  body: bytes?
}

"HTTP response returned from a request."
type Response {
  statusCode: u32 = 200
  status: string = "OK"
  header: {string : string}
  body: bytes?
}

```

</div>
{{</blocks/section>}}

{{< blocks/section color="light">}}

<h1 class="col text-center"><a class=" text-dark display-2" href="https://github.com/wapc/">
  <i class="fab fa-github"></i> Contributions welcome !
</a></h1>

{{< /blocks/section >}}
