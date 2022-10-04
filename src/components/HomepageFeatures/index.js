import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Icon from "@material-ui/core/Icon";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { encode, decode } from '@msgpack/msgpack';
import * as waPC from '@wapc/host';
import { useState } from "react";


export const os = () => {
  const isBrowser = useIsBrowser();
  const platform = isBrowser ? navigator.platform : '';
  if (platform.substring('Mac') != 1) {
    return "macos"
  }
  if (platform.substring('Linux') != 1) {
    return "linux"
  }
  return "windows"
}


export default function HomepageFeatures() {
  const [result, setResult] = useState("");
  const [logs, updateLogs] = useState([]);

  let operation = 'toUppercase';
  let input = '{"name" : "Sam Clemens"}';

  function jsonPretty(obj) {
    return JSON.stringify(obj, null, 2);
  }
  function jsonTerse(obj) {
    return JSON.stringify(obj);
  }

  function log(msg, className, helper) {
    console.log(msg);
    logs.push((<p class="{className}">{msg}</p>))
    updateLogs(logs);
  }

  function hostCall(...args) {
    log(`Host operation called with args: [${args.join(",")}]`);
    log(`Throwing error`);
    throw new Error("Host calls unimplemented");
  }

  async function getWapcHost() {
    const wasmFile = document.getElementById("wasmFile").files[0];
    if (!wasmFile) {
      log("No file selected, nothing to load", "error");
      return;
    }
    log("Fetching wasm bytes from file system");
    const bytes = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.addEventListener("load", (evt) => {
        const arrayBuffer = evt.target.result;
        const bytes = new Uint8Array(arrayBuffer);
        log(`Read ${bytes.length} bytes from file system`);
        res(bytes);
      });
      reader.addEventListener("error", (err) => {
        log(`Could not read wasm file: ${err}`);
        rej(err);
      });
      reader.readAsArrayBuffer(wasmFile);
    });
    log("Instantiating waPCHost with the wasm file");
    return waPC.instantiate(bytes, hostCall);

  }

  async function realSubmit(evt) {
    const host = await getWapcHost();
    if (!host) return;
    log("Host instantiated");

    let json = {};
    try {
      json = JSON.parse(input);
      input = jsonPretty(json);
    } catch (e) {
      log(`Could not parse input json: ${e}`, "error");
      return;
    }

    const payload = encode(json);

    log(`Invoking '${operation}' with ${payload.length} byte payload`);
    try {
      const result = await host.invoke(operation, payload);
      log(`Received ${result.length} byte payload`);

      const decoded = decode(result);
      log(`Decoded result to ${decoded}`);
      setResult(decoded)
    } catch (e) {
      log(e.message, "error");
      if (/expected struct/.test(e.message)) {
        log(
          `The most common reason for this error (outside of genuinely bad input) is because you passed a single argument without a wrapper object. E.g. for an operation defined like "echo(msg: string)", instead of passing "hello" as an argument, pass { "msg": "hello" }`
        );
      } else if (/No handler/.test(e.message)) {
        log(
          `That handler was not exposed to the host. Are you sure you registered the handler in the wapc_init call?`
        );
      } else if (/missing field `(.*)`/.test(e.message)) {
        json[RegExp.$1] = "/*Replace me*/";
        log(
          `Your input was missing a field, try adding "${RegExp.$1
          }" like: ${jsonTerse(json)}.`,
          "help",
          ` <button type=button class='helper btn btn-secondary' data-value='${jsonTerse(
            json
          )}'>replace</button>`
        );
      } else if (/invalid type/.test(e.message)) {
        log(
          `The incorrect type was passed to a field, check your operation's signature and try again`
        );
      }
    }
  }

  async function onSubmit(evt) {

    evt.preventDefault();
    realSubmit(evt).then(() => { console.log("Host call complete") }).catch((e) => { console.error(`Host call error: ${e}`) });
    return false;

  }



  const FeatureList = [

    {
      title: '<span style="text-decoration: underline;">The waPC Protocol',
      icon: 'settings',
      description: (
        <>The core of waPC is a protocol for communicating into and out of WebAssembly. <br /><br />
          Use waPC for everything from small libraries to distributed application platforms.
        </>
      ),
    },
    {
      title: '<span style="text-decoration: underline;">waPC Hosts & Guests',
      icon: 'extension',
      description: (
        <>
          waPC hosts manage the lifecycle and communication of WebAssembly guests.
          <br /><br />
          Hosts and guests give you a universal interface for dynamic behavior in both native and WebAssembly.
        </>
      ),
    },
    {
      title: '<span style="text-decoration: underline;">WIDL & the waPC CLI',
      icon: 'handyman',
      description: (
        <>
          Use the WebAssembly Interface Definition Language (WIDL) to define your WebAssembly’s schema and the waPC CLI to generate all the code except your business logic.
        </>
      ),
    },
  ];

  const StepsList = [
    {
      title: '<span>Step 1: Install the waPC CLI',
      description: (<>
        <div class="col">
          <div class="row section">
            <div class="step">
              <div class="install step-details">
                <Tabs>
                  <TabItem value="windows" label='Windows' Default>
                    <div class="install step-details">
                      <div class="code-toolbar">
                        <pre class="language-en"><code class=" language-en">powershell -Command "iwr -useb https://raw.githubusercontent.com/wapc/cli/master/install/install.ps1 | iex"
                        </code></pre>
                        <div class="toolbar">
                          <div class="toolbar-item"><button>Copy</button></div>
                        </div>
                      </div>
                    </div>
                  </TabItem>
                  <TabItem value="macos" label='MacOS' Default>
                    <div class="install step-details">
                      <div class="code-toolbar">
                        <pre class="language-en"><code class=" language-en">$ curl -fsSL https://raw.githubusercontent.com/wapc/cli/master/install/install.sh | /bin/bash
                        </code></pre>
                        <div class="toolbar">
                          <div class="toolbar-item"><button>Copy</button></div>
                        </div>
                      </div>
                    </div>
                  </TabItem>
                  <TabItem value="linux" label='Linux' Default>
                    <div class="install step-details">
                      <div class="code-toolbar">
                        <pre class="language-en"><code class=" language-en">$ wget -q https://raw.githubusercontent.com/wapc/cli/master/install/install.sh -O - | /bin/bash
                        </code></pre>
                        <div class="toolbar">
                          <div class="toolbar-item"><button>Copy</button></div>
                        </div>
                      </div>
                    </div>
                  </TabItem>
                  <TabItem value="homebrew" label='Homebrew' Default>
                    <div class="install step-details">
                      <div class="code-toolbar">
                        <pre class="language-en"><code class=" language-en">$ brew install wapc/tap/wapc
                        </code></pre>
                        <div class="toolbar">
                          <div class="toolbar-item"><button>Copy</button></div>
                        </div>
                      </div>
                    </div>
                  </TabItem>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </>
      ),
    },

    {
      title: '<span>Step 2: Generate a new project',
      description: (
        <>
          <div class="install step-details">
            <Tabs>
              <TabItem value="assemblyscript" label="AssemblyScript" default>
                <div class="install step-details">
                  <div class="code-toolbar">
                    <pre class="language-en"><code class=" language-en">$ wapc new assemblyscript hello_world_as</code></pre>
                    <div class="toolbar">
                      <div class="toolbar-item"><button>Copy</button></div>
                    </div>
                  </div>
                </div>
              </TabItem>
              <TabItem value="rust" label="Rust">
                <div class="install step-details">
                  <div class="code-toolbar">
                    <pre class="language-en"><code class=" language-en">$ wapc new rust hello_world_rust</code></pre>
                    <div class="toolbar">
                      <div class="toolbar-item"><button>Copy</button></div>
                    </div>
                  </div>
                </div>
              </TabItem>
              <TabItem value="tinygo" label="TinyGo">
                <div class="install step-details">
                  <div class="code-toolbar">
                    <pre class="language-en"><code class=" language-en">
                      $ wapc new tinygo hello_world_tinygo <br />
                      $ cd hello_world_tinygo <br />
                      $ make codegen <br />
                      $ go mod tidy
                    </code></pre>
                    <div class="toolbar">
                      <div class="toolbar-item"><button>Copy</button></div>
                    </div>
                  </div>
                </div>
              </TabItem>
            </Tabs>
          </div>
        </>
      ),
    },
    {
      title: '<span>Step 3: Build',
      description: (
        <>
          <div class="install step-details">
            <div class="code-toolbar">
              <pre class="language-en"><code class=" language-en">$ make</code></pre>
              <div class="toolbar">
                <div class="toolbar-item"><button>Copy</button></div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: '<span>Step 4: Run',
      description: (
        <>
          <div class="install step-details"></div>

          <div class="full wapc-loader">
            <form class="p-5 border rounded-3 bg-light" id="form" onSubmit={onSubmit}>
              <div>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="file"
                    role="tabpanel"
                    aria-labelledby="file-tab"
                  >
                    <div class="form-floating mb-3">
                      <label for="wasmFile" class="form-label">WASM File location</label>
                      <input class="form-control" type="file" id="wasmFile" />
                    </div>
                  </div>
                </div>
                <div class="divider"></div>
              </div>
              <div class='form-floating mb-3'>
                <label for="operation" class="form-label">waPC operation</label>
                <input type="text" id="operation" class="form-control" value={operation} />
              </div>
              <div class="form-floating mb-3">
                <label for="input" class="form-label">input data (as JSON)</label>
                <textarea id="input" class="form-control text-monospace">{input}</textarea>
              </div>
              <button class="w-100 btn btn-lg btn-primary" type="submit">Run</button>
              <hr class="my-4" />
              <h4>Result:</h4>
              <div id="result" class="text-monospace"><p>{result}</p></div>
              <hr />
              <div id="log">{logs}</div>
            </form>
          </div>
        </>
      ),
    },
  ];

  const ImageList = [
    {
      Svg: require('@site/static/img/wapc-arch.svg').default
    },
  ];

  const BodyList = [
    {
      description: (
        <>
          <b><dt>waPC Host</dt></b>
          <dd>Once initialized with a WebAssembly intepreter and a wasm binary, the wapc-host library can start executing functions in the wasm guest. The host and guest operate over the waPC communication protocol to satisfy bindings for compiled languages. This protocol takes an operation name and input data, serializes it, and calls the receiving waPC method in the wasm guest.</dd>
          <br />
          <b><dt>waPC Guest</dt></b>
          <dd>The wasm binary — built with the wapc-guest bindings — accepts the waPC call, deserializes the input, executes the requested operation by name, serializes the return value, and passes it back over the waPC protocol back to the host.</dd>
          <br />
          <b><dt>WIDL</dt></b>
          <dd>Your WIDL definition is the description of your wasm module's interface. It includes the exposed operations, the input types, return types, namespaces, and more. The waPC CLI uses a widl definition to generate Rust, Go, or AssemblyScript code. <a href="https://github.com/wapc/widl-spec">(see more)</a></dd>
          <br />
          <b><dt>waPC CLI</dt></b>
          <dd>The waPC command line tool automates the process of creating new projects and generating waPC-compliant integration code.</dd>
        </>
      ),
    },
  ];

  function Feature({ icon, title, description }) {
    return (
      <div className={clsx('col col--4')}>
        <div className="text--center" >
          <Icon fontSize='large'>{icon}</Icon>
          <div className="text--center">{description}</div>
        </div>
      </div>
    );
  }

  function Body({ description }) {
    return (
      <div className={clsx('col col--6')}>
        <div className="padding-horiz--md text--center">
          <div>{description}</div>
        </div>
      </div>
    );
  }
  function Image({ Svg }) {
    return (
      <div className={clsx('col col--6')}>
        <Svg className={styles.hiw_img} role="img" />
      </div>
    );
  }

  function Steps({ title, description }) {
    return (
      <div className={clsx('col col--6')}>
        <div className="padding-horiz--md">
          <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
          <div>{description}</div>
        </div>
      </div>
    );
  }


  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.break}>
          <br />
          <h1 className="text--center">Quickstart</h1>
          <br />
        </div>
        <br />
        {StepsList.map((props, idx) => (
          <Steps key={idx} {...props} />
        ))}
        <div className={styles.break}>
          <br />
          <h1 className="text--center">The waPC tool suite</h1>
          <br />
        </div>
        <br />
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <br />
        <div className={styles.break}>
          <br />
          <h1 className="text--center">How it works</h1>
          <br />
        </div>
        <br />
        <div className="row">
          {ImageList.map((props, idx) => (
            <Image className="hiw-img" key={idx} {...props} />
          ))}
          {BodyList.map((props, idx) => (
            <Body key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
