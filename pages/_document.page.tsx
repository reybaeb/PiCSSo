import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon using Emoji */}
        {/* Favicon: Custom SVG Data URI for reliability */}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🎨%3C/text%3E%3C/svg%3E" />
        
        {/* Mobile Browser Theme Color */}
        <meta name="theme-color" content="#0F172A" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* PWA Manifest Metadata */}
        <meta name="application-name" content="PiCSSo" />
        <meta name="apple-mobile-web-app-title" content="PiCSSo" />
        
        {/* Preload Critical Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Added Great Vibes for Signature Style */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-[#0F172A] text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
