import {
    HStack,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import DashboardWrapper from '../../hocs/DashboardLayout'

const NotAvailable = () => {
    return (
        <>
            <DashboardWrapper titleText={'Not Available'}>
                <HStack justifyContent={'center'} alignItems={'center'} h={'90vh'} w={'full'}>
                    <Text textAlign={'center'}>
                        This service is not available at the moment.
                        <br />
                        Please try again later.
                    </Text>
                </HStack>
            </DashboardWrapper>
        </>
    )
}

export default NotAvailable