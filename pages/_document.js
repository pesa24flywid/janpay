import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/ios/144.png" />
        <meta name='theme-color' content='#CE5959' />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          dangerouslySetInnerHTML={`
          if (typeof navigator.serviceWorker !== 'undefined') {
            navigator.serviceWorker.register('./offline-sw.js')
          }
        `}
        />
      </body>
    </Html>
  )
}
