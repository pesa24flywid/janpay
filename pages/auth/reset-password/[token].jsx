import { React, useState } from 'react'
import Head from 'next/head'
import {
  Box,
  HStack,
  VStack,
  Text,
  Image,
  Button,
  Input,
  FormLabel,
  useToast,
} from '@chakra-ui/react'
import Navbar from '../../../hocs/Navbar'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const NewPassword = () => {
  const Toast = useToast()
  const Router = useRouter()

  function resetPassword(values) {
    return true
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
      token: ""
    },
    validationSchema: Yup.object({
      password: Yup.string().min(8, "Password must be 8 characters long").required("Please enter your new password"),
      confirm_password: Yup.string().required("Please re-enter your password").oneOf([Yup.ref('password'), null], "Passwords don't match!")
    }),
    onSubmit: (values) => {
      // Hit the reset password API
      const resetSuccess = resetPassword(values)
      if (resetPassword) {
        Router.push({
          pathname: '../login'
        }, undefined, {
          shallow: true
        })
      }
      else {
        Toast({
          status: "error",
          title: "An Error Occured",
          description: "There was an error, please contact technical support.",
          isClosable: true,
          duration: 2000,
          position: "top-right"
        })
      }
    }
  })

  return (
    <>
      <Head>
        <title>Pesa24 - New Password</title>
      </Head>
      <Navbar />

      <Box>
        <HStack mx={'auto'} my={[0, '12']}
          w={['full', 'fit-content', 'fit-content']}
          boxShadow={['none', 'lg']}
          bg={['white']} border={'1px'}
          borderColor={'rgb(224,224,224)'}
          rounded={['unset', 12]}
          alignItems={'center'} justifyContent={'center'}
        >
          <form action="#" method="post" onSubmit={formik.handleSubmit}>
            <VStack p={[4, 8]} w={['full', 'md', 'lg']} h={'auto'}>
              <Text fontSize={'3xl'}
                textTransform={'capitalize'}
                fontWeight={'600'}
                color={'#444'}
              >
                Reset Password
              </Text>

              <VStack py={8} spacing={8} alignItems={'flex-start'}>
                <Box>
                  <FormLabel pl={2}
                    htmlFor='user_id'
                    textAlign={'left'} mb={0}
                    color={'darkslategray'}
                  >
                    New Password
                  </FormLabel>
                  <Input w={['xs', 'sm']}
                    rounded={'full'}
                    name={'password'}
                    placeholder={'Your New Password'}
                    bg={'blue.100'} type={'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {
                    formik.errors.password && formik.touched.password ? (<Text color={'red'}>{formik.errors.password}</Text>) : null
                  }

                </Box>

                <Box>
                  <FormLabel pl={2}
                    htmlFor='user_id'
                    textAlign={'left'} mb={0}
                    color={'darkslategray'}
                  >
                    Confirm Password
                  </FormLabel>
                  <Input w={['xs', 'sm']}
                    rounded={'full'}
                    name={'confirm_password'}
                    placeholder={'Confirm Password'}
                    bg={'blue.100'} type={'text'}
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                  />
                  {
                    formik.errors.confirm_password && formik.touched.confirm_password ? (<Text color={'red'}>{formik.errors.confirm_password}</Text>) : null
                  }
                </Box>

                <Button
                  w={['xs', 'sm']} type={'submit'}
                  rounded={'full'}
                  colorScheme={'blue'}
                  bg={'#6C00FF'}
                >
                  Set Password
                </Button>
              </VStack>
            </VStack>
          </form>

          <VStack
            w={['none', 'sm', 'md']} pr={6}
            display={['none', 'flex', 'flex']}
            alignItems={'center'} justifyContent={'center'}
            h={'full'} borderRadius={['unset', '0 12 12 0']}
          >
            <Image
              src={'/password-reset.png'}
            />
          </VStack>
        </HStack>
      </Box>
    </>
  )
}

export default NewPassword