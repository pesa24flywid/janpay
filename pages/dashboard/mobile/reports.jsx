import React from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import { SidebarOptions } from '../../../hocs/Sidebar'
import Link from 'next/link'
import { Box, Text } from '@chakra-ui/react'

const reports = () => {
    return (
        <>
            <DashboardWrapper pageTitle={'Reports'}>
                <Box w={'full'} ></Box>
                {
                    SidebarOptions.find(item => (item.title == 'reports')).children.map((item, key) => (
                        <Box
                            px={3} py={4} w={'full'}
                            _hover={{ bg: 'FFF' }}
                        >
                            <Link key={key} href={item.soon ? "#" : item.link}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '4px'
                                }}>
                                <Text
                                    textAlign={'left'}
                                    textTransform={'capitalize'}
                                >{item.title}</Text>
                                {
                                    item.soon &&
                                    <Text fontSize={8} p={1} bg={'yellow.100'} color={'yellow.900'}>Coming Soon</Text>
                                }
                            </Link>
                        </Box>
                    ))
                }
            </DashboardWrapper>
        </>
    )
}

export default reports