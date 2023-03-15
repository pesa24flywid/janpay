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
import axios, { ClientAxios } from '../../../../lib/axios'

const Activate = () => {
    const [services, setServices] = useState([])
    const [alreadyActiveServices, setAlreadyActiveServices] = useState([])
    const Toast = useToast({
        position: 'top-right'
    })
    useEffect(() => {
        ClientAxios.post('/api/user/fetch', {
            user_id: localStorage.getItem('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setAlreadyActiveServices(res.data[0].active_services)
        }).catch((err) => {
            console.log(err)
        })


        axios.get('/api/services').then((res) => {
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
    return (
        <>
            <DashboardWrapper titleText={'Activate Services'}>

                <Flex direction={'row'} gap={4} flexWrap={'wrap'}>
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
                                    >Activate (₹{service.price})</Button>
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