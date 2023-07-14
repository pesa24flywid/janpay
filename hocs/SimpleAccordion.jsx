import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

const SimpleAccordion = ({ title, content }) => {
    return (
        <>
            <Box p={3} rounded={'12'} bgColor={'blanchedalmond'} mb={4}>
                <Text fontWeight={'semibold'} mb={2}>{title}</Text>
                <Text mb={2} fontSize={'sm'}>{content}</Text>
            </Box>
        </>
    )
}

export default SimpleAccordion