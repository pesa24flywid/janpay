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
    useEffect(()=>{
        BackendAxios.get('/api/user/check/onboard-fee').then((res)=>{
            setOnboardFee(res.data[1].fee)
            if(res.data[0].onboard_fee == 1){
                setIsOnboarded(true)
            }
        })
    },[])


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

    function onboardMe(){
        BackendAxios.get('/api/user/pay/onboard-fee').then((res)=>{
            Toast({
                status: 'success',
                title: 'Welcome on board!',
                description: 'The page will refresh automatically'
            })
            setTimeout(()=>{
                window.location.reload()
            }, 1000)
        }).catch((err)=>{
            console.log(err)
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: err.message
            })
        })
    }
    return (
        <>
            <DashboardWrapper titleText={'Activate Services'}>

                <Flex direction={'row'} gap={4} flexWrap={'wrap'}>

                    <Box
                        w={['28', '56']}
                        p={4} rounded={12}
                        boxShadow={'lg'}
                        bg={'white'} py={4}
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'flex-start'}
                    >
                        <Image
                            src={process.env.NEXT_PUBLIC_LOGO}
                            w={28} h={16}
                            objectFit={'contain'}
                        />
                        <Text py={2}
                            textAlign={'center'}
                            textTransform={'capitalize'}
                        >Onboarding Fees</Text>
                        <Button
                            colorScheme={'twitter'}
                            isDisabled={isOnboarded}
                            onClick={()=>onboardMe()}
                        >Pay ₹ {onboardFee}</Button>
                    </Box>
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