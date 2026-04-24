import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'


import tailwindcss from '@tailwindcss/vite';


import alpinejs from '@astrojs/alpinejs';


export default defineConfig({
  integrations: [starlight({
      title: 'Filed & Forgotten',
      customCss: [
        './src/styles/global.css',
      ],
      components: {
          Icon: './src/components/Icon.astro',
          PageTitle: './src/components/MascotPageTitle.astro',
      },
      social: [
          { icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }
      ],
      sidebar: [
          { label: 'Lorelog', link: '/lorelog' },
          { label: 'Posts', autogenerate: { directory: 'posts' } },
          { label: 'Guides', autogenerate: { directory: 'guides' } },
          { label: 'Reference', autogenerate: { directory: 'reference' } },
          { label: 'Haikus', autogenerate: { directory: 'haikus' } },
          { label: 'Limericks', autogenerate: { directory: 'limericks' } },
          { label: 'Mascots', autogenerate: { directory: 'mascots' } },
      ],
  }), alpinejs()],

  vite: {
    plugins: [tailwindcss()],
  },
});