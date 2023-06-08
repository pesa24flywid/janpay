import React, { useState, useEffect } from 'react'
import {
    Box,
    Stack,
    Text
} from '@chakra-ui/react'
import { ClientAxios } from '../lib/axios'

const BankDetails = ({color}) => {
    const [bankDetails, setBankDetails] = useState([])
    useEffect(() => {
        ClientAxios.post('/api/cms/banks/fetch').then((res) => {
            setBankDetails(res.data)
        })
    }, [])

    return (
        <>
            <Box
                w={['full', 'auto']}
                color={color} py={4}
            >
                <Text mb={2} fontSize={'xs'}>You can deposit your money to any of these accounts</Text>
                <Stack
                    direction={'column'}
                    gap={2}
                >
                    {bankDetails.map((detail, key) => {
                        if (detail.status) {
                            return (
                                <Box
                                    key={key}
                                    border={'1px'} rounded={'8'}
                                    borderColor={'gray.200'} p={2}
                                >
                                    <Text fontSize={'12'} mb={2}><b>Bank: </b> {detail.bank_name}</Text>
                                    <Text fontSize={'12'} mb={2}><b>Account: </b> {detail.account}</Text>
                                    <Text fontSize={'12'} mb={2}><b>IFSC: </b> {detail.ifsc}</Text>
                                </Box>
                            )
                        }
                    })}
                </Stack>
            </Box>
        </>
    )
}

export default BankDetails