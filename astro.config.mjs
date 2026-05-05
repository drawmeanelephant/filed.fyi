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
          { label: 'Posts', autogenerate: { directory: 'posts' } },
          { label: 'Guides', autogenerate: { directory: 'guides' } },
          { label: 'Reference', autogenerate: { directory: 'reference' } },
          { label: 'Mascots', autogenerate: { directory: 'mascots' } },
          { label: 'Lorelog', autogenerate: { directory: 'lorelog' } },
          { label: 'Limericks', autogenerate: { directory: 'limericks' } },
          { label: 'Haikus', autogenerate: { directory: 'haikus' } },
      ],
  }), alpinejs(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});