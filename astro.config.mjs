import starlight from '@astrojs/starlight'
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'


import sitemap from '@astrojs/sitemap';

const cloudflareAnalytics = () => ({
  name: "cloudflare-web-analytics",
  hooks: {
    "astro:config:setup"({ injectScript }) {
      if (process.env.CF_BEACON_TOKEN) {
        injectScript(
          "head-inline",
          `
!function(){
  var d=document;
  var s=d.createElement("script");
  s.defer=true;
  s.src="https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", '{"token":"${process.env.CF_BEACON_TOKEN}"}');
  d.head.appendChild(s);
}();
          `
        );
      }
    },
  },
});

export default defineConfig({
  site: 'https://filed.fyi',
  integrations: [cloudflareAnalytics(), mdx({
      components: {
        Broside: './src/components/Brosides.astro',
        Limerick: './src/components/Limericks.astro',
        CollectionRegister: './src/components/CollectionRegister.astro',
        RelatedEntries: './src/components/RelatedEntries.astro',
      },
    }), starlight({
      title: 'Filed & Forgotten',
      description: 'Archive surface for collection-backed records.',
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://filed.fyi/og-default.png' }
        },
        {
          tag: 'meta',
          attrs: { property: 'twitter:image', content: 'https://filed.fyi/og-default.png' }
        }
      ],
      disable404Route: true,
      customCss: [
        './src/styles/global.css',
      ],
      social: [
          { icon: 'github', label: 'GitHub', href: 'https://github.com/drawmeanelephant/filed.fyi' }
      ],
      sidebar: [
        {
          label: 'Filed',
          items: [
            { label: 'Lorelog', link: '/lorelog' },
            { label: 'Mascots', link: '/mascots' },
            { label: 'Posts', link: '/posts' },
            { label: 'Releases', link: '/releases' },
            { label: 'Changelog', link: '/changelog' },
          ],
        },

        {
          label: 'Reference',
          items: [
            { label: 'Index', link: '/reference' },
            { label: 'Directives', link: '/reference/directives' },
            { label: 'Forms', link: '/reference/forms' },
            { label: 'Empathegy', link: '/reference/empathegy' },
            { label: 'Managed Absence', link: '/reference/managed-absence' },
            { label: 'Directive Conflicts', link: '/reference/directive-conflicts' },
          ],
        },

        {
          label: 'Recovered',
          items: [
            { label: 'Guides', link: '/guides' },
            { label: 'Aphorisms', link: '/aphorisms' },
            { label: 'Poetry', link: '/poetry' },
            { label: 'Haikus', link: '/haikus' },
            { label: 'Limericks', link: '/limericks' },
          ],
        },
      ],
  }) , sitemap()],

});