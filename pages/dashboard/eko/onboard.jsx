import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import {
  Box,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  HStack
} from '@chakra-ui/react'
import BackendAxios from '../../../lib/axios'

const OnboardEko = () => {
  const [onboardState, setOnboardState] = useState("otp")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const Toast = useToast({ position: 'top-right' })

  function sendOtp() {
    BackendAxios.get("/api/eko/send-otp").then(res => {

    }).catch(err => {
      Toast({
        status: 'error',
        title: 'Error while sending OTP',
        description: err.message
      })
    })
  }

  return (
    <>
      <DashboardWrapper pageTitle={'Server 2 Onboarding'}>
        <Box w={'full'} p={8}></Box>
        <VStack gap={8} w={['full', 'xs']} mx={'auto'}>
          <FormControl>
            <FormLabel>Enter OTP Sent To Your Phone</FormLabel>
            <Input type='phone' bg={'white'} />
          </FormControl>
          <HStack>
            <Button colorScheme='twitter' variant={'outline'} onClick={sendOtp} >{isOtpSent ? "Resend" : "Send"} OTP</Button>
            <Button colorScheme='twitter'>Confirm</Button>
          </HStack>
        </VStack>
      </DashboardWrapper>
    </>
  )
}

export default OnboardEko