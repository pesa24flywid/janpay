import React, {useState, useEffect} from 'react'
import {
    Box,
    HStack,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BankDetails from './BankDetails'


const DashboardWrapper = (props) => {
    const [newNotification, setNewNotification] = useState(true)

    useEffect(() => {

        // Check for new notifications

    }, [])

    return (
        <>
            <Head><title>Pesa24 - {props.title}</title></Head>
            <Box
                bg={'aliceblue'} p={[0, 4]}
                w={'full'} minH={'100vh'}>
                <HStack spacing={8} alignItems={'flex-start'}>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Dashboard Container */}
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        flex={['unset', 7]}
                        w={'full'}
                    >
                        <Topbar
                            title={props.title}
                            aeps={8000}
                            dmt={6400}
                            prepaid={2600}
                            notification={true}
                        />

                        {props.children}

                        <BankDetails />
                    </Box>


                </HStack>
            </Box>
        </>
    )
}

export default DashboardWrapper