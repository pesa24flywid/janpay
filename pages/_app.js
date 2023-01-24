import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import NextNProgressProps from 'nextjs-progressbar'

export default function App({ Component, pageProps }) {

  return (
    <>
      <ChakraProvider>
      <NextNProgressProps />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
