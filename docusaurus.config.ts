import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenSynaptic',
  tagline: 'Documentation and Resources',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://opensynaptic.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'opensynaptic', // Usually your GitHub org/user name.
  projectName: 'opensynaptic.github.io', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Internationalization configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      'zh-CN': {
        label: '中文',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/opensynaptic/opensynaptic.github.io/tree/main/',
          path: 'docs/opensynaptic/en_GB',
          include: ['**/*.{md,mdx}'],
          exclude: ['**/_*.md'],
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/opensynaptic/opensynaptic.github.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'extensions',
        path: 'docs/opensynaptic/extensions',
        routeBasePath: 'docs/extensions',
        sidebarPath: './sidebars.extensions.ts',
        include: ['**/*.{md,mdx}'],
        editUrl:
          'https://github.com/opensynaptic/opensynaptic.github.io/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'playbooks',
        path: 'docs/opensynaptic/playbooks',
        routeBasePath: 'docs/playbooks',
        sidebarPath: './sidebars.playbooks.ts',
        include: ['**/*.{md,mdx}'],
        editUrl:
          'https://github.com/opensynaptic/opensynaptic.github.io/tree/main/',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenSynaptic',
      logo: {
        alt: 'OpenSynaptic Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'extensions',
          sidebarId: 'extensionsSidebar',
          position: 'left',
          label: 'Extensions',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'playbooks',
          sidebarId: 'playbooksSidebar',
          position: 'left',
          label: 'Playbooks',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/opensynaptic/opensynaptic.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
             {
               label: 'GitHub',
               href: 'https://github.com/opensynaptic/opensynaptic.github.io',
             },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenSynaptic, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
