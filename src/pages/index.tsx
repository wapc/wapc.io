import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '../components/HomepageFeatures';

import styles from './index.module.css';
import HeaderTyper from '../components/HeaderTyper';
import BrowserOnly from '@docusaurus/BrowserOnly';

function Typer() {
  const [toTypeWords] = useState(
    [
      'simple',
      'straightforward',
      'understandable',
      'boilerplate free',
      'flexible',
      'fun',
    ]
  );

  return (
    <BrowserOnly fallback={<div>simple</div>}>
      {() => {
        return <HeaderTyper
          className={styles.HeaderTyper}
          words={toTypeWords}
          delay={5000}
          defaultText={toTypeWords[0] || 'simple'}
        />
      }}
    </BrowserOnly>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h1>
        <div className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <p className={styles.tagLine}>
            Cloud applications <span className={styles.separatorText}>made</span>
            <Typer/>
          </p>
          <p>The waPC suite gives you the tools to build <strong>dynamic</strong> applications with <a href="https://webassembly.org/" target="_blank">WebAssembly</a>.</p>
        </div>
        
        <div className={styles.buttons}>
        <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Learn More
          </Link>&nbsp;&nbsp;
          <Link
            className="button button--primary button--lg"
            to="https://github.com/wapc/cli">
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
