import React from 'react'
import { VStack, Box, Text, HStack, Show } from '@chakra-ui/react'

const DataCard = ({ title, data, icon, color }) => {
  return (
    <>
      <HStack
        mb={[6, 0]}
        spacing={4}
        rounded={12}
        minW={['46%', '52']}
        p={3} bg={'white'}
        boxShadow={'md'}
      >
        <Show above='md'>
          <Box bg={`${color}`}
            boxSize={[8, 14]}
            rounded={'inherit'}
            display={'grid'}
            placeContent={'center'}
          >
            {icon}
          </Box>
        </Show>
        <VStack alignItems={'flex-start'} justifyContent={'space-between'} spacing={0}>
          <Text fontSize={'10'} color={'#888'}>{title}</Text>
          <Text fontSize={'28'} fontWeight={'semibold'}>{data || 0}</Text>
        </VStack>
      </HStack>
    </>
  )
}

export default DataCard