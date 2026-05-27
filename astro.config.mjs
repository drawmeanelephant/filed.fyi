import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'


import sitemap from '@astrojs/sitemap';

const cloudflareAnalytics = () => ({
  name: "cloudflare-web-analytics",
  hooks: {
    "astro:config:setup"({ injectScript }) {
      injectScript(
        "head-inline",
        `
!function(){
  var d=document;
  var s=d.createElement("script");
  s.defer=true;
  s.src="https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", '{"token":"7520d16298634b9aa74903270d3a8b82"}');
  d.head.appendChild(s);
}();
        `
      );
    },
  },
});

export default defineConfig({
  site: 'https://filed.fyi',
  integrations: [cloudflareAnalytics(), starlight({
      title: 'Filed & Forgotten',
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