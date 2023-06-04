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
  HStack,
  Text
} from '@chakra-ui/react'
import BackendAxios from '../../../lib/axios'
import Link from 'next/link'

const OnboardEko = () => {
  const Toast = useToast({ position: 'top-right' })
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVeried, setIsVeried] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function sendOtp() {
    BackendAxios.get("/api/eko/send-otp").then(res => {
      if (res.data.status == 0 && res.data.response_status_id == -1) {
        setIsOnboarded(true)
        return
      }
      Toast({
        status: 'success',
        description: res.data.message || "OTP Sent To Mobile"
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

  useEffect(() => {
    BackendAxios.get('/api/eko/bbps/operators/categories').then(res => {
      setIsOnboarded(true)
    }).catch(err => {
      if (err.response.status == 502) {
        setIsOnboarded(false)
      }
    })
  }, [])

  return (
    <>
      <DashboardWrapper pageTitle={'Server 2 Onboarding'}>
        <Box w={'full'} p={8}></Box>
        {
          isOnboarded ?
            <VStack gap={8} w={['full', 'xs']} mx={'auto'}>
              <Text>You Are Already Onboarded!</Text>
              <br />
              <Link href={'/dashboard?pageId=dashboard'}>
                <Button colorScheme='twitter' variant={'outline'} >Go To Dashboard</Button>
              </Link>
            </VStack>
            :
            <VStack gap={8} w={['full', 'xs']} mx={'auto'}>
              {isOtpSent ?
                <FormControl>
                  <FormLabel>Enter OTP Sent To Your Phone</FormLabel>
                  <Input type='phone' bg={'white'} onChange={e => setOtp(e.target.value)} />
                </FormControl> : null
              }
              <HStack>
                <Button colorScheme='twitter' variant={'outline'} onClick={sendOtp} >{isOtpSent ? "Resend" : "Send"} OTP</Button>
                {
                  isOtpSent ?
                    <Button colorScheme='twitter' onClick={verifyOtp}>Confirm</Button>
                    : null
                }
              </HStack>
            </VStack>
        }
      </DashboardWrapper>
    </>
  )
}

export default OnboardEko