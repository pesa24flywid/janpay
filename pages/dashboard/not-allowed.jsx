import {
    HStack,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import DashboardWrapper from '../../hocs/DashboardLayout'

const NotAllowed = () => {
    return (
        <>
            <DashboardWrapper titleText={'Not Allowed'}>
                <HStack justifyContent={'center'} alignItems={'center'} h={'90vh'} w={'full'}>
                    <Text textAlign={'center'}>
                        You are not allowed to visit the requested page.
                        <br />
                        Please contact your admin (or your senior user)
                    </Text>
                </HStack>
            </DashboardWrapper>
        </>
    )
}

export default NotAllowed