import React from 'react'
import {
    Box,
    Stack,
    Text
} from '@chakra-ui/react'

const BankDetails = () => {
    const bankDetails = [
        {
            name: "State Bank of India",
            account: "1234567890",
            ifsc: "SBIN0032284",
            address: "Ground Floor, Gujranwala Town, Delhi 110023"
        },
        {
            name: "ICICI Bank",
            account: "1234567890",
            ifsc: "ICIB0032284",
            address: "Ground Floor, Gujranwala Town, Delhi 110023"
        },
        {
            name: "Central Bank of India",
            account: "1234567890",
            ifsc: "CBIN0032284",
            address: "Ground Floor, Gujranwala Town, Delhi 110023"
        },
        {
            name: "Yes Bank",
            account: "1234567890",
            ifsc: "YBIN0032284",
            address: "Ground Floor, Gujranwala Town, Delhi 110023"
        },
    ]


    return (
        <>
            <Box
                my={8} bg={'white'} p={4}
                rounded={8} boxShadow={'md'}
            >
                <Text mb={2}>You can deposit your money to any of these accounts</Text>
                <Stack
                    direction={['column', 'row']}
                    gap={2}
                >
                    {bankDetails.map((detail) => (
                        <Box
                            key={detail.account}
                            border={'1px'} rounded={'inherit'}
                            borderColor={'gray.200'} p={2}
                        >
                            <Text fontSize={'12'} mb={2}><b>Bank: </b> {detail.name}</Text>
                            <Text fontSize={'12'} mb={2}><b>Account: </b> {detail.account}</Text>
                            <Text fontSize={'12'} mb={2}><b>IFSC: </b> {detail.ifsc}</Text>
                            <Text fontSize={'12'} mb={2}><b>Address: </b> {detail.address}</Text>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </>
    )
}

export default BankDetails