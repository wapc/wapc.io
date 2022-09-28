import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Icon from "@material-ui/core/Icon";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useIsBrowser from '@docusaurus/useIsBrowser';

const FeatureList = [
  {
    title: '<span style="text-decoration: underline;">The waPC Protocol',
    icon: 'settings',
    description: (
      <>The core of waPC is a protocol for communicating into and out of WebAssembly. <br/><br/>
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
        <br/><br/>
        Hosts and guests give you a universal interface for dynamic behavior in both native and WebAssembly.
      </>
    ),
  },
  {
    title: '<span style="text-decoration: underline;">Apex & the waPC CLI',
    icon: 'handyman',    
    description: (
      <>
      Use the <a href="https://apexlang.io">Apex Language</a> to define your WebAssembly's specification and generate all the code except your business logic.
      </>
    ),
  },
];

const StepsList = [
  {
    title: '<span>Step 1: Install the Apex CLI',
    description: (<>
   <div class="col">
    <div class="row section">
      <div class="step">
        <div class="install step-details">
          <Tabs
            values={[
              {label: 'Windows', value: 'windows'},
              {label: 'MacOS', value: 'macos'},
              {label: 'Linux', value: 'linux'},
              {label: 'Homebrew', value: 'homebrew'},
            ]}>
            <TabItem value="windows">
              <div class="code-toolbar">
                <pre class="language-en"><code class=" language-en">
                powershell -Command "iwr -useb https://apexlang.io/install.ps1 | iex"</code></pre>
              </div>
            </TabItem>
            <TabItem value="macos">
              <div class="code-toolbar">
                <pre class="language-en"><code class=" language-en">
                curl -fsSL https://apexlang.io/install.sh | /bin/bash</code></pre>
              </div>
            </TabItem>
            <TabItem value="linux">
              <div class="code-toolbar">
                <pre class="language-en"><code class=" language-en">
                wget -q https://apexlang.io/install.sh -O - | /bin/bash</code></pre>
              </div>
            </TabItem>
            <TabItem value="homebrew">
              <div class="code-toolbar">
                <pre class="language-en"><code class=" language-en">
                brew install apexlang/tap/apex</code></pre>
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
            <pre class="language-en"><code class=" language-en">
            apex new @wapc/assemblyscript hello_world_as<br/>
            cd hello_world_as</code></pre>
          </div>
        </div>
        </TabItem>
        <TabItem value="rust" label="Rust">
        <div class="install step-details">
          <div class="code-toolbar">
            <pre class="language-en"><code class=" language-en">
            apex new @wapc/rust hello_world_rust<br/>
            cd hello_world_rust</code></pre>
          </div>
        </div>
        </TabItem>
        <TabItem value="tinygo" label="TinyGo">
        <div class="install step-details">
          <div class="code-toolbar">
            <pre class="language-en"><code class=" language-en">
            apex new @wapc/tinygo hello_world_tinygo<br/>
            cd hello_world_tinygo</code></pre>
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
            <pre class="language-en"><code class=" language-en">make</code></pre>
          </div>
        </div>
      </>
    ),
  },
  /*
  {
    title: '<span>Step 4: Run',  
    description: (
      <>
      <div class="install step-details"></div>
      
<div class="full wapc-loader">
  <form class="p-5 border rounded-3 bg-light" id="form">
    <div class='{{ if (.Get "url") }}display-none{{end}}'>
    <ul class="nav nav-pills" id="tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <a
          class="nav-link active"
          id="file-tab"
          data-toggle="tab"
          href="#file"
          role="tab"
          aria-controls="file"
          aria-selected="true"
          >From local file</a
        >
      </li>

       <li class="nav-item" role="presentation">
        <a
          class="nav-link "
          id="url-tab"
          data-toggle="tab"
          href="#url"
          role="tab"
          aria-controls="url"
          aria-selected="false"
          >From URL</a
        >
      </li>
    </ul>
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
      <div
        class="tab-pane fade"
        id="url"
        role="tabpanel"
        aria-labelledby="url-tab"
      >
        <div class="form-floating mb-3">
          <label for="wasmUrl" class="form-label">URL</label>
          <input
            class="form-control"
            type="text"
            id="wasmUrl"
            value='{{ if (.Get "url") }}{{.Get "url"}}{{else}}{{end}}'
          />
        </div>
      </div>
    </div>
    <div class="divider"></div>
    </div>
    <div class='form-floating mb-3'>
      <label for="operation" class="form-label">waPC operation</label>
      <input type="text" id="operation" class="form-control" value="sayHello" />
    </div>
    <div class="form-floating mb-3">
      <label for="input" class="form-label">input data (as JSON)</label>
      <textarea id="input" class="form-control text-monospace">
        "name" : "Sam Clemens"</textarea
      >
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Run</button>
    <hr class="my-4" />
    <h4>Result:</h4>
    <div id="result" class="text-monospace"></div>
    <hr />
    <div id="log"></div>
  </form>
</div>
</>
    ),
  },*/
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
      <br/>
      <b><dt>waPC Guest</dt></b>
      <dd>The wasm binary — built with the wapc-guest bindings — accepts the waPC call, deserializes the input, executes the requested operation by name, serializes the return value, and passes it back over the waPC protocol back to the host.</dd>
      <br/>
      <b><dt>Apex</dt></b>
      <dd>Your Apex definition is the description of your wasm module's interface. It includes the exposed operations, the input types, return types, namespaces, and more. The waPC CLI uses Apex definitions to generate Rust, Go, or AssemblyScript code. <a href="https://apexlang.io">(see more)</a></dd>
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" >
        <Icon fontSize='large'>{icon}</Icon>
        <p className="text--center">{description}</p>
      </div>
    </div>
  );
}

function Body({description}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="padding-horiz--md text--center">
        <p>{description}</p>
      </div>
    </div>
  );
}
function Image({Svg}) {
  return (
    <div className={clsx('col col--6')}>
        <Svg className={styles.hiw_img} role="img" />
    </div>
  );
}

function Steps({title, description}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="padding-horiz--md">
      <h3 dangerouslySetInnerHTML={{__html: title}}></h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
      <div className={styles.break}>
          <br/>
          <h1 className="text--center">Quickstart</h1>
          <br/>
      </div>
      <br/>
          {StepsList.map((props, idx) => (
            <Steps key={idx} {...props} />
          ))}
      <div className={styles.break}>
          <br/>
          <h1 className="text--center">The waPC tool suite</h1>
          <br/>
      </div>
      <br/>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <br/>
        <div className={styles.break}>
          <br/>
          <h1 className="text--center">How it works</h1>
          <br/>
        </div>
        <br/>
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
