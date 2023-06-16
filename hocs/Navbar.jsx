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
    Image
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
                px={4} py={2} color={'white'}
            >
                <HStack justifyContent={'space-between'}>
                    <Image src='/logo_long.jpeg' width={'28'} objectFit={'contain'} />
                </HStack>
            </Box>
        </>
    )
}

export default Navbar