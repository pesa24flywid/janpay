import React from 'react'
import {
    VStack,
    Image,
    Text
} from '@chakra-ui/react'
import Lottie from 'lottie-react'
import loadingAnimation from '../public/loading.json'

const Loader = () => {
    return (
        <>
            <VStack
                position={'fixed'} top={0}
                left={0} right={0} bottom={0} h={'100vh'}
                zIndex={9999} bgColor={'rgba(0,0,0,0.6)'}
                justifyContent={'center'}
            >
                <Lottie
                    animationData={loadingAnimation}
                    style={{ width: '32px', height: '32px' }}
                    loop={true}
                />
                <Text textAlign={'center'} color={'#FFF'}>Loading... Please wait...</Text>
            </VStack>
        </>
    )
}

export default Loader