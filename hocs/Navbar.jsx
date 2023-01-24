import React from 'react'
import {
    Box,
    HStack,
    Spacer,
    Text,
    Button,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Show,
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaChevronDown } from 'react-icons/fa'
import { FiMenu } from 'react-icons/fi'
import Styles from '../styles/Home.module.css'

const Navbar = () => {
    const theme = {
        primary: "#6C00FF",
        secondary: "#3C79F5",
        tertiary: "#2DCDDF",
        helper: "#F2DEBA"
    }
    return (
        <>
            <Box
                px={4} py={2}
                bg={theme.primary}
                backdropBlur={'5px'} color={'white'}
            >
                <HStack justifyContent={'space-between'}>
                    <Text fontSize={'xl'} fontWeight={'bold'}>PESA24</Text>
                    <Show above={'md'}>
                        <HStack w={'full'}>
                            <Spacer />
                            <HStack spacing={8}>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button variant={'unstyled'} display={'flex'} alignItems={'center'} p={0} rightIcon={<FaChevronDown />}>Services</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverBody p={0}>
                                            <Link href={'#'}>
                                                <Box className={Styles.MenuDropdownItem} p={2} color={'black'} rounded={'4'}
                                                    _hover={{ bg: theme.primary, color: '#FFF' }}>
                                                    Aadhar enabled Payment Services (AePS)
                                                </Box>
                                            </Link>
                                            <Link href={'#'}>
                                                <Box p={2} color={'black'} rounded={'4'}
                                                    _hover={{ bg: theme.primary, color: '#FFF' }}>
                                                    Bharat Bill Pay System (BBPS)
                                                </Box>
                                            </Link>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                                <Link href={'#'}>
                                    <Text fontWeight={'semibold'}>Pricing</Text>
                                </Link>
                                <Link href={'#'}>
                                    <Text fontWeight={'semibold'}>About Us</Text>
                                </Link>
                            </HStack>
                            <Spacer />
                            <HStack spacing={4}>
                                <Link href={'../auth/register'}><Button variant={'outline'} rounded={'full'} _hover={{ textColor: theme.primary, bg: "aqua" }}>Register</Button></Link>
                                <Link href={'../auth/login'}><Button variant={'solid'} px={6} rounded={'full'} color={'#6C00FF'}>Login</Button></Link>
                            </HStack>
                        </HStack>
                    </Show>
                    <Show below={'md'}>
                        <FiMenu fontSize={'1.5rem'} color={'white'} />
                    </Show>
                </HStack>
            </Box>
        </>
    )
}

export default Navbar