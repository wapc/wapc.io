---
title: "waPC Specification"
linkTitle: "waPC Protocol details"
weight: 1
menu:
  main:
    weight:
---

The waPC protocol standardizes communication and error handling for native code calling into WebAssembly and WebAssembly calling out to native code.

## Terms

### waPC Hosts

A waPC host is the native environment that initializes and make requests of waPC guests.

### waPC Guests

A waPC guest is a WebAssembly module that exposes commands (functions) that a host can call.

### Guest call

A request from a host to a guest.

### Host call

A request from a guest to a host.

## RPC Exchange flow

The following is an outline of which functions are invoked and in which order to support
a waPC exchange flow. waPC Host libraries should hide the details of this flow from their users.

1.  Host invokes `__guest_call` on the WebAssembly module.
1.  Guest calls the `__guest_request` function to instruct the host to write the request parameters to linear memory.
1.  Guest uses the `op_len` and `msg_len` parameters along with the pointer values it generated in step 2 to retrieve the operation (UTF-8 string) and payload (opaque byte array).
1.  Guest performs work.
1.  _(Optional)_ Guest invokes `__host_call` on host with pointers and lengths indicating the `binding`, `namespace`, `operation`, and payload.
1.  _(Optional)_ Guest can use `__host_response` and `host_response_len` functions to obtain and interpret results.
1.  _(Optional)_ Guest can use `__host_error_len` and `__host_error` to obtain the host error if indicated (`__host_call` returns 0).
1.  A guest can repeat 5-7 as many times as it needs.
1.  Guest will call `guest_error` to indicate if an error occurred during processing.
1.  Guest will call `guest_response` to store the opaque response payload.
1.  Guest will return 0 (error) or 1 (success) at the end of `__guest_call`.

## Required Host Exports

List of functions that must be exported by the host.

| Module | Function              | Parameters                                                                                                                                               | Return value | Description                                                                                      |
| ------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| wapc   | \_\_host_call         | `bind_ptr:i32`<br/>`bind_len:i32`<br/>`ns_ptr:i32`<br/>`ns_len:i32`<br/>`cmd_ptr:i32`<br/>`cmd_len:i32`<br/>`payload_ptr:i32`<br/>`payload_len:i32`<br/> | `i32`        | Invoked to initiate a host call.                                                                 |
| wapc   | \_\_console_log       | `ptr:i32`<br/>`len:i32`                                                                                                                                   |              | Allows guest to log to `stdout`                                                                  |
| wapc   | \_\_guest_request     | `op_ptr:i32`<br/>`ptr:i32`                                                                                                                               |              | Writes the guest request payload and operation name to linear memory at the designated locations |
| wapc   | \_\_host_response     | `ptr:i32`                                                                                                                                                |              | Instructs host to write the host response payload to the given location in linear memory         |
| wapc   | \_\_host_response_len |                                                                                                                                                          | `i32`        | Obtains the length of the current host response                                                  |
| wapc   | \_\_guest_response    | `ptr:i32`<br/>`len:i32`                                                                                                                                  |              | Tells the host the size and location of the current guest response payload                       |
| wapc   | \_\_guest_error       | `ptr:i32`<br/>`len:i32`                                                                                                                                  |              | Tells the host the size and location of the current guest error payload                          |
| wapc   | \_\_host_error        | `ptr:i32`                                                                                                                                                |              | Instructs the host to write the host error payload to the given location                         |
| wapc   | \_\_host_error_len    |                                                                                                                                                          | `i32`        | Queries the host for the length of the current host error (0 if none)                            |

## Required Guest Exports

List of functions that must be exported by the guest.

| Function       | Parameters                     | Description                                                        |
| -------------- | ------------------------------ | ------------------------------------------------------------------ |
| \_\_guest_call | `op_len:i32`<br/>`msg_len:i32` | Invoked by the host to start an RPC exchange with the guest module |
