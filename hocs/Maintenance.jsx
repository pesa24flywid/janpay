import React, { useEffect } from 'react'
import Head from 'next/head'
import { VStack } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

const Maintenance = () => {

  return (
    <>
      <VStack w={'full'} h={'100vh'} bg={'#FFF'} pos={'fixed'} top={0} left={0}>
        <Text fontSize={'xl'} textAlign={'center'}>We are updating our servers</Text>
        <Text fontSize={'xl'} textAlign={'center'}>Please try again after 11:45 IST</Text>
      </VStack>
    </>
  )
}

export default Maintenance