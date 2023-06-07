import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Flex,
    Box,
    Image,
    Text,
    Button,
    useToast,
} from '@chakra-ui/react'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'


const Activate = () => {
    const [isOnboarded, setIsOnboarded] = useState(false)
    const [onboardFee, setOnboardFee] = useState("")
    const [services, setServices] = useState([])
    const [alreadyActiveServices, setAlreadyActiveServices] = useState([])
    const Toast = useToast({
        position: 'top-right'
    })


    // Check if user has paid onboarding fee or not
    useEffect(() => {
        BackendAxios.get('/api/user/check/onboard-fee').then((res) => {
            setOnboardFee(res.data[1].fee)
            if (res.data[0].onboard_fee == 1) {
                setIsOnboarded(true)
            }
            setOnboardFee(res.data[1].fee)
        })
    }, [])


    useEffect(() => {
        BackendAxios.get('/api/services').then((res) => {
            setServices(res.data)
        }).catch((err) => {
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: 'Could not load services'
            })
            console.log(err)
        })
    }, [])

    function activateService(serviceId) {
        BackendAxios.post(`/api/eko/attach-service/${serviceId}`).then((res) => {
            Toast({
                description: res.data
            })
            console.log(res.data)
        }).catch((err) => {
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: err.response.data.message || err.response.data || err.message
            })
        })
    }

    function activateEko(serviceId) {
        BackendAxios.get(`/api/eko/attach-service/${serviceId}`).then((res) => {
            Toast({
                description: res.data
            })
            console.log(res.data)
        }).catch((err) => {
            if(err.response.status == 502){

            }
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: err.response.data.message || err.response.data || err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper titleText={'Activate Services'}>

                <Text py={4}>Server 1 Services</Text>
                <Flex direction={'row'} gap={4} flexWrap={'wrap'} pb={8}>
                    {
                        services.map((service, key) => {
                            return (
                                <Box
                                    w={['28', '56']} key={key}
                                    p={4} rounded={12}
                                    boxShadow={'lg'}
                                    bg={'white'} py={4}
                                    display={'flex'}
                                    flexDir={'column'}
                                    alignItems={'center'}
                                    justifyContent={'flex-start'}
                                >
                                    <Image
                                        src={service.image_url}
                                        w={28} h={16}
                                        objectFit={'contain'}
                                    />
                                    <Text py={2}
                                        textAlign={'center'}
                                        textTransform={'capitalize'}
                                    >{service.service_name} Services</Text>
                                    <Button
                                        colorScheme={'twitter'}
                                        isDisabled={alreadyActiveServices.includes(service.service_name)}
                                        onClick={() => activateService(service.id)}
                                    >Activate</Button>
                                </Box>
                            )
                        })
                    }
                </Flex>

                <Text py={4}>Server 2 Services</Text>
                <Flex direction={'row'} gap={4} flexWrap={'wrap'} pb={8}>
                    {
                        services.filter(service => (service.eko_id && Number(service.eko_id) != 0)).map((service, key) => {
                            return (
                                <Box
                                    w={['28', '56']} key={key}
                                    p={4} rounded={12}
                                    boxShadow={'lg'}
                                    bg={'white'} py={4}
                                    display={'flex'}
                                    flexDir={'column'}
                                    alignItems={'center'}
                                    justifyContent={'flex-start'}
                                >
                                    <Image
                                        src={service.image_url}
                                        w={28} h={16}
                                        objectFit={'contain'}
                                    />
                                    <Text py={2}
                                        textAlign={'center'}
                                        textTransform={'capitalize'}
                                    >{service.service_name} Services</Text>
                                    <Button
                                        colorScheme={'twitter'}
                                        isDisabled={alreadyActiveServices.includes(service.service_name)}
                                        onClick={() => activateEko(service.id)}
                                    >Activate</Button>
                                </Box>
                            )
                        })
                    }
                </Flex>

            </DashboardWrapper>
        </>
    )
}

export default Activate