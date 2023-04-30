import React from 'react'
import {
    Image,
    Text
} from '@chakra-ui/react'

const Offline = () => {
    return (
        <>
            <Image
                src='/offline.jpg'
                p={8} mb={8}
            />
            <Text>You are offline</Text>
        </>
    )
}

export default Offline