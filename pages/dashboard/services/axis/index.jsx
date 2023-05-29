import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Button,
    Stack,
    HStack,
    useToast,
    Text
} from '@chakra-ui/react'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'

const AxisAccount = () => {
    const Toast = useToast({ position: 'top-right' })
    const [accountType, setAccountType] = useState("1")

    useEffect(() => {
        ClientAxios.get(`/api/organisation`).then(res => {
            if (!res.data[0].axis_status) {
                window.location.href('/dashboard/not-available')
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function applyNow() {
        BackendAxios.post(`/api/paysprint/axis/account`, {
            type: accountType
        }).then(res => {
            if (res.data.data) {
                window.open(res.data.data, "_blank")
            }
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Error while applying',
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper pageTitle={'Axis Bank Account'}>
                <Box
                    rounded={12}
                    bg={'#FFF'} boxShadow={'lg'}
                    p={4}
                >
                    <Text>Apply For New Bank Account</Text>
                    <Stack
                        gap={8} w={'full'} p={4}
                        direction={['column', 'row']}
                    >

                        <Button
                            colorScheme='facebook'
                            variant={accountType == "1" ? 'solid' : 'outline'}
                            onClick={() => setAccountType("1")}
                        >Savings Account</Button>

                        <Button
                            colorScheme='facebook'
                            variant={accountType == "2" ? 'solid' : 'outline'}
                            onClick={() => setAccountType("2")}
                        >Current Account</Button>

                        <Button
                            colorScheme='facebook'
                            variant={accountType == "3" ? 'solid' : 'outline'}
                            onClick={() => setAccountType("3")}
                        >Current Account for Proprietorship</Button>

                    </Stack>

                    <HStack justifyContent={'flex-end'} p={4}>
                        <Button colorScheme='twitter' onClick={applyNow}>Apply Now</Button>
                    </HStack>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default AxisAccount