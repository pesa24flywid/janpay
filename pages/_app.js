import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import NextNProgressProps from 'nextjs-progressbar'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/offline-sw.js")
      })
    }
  }, [])
  return (
    <>
      <ChakraProvider>
        <NextNProgressProps />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
