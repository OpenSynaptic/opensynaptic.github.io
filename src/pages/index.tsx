import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          2-N-2 IoT Protocol Stack docs portal for architecture, APIs, extensions, and operations.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/Home">
            Get Started
          </Link>
          <Link className="button button--outline button--lg" to="/docs/extensions/intro">
            Explore Extensions
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickEntryCards() {
  return (
    <section className={styles.quickSection}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className={styles.card}>
              <Heading as="h3">Core Docs</Heading>
              <p>Architecture, APIs, config schema, and core runtime references.</p>
              <Link to="/docs/Home">Open Core Docs</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.card}>
              <Heading as="h3">Extensions</Heading>
              <p>Reserved space for adapters, plugins, and ecosystem modules.</p>
              <Link to="/docs/extensions/intro">Open Extensions</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.card}>
              <Heading as="h3">Playbooks</Heading>
              <p>Reserved runbooks for deployment, incident response, and ops.</p>
              <Link to="/docs/playbooks/intro">Open Playbooks</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectLinks() {
  return (
    <section className={styles.linksSection}>
      <div className="container">
        <Heading as="h2">Project</Heading>
        <div className={styles.linkRow}>
          <Link to="https://github.com/OpenSynaptic/OpenSynaptic">GitHub Repo</Link>
          <Link to="https://github.com/OpenSynaptic/OpenSynaptic/issues">Issues</Link>
          <Link to="https://github.com/OpenSynaptic/OpenSynaptic/discussions">Discussions</Link>
          <Link to="/blog">Release & Blog</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} Docs Portal`}
      description="OpenSynaptic documentation portal for core docs, extensions, and operations playbooks.">
      <HomepageHeader />
      <main>
        <QuickEntryCards />
        <ProjectLinks />
      </main>
    </Layout>
  );
}
