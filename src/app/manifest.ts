import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'جمهورك - المنصة الأولى لخدمات السوشيال ميديا',
    short_name: 'جمهورك',
    description: 'زيادة المتابعين والتفاعل بأسعار تنافسية وتنفيذ فوري.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff8c00',
    icons: [
      {
        src: '/favicon.ico?v=2',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-96x96.png?v=2',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png?v=2',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
