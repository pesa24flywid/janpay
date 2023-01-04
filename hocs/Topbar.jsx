import React from 'react'
import { BsWallet, BsBell } from 'react-icons/bs'
import {
    HStack,
    Text,
    Box,
    VStack,
    Spacer
} from '@chakra-ui/react'
import Link from 'next/link'

const Topbar = ({title, aeps, dmt, prepaid, notification}) => {
    return (
        <>

            <HStack>
                <Text fontSize={'xl'} fontWeight={'500'} color={'#333'}>{title}</Text>
                <Spacer />
                <HStack spacing={4} w={'auto'}>

                    <Link href={'#'}>
                        <HStack boxShadow={'md'}
                            p={1} px={3} w={'auto'}
                            spacing={2}
                            rounded={'full'}
                            bg={'white'}
                            justifyContent={'flex-start'}
                        >
                            <Box
                                boxSize={'8'}
                                bg={'#FF7B54'} color={'white'}
                                rounded={'full'}
                                display={'grid'} placeContent={'center'}
                            >
                                <BsWallet />
                            </Box>
                            <VStack w={'auto'} spacing={0}
                                alignItems={'flex-start'}
                                justifyContent={'center'}
                            >
                                <Text fontSize={'xs'} color={'#888'} mb={0}>AEPS</Text>
                                <h2>₹ {aeps || 0}</h2>
                            </VStack>
                        </HStack>
                    </Link>

                    <Link href={'#'}>
                        <HStack boxShadow={'md'}
                            p={1} px={3} w={'auto'}
                            spacing={2}
                            rounded={'full'}
                            bg={'white'}
                            justifyContent={'flex-start'}
                        >
                            <Box
                                boxSize={'8'}
                                bg={'#6C00FF'} color={'white'}
                                rounded={'full'}
                                display={'grid'} placeContent={'center'}
                            >
                                <BsWallet />
                            </Box>
                            <VStack w={'auto'} spacing={0}
                                alignItems={'flex-start'}
                                justifyContent={'center'}
                            >
                                <Text fontSize={'xs'} color={'#888'} mb={0}>DMT</Text>
                                <h2>₹ {dmt || 0}</h2>
                            </VStack>
                        </HStack>
                    </Link>

                    <Link href={'#'}>
                        <HStack boxShadow={'md'}
                            p={1} px={3} w={'auto'}
                            spacing={2}
                            rounded={'full'}
                            bg={'white'}
                            justifyContent={'flex-start'}
                        >
                            <Box
                                boxSize={'8'}
                                bg={'#FFB100'} color={'white'}
                                rounded={'full'}
                                display={'grid'} placeContent={'center'}
                            >
                                <BsWallet />
                            </Box>
                            <VStack w={'auto'} spacing={0}
                                alignItems={'flex-start'}
                                justifyContent={'center'}
                            >
                                <Text fontSize={'xs'} color={'#888'} mb={0}>Prepaid</Text>
                                <h2>₹ {prepaid || 0}</h2>
                            </VStack>
                        </HStack>
                    </Link>
                    <Spacer w={8} />
                    <Box
                        pos={'relative'}
                        boxSize={'10'} p={2} cursor={'pointer'}
                        color={'gray.600'} boxShadow={'md'}
                        rounded={'full'} bg={'white'}
                        display={'grid'} placeContent={'center'}
                    >
                        <BsBell fontSize={'20'} />
                        {notification ? <Box boxSize={'2'} rounded={'full'} bg={'red'} position={'absolute'} top={'3'} right={'3'}></Box> : null}
                    </Box>

                </HStack>
            </HStack>
        </>
    )
}

export default Topbar