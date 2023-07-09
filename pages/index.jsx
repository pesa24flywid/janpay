import React, { useEffect } from 'react'
import Head from 'next/head'
import { VStack } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

const Home = () => {
  useEffect(() => {
    window.location.assign('/dashboard')
  }, [])

  return (
    <>
      <Head><title>Janpay - Maintenance</title></Head>
      {/* <VStack w={'full'} h={'100vh'}>
        <Text fontSize={'xl'} textAlign={'center'}>We are updating our servers</Text>
        <Text fontSize={'xl'} textAlign={'center'}>Please try again after 11:45 IST</Text>
      </VStack> */}
    </>
  )
}

export default Home