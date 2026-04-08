import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroBackground} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            <Translate id="homepage.badge">2-N-2 IoT Protocol Stack</Translate>
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate id="homepage.subtitle">
              The unified documentation hub for OpenSynaptic — architecture, APIs, embedded SDKs, plugin development, and operations.
            </Translate>
          </p>
          <div className={styles.heroButtons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              <Translate id="homepage.getStarted">Quick Start</Translate>
            </Link>
            <Link className="button button--outline button--lg" to="/docs/QUICK_START">
              <Translate id="homepage.viewDocs">View Core Docs</Translate>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const PRODUCT_CARDS = [
  {
    icon: '📡',
    title: 'OSynaptic-RX',
    titleZh: 'OSynaptic-RX',
    desc: 'RX-only C89 decoder for 8-bit MCUs. Decodes OpenSynaptic frames from any serial transport with zero heap and a stack peak as low as 55 bytes.',
    descZh: 'RX 专用 C89 解码器，面向 8 位 MCU。从任意串行传输层（UART/UDP/LoRa/RS-485）解码帧，零堆分配，AVR 栈峰低至 55 字节。',
    link: '/docs/osynaptic-rx/intro',
    badge: 'C89 · Arduino · CMake',
    color: 'var(--ifm-color-success)',
  },
  {
    icon: '📤',
    title: 'OSynaptic-TX',
    titleZh: 'OSynaptic-TX',
    desc: 'TX-only C89 encoder for 8-bit MCUs. Three API tiers (A/B/C) with stack peaks from 21 bytes. Pairs with the OpenSynaptic Python/Rust server.',
    descZh: 'TX 专用 C89 编码器，面向 8 位 MCU。三级 API（A/B/C），最低栈峰 21 字节，与 OpenSynaptic Python/Rust 服务器直接配对。',
    link: '/docs/osynaptic-tx/intro',
    badge: 'C89 · Arduino · CMake',
    color: 'var(--ifm-color-info)',
  },
  {
    icon: '⚡',
    title: 'OSynaptic-FX',
    titleZh: 'OSynaptic-FX',
    desc: 'Embedded-first C99 runtime for Arduino. Sends FULL or binary DIFF frames, multi-sensor templates, secure sessions, and pluggable storage.',
    descZh: '嵌入式优先的 C99 Arduino 运行库。支持 FULL/二进制 DIFF 帧、多传感器模板、安全会话与可插拔存储后端。',
    link: '/docs/osynaptic-fx/intro',
    badge: 'C99 · ESP32 · STM32',
    color: 'var(--ifm-color-warning)',
  },
  {
    icon: '🖥️',
    title: 'Core Docs',
    titleZh: '核心文档',
    desc: 'Architecture, REST/Web APIs, plugin development specification, TUI quick reference, configuration schema, and release notes.',
    descZh: '架构设计、REST/Web API、插件开发规范、TUI 快速参考、配置模式及版本发布说明。',
    link: '/docs/intro',
    badge: 'Python · Rust · Config',
    color: 'var(--ifm-color-primary)',
  },
  {
    icon: '🔌',
    title: 'OSynaptic-FX Docs',
    titleZh: 'OSynaptic-FX 深度文档',
    desc: 'Glue step-by-step guide, data format spec, input specification, Arduino easy API, examples cookbook, and more.',
    descZh: 'Glue 集成指南、数据格式规范、传感器输入规范、Arduino Easy API 及完整示例集。',
    link: '/docs/osynaptic-fx/intro',
    badge: '20+ technical guides',
    color: 'var(--ifm-color-secondary)',
  },
  {
    icon: '🧩',
    title: 'Extensions & Playbooks',
    titleZh: '扩展与运维手册',
    desc: 'Ecosystem adapters, plugin registry, deployment runbooks, incident response procedures, and operation guides.',
    descZh: '生态适配器、插件注册表、部署手册、事件响应流程及运维操作指南。',
    link: '/docs/extensions/intro',
    badge: 'Coming soon',
    color: 'var(--ifm-color-danger)',
  },
];

function ProductCards() {
  return (
    <section className={styles.cardsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="homepage.products.title">Documentation Sections</Translate>
          </Heading>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.products.subtitle">
              Everything you need to integrate, deploy, and extend the OpenSynaptic protocol stack.
            </Translate>
          </p>
        </div>
        <div className={styles.cardGrid}>
          {PRODUCT_CARDS.map((card, i) => (
            <Link key={i} to={card.link} className={styles.productCard}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDesc}>{card.desc}</div>
                <div className={styles.cardBadge} style={{borderColor: card.color, color: card.color}}>
                  {card.badge}
                </div>
              </div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUICK_LINKS = [
  { label: 'Plugin Development', href: '/docs/plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026', emoji: '📝' },
  { label: 'Plugin Quick Reference 2026', href: '/docs/plugins/plugins-PLUGIN_QUICK_REFERENCE_2026', emoji: '⚡' },
  { label: 'TUI Quick Reference', href: '/docs/guides/guides-TUI_QUICK_REFERENCE', emoji: '💻' },
  { label: 'Web Commands Reference', href: '/docs/guides/guides-WEB_COMMANDS_REFERENCE', emoji: '🌐' },
  { label: 'Config Schema', href: '/docs/CONFIG_SCHEMA', emoji: '⚙️' },
  { label: 'RSCORE API', href: '/docs/RSCORE_API', emoji: '🦀' },
];

function QuickLinks() {
  return (
    <section className={styles.quickLinksSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.quicklinks.title">Frequently Accessed</Translate>
        </Heading>
        <div className={styles.quickLinkGrid}>
          {QUICK_LINKS.map((lnk, i) => (
            <Link key={i} to={lnk.href} className={styles.quickLink}>
              <span className={styles.quickLinkEmoji}>{lnk.emoji}</span>
              <span>{lnk.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemBar() {
  return (
    <section className={styles.ecosystemBar}>
      <div className="container">
        <div className={styles.ecosystemRow}>
          <div className={styles.ecosystemItem}>
            <Heading as="h4">GitHub</Heading>
            <div className={styles.linkGroup}>
              <Link to="https://github.com/OpenSynaptic/OpenSynaptic">OpenSynaptic</Link>
              <Link to="https://github.com/OpenSynaptic/OSynaptic-RX">OSynaptic-RX</Link>
              <Link to="https://github.com/OpenSynaptic/OSynaptic-TX">OSynaptic-TX</Link>
              <Link to="https://github.com/OpenSynaptic/OSynaptic-FX">OSynaptic-FX</Link>
            </div>
          </div>
          <div className={styles.ecosystemItem}>
            <Heading as="h4">
              <Translate id="homepage.ecosystem.docs">Documentation</Translate>
            </Heading>
            <div className={styles.linkGroup}>
              <Link to="/docs/intro">
                <Translate id="homepage.link.gettingStarted">Getting Started</Translate>
              </Link>
              <Link to="/docs/ARCHITECTURE">Architecture</Link>
              <Link to="/docs/API">API Reference</Link>
              <Link to="/blog">
                <Translate id="homepage.link.blog">Blog & Releases</Translate>
              </Link>
            </div>
          </div>
          <div className={styles.ecosystemItem}>
            <Heading as="h4">
              <Translate id="homepage.ecosystem.embedded">Embedded SDKs</Translate>
            </Heading>
            <div className={styles.linkGroup}>
              <Link to="/docs/osynaptic-rx/intro">RX SDK docs</Link>
              <Link to="/docs/osynaptic-tx/intro">TX SDK docs</Link>
              <Link to="/docs/osynaptic-fx/intro">FX SDK docs</Link>
              <Link to="/docs/osynaptic-fx/arduino-easy-api">Arduino Easy API</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} — Documentation Portal`}
      description="OpenSynaptic unified documentation portal: embedded SDKs (RX/TX/FX), protocol specs, plugin development, APIs, and operations guides.">
      <HomepageHero />
      <main>
        <ProductCards />
        <QuickLinks />
        <EcosystemBar />
      </main>
    </Layout>
  );
}
