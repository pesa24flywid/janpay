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
  const Toast = useToast({ position: 'top-right' })
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  function sendOtp() {
    BackendAxios.get("/api/eko/send-otp").then(res => {
      Toast({
        status: 'success',
        description: 'OTP Sent To Your Number'
      })
      setIsOtpSent(true)
    }).catch(err => {
      Toast({
        status: 'error',
        title: 'Error while sending OTP',
        description: err.response?.data || err.message
      })
    })
  }

  function verifyOtp() {
    if (!otp) {
      Toast({
        description: 'Please enter OTP'
      })
      return
    }
    BackendAxios.post('/api/eko/verify-otp', {
      otp: otp
    }).then(res => {
      Toast({
        description: res.data || 'You can close this window now.'
      })
    }).catch(err => {
      Toast({
        status: 'error',
        title: 'Error while verifying OTP',
        description: err.response?.data || err.message
      })
    })
  }

  return (
    <>
      <DashboardWrapper pageTitle={'Server 2 Onboarding'}>
        <Box w={'full'} p={8}></Box>

        <VStack gap={8} w={['full', 'xs']} mx={'auto'}>
          {
            isOtpSent ?
              <FormControl>
                <FormLabel>Enter OTP Sent To Your Phone</FormLabel>
                <Input type='phone' bg={'white'} onChange={e => setOtp(e.target.value)} />
              </FormControl>
              : null
          }
          <HStack>
            <Button colorScheme='twitter' variant={'outline'} onClick={sendOtp} >{isOtpSent ? "Resend" : "Click Here To Send"} OTP</Button>
            {
              isOtpSent ?
                <Button colorScheme='twitter' onClick={verifyOtp}>Confirm</Button>
                : null
            }
          </HStack>
        </VStack>

      </DashboardWrapper>
    </>
  )
}

export default OnboardEko