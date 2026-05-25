import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'


import tailwindcss from '@tailwindcss/vite';


import alpinejs from '@astrojs/alpinejs';


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
          { label: 'Mascots', items: [{ label: 'Index', link: '/mascots' }] },
          { label: 'Lorelog', items: [{ label: 'Index', link: '/lorelog' }] },
          { label: 'Limericks', items: [{ label: 'Index', link: '/limericks' }] },
          { label: 'Haikus', items: [{ label: 'Index', link: '/haikus' }] },
          { label: 'Posts', items: [{ label: 'Index', link: '/posts' }] },
          { label: 'Guides', items: [{ label: 'Index', link: '/guides' }] },
          { label: 'Reference', items: [
              { label: 'Index', link: '/reference' },
              { label: 'Empathegy', link: '/reference/empathegy' },
              { label: 'Directives', link: '/reference/directives' },
              { label: 'Forms', link: '/reference/forms' },
          ] },
      ],
  }), alpinejs(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});