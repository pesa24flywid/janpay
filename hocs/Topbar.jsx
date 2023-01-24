import React from 'react'
import { BsWallet, BsBell } from 'react-icons/bs'
import { FiMenu } from 'react-icons/fi'
import {
    HStack,
    Text,
    Box,
    Image,
    VStack,
    Spacer,
    Show,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import { IoMdHelpBuoy } from 'react-icons/io'

const Topbar = () => {
    return (
        <>
            <HStack
                w={'full'} mb={6} px={4} py={2}
                rounded={12} bg={'white'}
                boxShadow={'base'}
            >
                <Image
                w={'20'}
                    src={'/logo_long.png'}
                />
                <Spacer />
                <Show above={'md'}>
                    <Link href={'tel:+9178380742'} style={{paddingRight: '2rem'}}>
                        <Text fontSize={'xs'} color={'#666'}>
                            Helpline Number
                        </Text>
                        <Text fontSize={'lg'}>
                            +91 7838074742
                        </Text>
                    </Link>
                </Show>
                <Button leftIcon={<IoMdHelpBuoy fontSize={'1.25rem'} />} rounded={'full'} colorScheme={'twitter'}>New Ticket</Button>
            </HStack>
        </>
    )
}

export default Topbar