import Head from 'next/head'
import React, { useState } from 'react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    Flex,
    Image,
    FormLabel,
    InputGroup,
    InputRightElement,
    InputLeftAddon,
    PinInput,
    PinInputField,
    useToast

} from '@chakra-ui/react'
import Navbar from '../../hocs/Navbar'
import { FiPhone, FiMail } from 'react-icons/fi'
import { useFormik } from 'formik'
import Link from 'next/link'

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpBtnDisabled, setOtpBtnDisabled] = useState(false)
    const [loginBtnDisabled, setLoginBtnDisabled] = useState(true)
    const [authMethod, setAuthMethod] = useState("phone")
    const [otp, setOtp] = useState("")
    const toast = useToast()


    // Sending the OTP
    async function sendOtp() {
        return {
            status: "success",
            title: "OTP Sent!",
            message: `We have sent an OTP to your ${authMethod}`,
        }
    }

    // Using Formik to handle authentication form
    const formik = useFormik({
        initialValues: {
            user_id: "",
            password: "",
        },
        onSubmit: async (values) => {
            // Submitting the login request to backend
            const otpSuccess = await sendOtp()
            setOtpBtnDisabled(true)
            toast({
                title: otpSuccess.title,
                description: otpSuccess.message,
                status: otpSuccess.status,
                position: 'top-right',
                duration: 3000
            })
            otpSuccess.status == "success" ? setOtpSent(true) : null
            setTimeout(() => {
                setOtpBtnDisabled(false)
            }, 10000)
        }
    })


    // Checking authentication method
    function checkAuthMethod(e) {
        if (isNaN(e.target.value)) {
            setAuthMethod("email")
            e.target.setAttribute("maxlength", 40)
        }
        else {
            setAuthMethod("phone")
            e.target.setAttribute("maxlength", 10)
        }
    }


    function handleLogin(e) {
        e.preventDefault
    }


    return (
        <>
            <Head>
                <title>Pesa24 - Login</title>
            </Head>
            <Navbar />
            <Box>
                <HStack mx={'auto'} my={[0, '12']}
                    w={['full', 'fit-content', 'fit-content']}
                    boxShadow={['none', 'lg']}
                    bg={['white']} border={'1px'}
                    borderColor={'rgb(224,224,224)'}
                    rounded={['unset', 12]} h={['100vh', 'xl']}
                    alignItems={'center'} justifyContent={'center'}
                >
                    <form action="#" method="post" onSubmit={formik.handleSubmit}>
                        <VStack p={[4, 8]} w={['full', 'md', 'lg']}>
                            <Text fontSize={'3xl'}
                                textTransform={'capitalize'}
                                fontWeight={'600'}
                                color={'#444'}
                            >Login</Text>

                            <VStack py={8} alignItems={'flex-start'}>
                                <Box mb={4}>
                                    <FormLabel pl={2}
                                        htmlFor='user_id'
                                        textAlign={'left'} mb={0}
                                        color={'darkslategray'}>Phone Number or Email ID
                                    </FormLabel>
                                    <InputGroup w={['xs','sm']}>
                                        <InputLeftAddon
                                            children={authMethod == "phone" ? <FiPhone /> : <FiMail />} rounded={'full'}
                                        />
                                        <Input
                                            rounded={'full'}
                                            name={'user_id'}
                                            placeholder={'Phone Number or Email'}
                                            bg={'blue.100'}
                                            required value={formik.values.user_id}
                                            onChange={(e) => { checkAuthMethod(e); formik.handleChange(e) }}
                                        />
                                    </InputGroup>
                                </Box>
                                <Box mb={4}>
                                    <FormLabel
                                        htmlFor='password'
                                        textAlign={'left'} mb={0}
                                        color={'darkslategray'}>Password
                                    </FormLabel>
                                    <InputGroup w={['xs','sm']}>
                                        <Input
                                            rounded={'full'}
                                            type={passwordVisible ? 'text' : 'password'} name={'password'}
                                            placeholder={'Password'} bg={'blue.100'}
                                            required onChange={formik.handleChange}
                                        />
                                        <InputRightElement
                                        >
                                            {passwordVisible ?
                                                <Button
                                                    w={'2em'}
                                                    display={'grid'} bg={'none'}
                                                    placeContent={'center'}
                                                    cursor={'pointer'} rounded={'full'}
                                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                                >
                                                    <BsEyeSlashFill fontSize={20} />
                                                </Button>
                                                :
                                                <Button
                                                    w={'2em'}
                                                    display={'grid'} bg={'none'}
                                                    placeContent={'center'}
                                                    cursor={'pointer'} rounded={'full'}
                                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                                >
                                                    <BsEyeFill fontSize={20} />
                                                </Button>}
                                        </InputRightElement>
                                    </InputGroup>
                                    <Link href={'../auth/reset-password'}>
                                        <Text 
                                        pt={2}
                                        fontSize={'sm'}
                                        color={'blue'} 
                                        textAlign={'right'}>Reset Password</Text>
                                    </Link>
                                </Box>
                                <Box pt={6}>
                                    <Button
                                        w={['xs','sm']}
                                        rounded={'full'}
                                        colorScheme={'blue'}
                                        variant={'outline'}
                                        disabled={otpBtnDisabled}
                                        type={'submit'}
                                    >
                                        {otpSent ? `Resend OTP` : `Send OTP`}
                                    </Button>
                                </Box>
                            </VStack>
                            {
                                otpSent ?
                                    <form action="#" method="post" onSubmit={handleLogin}>
                                        <VStack>
                                            <Text>Enter OTP</Text>
                                            <input type="hidden" name="user_id" value={formik.values.user_id} />
                                            <HStack>
                                                <PinInput type='number' otp onComplete={(value) => {setOtp(value); setLoginBtnDisabled(false)}}>
                                                    <PinInputField bg={'blue.100'} required />
                                                    <PinInputField bg={'blue.100'} required />
                                                    <PinInputField bg={'blue.100'} required />
                                                    <PinInputField bg={'blue.100'} required />
                                                </PinInput>
                                            </HStack>
                                            <Box pt={4}>
                                                <Button
                                                    w={['xs','sm']} type={'submit'}
                                                    rounded={'full'}
                                                    colorScheme={'blue'}
                                                    bg={'#6C00FF'}
                                                    disabled={loginBtnDisabled}
                                                >
                                                    Login
                                                </Button>
                                            </Box>
                                        </VStack>
                                    </form> : null

                            }
                        </VStack>
                    </form>

                    <VStack w={['none', 'sm', 'md']}
                        display={['none', 'flex', 'flex']}
                        alignItems={'center'} justifyContent={'center'}
                        h={'full'} borderRadius={['unset', '0 12 12 0']}
                    >
                        <Image
                            src={'../auth.png'}
                        />
                    </VStack>
                </HStack>
            </Box>
        </>
    )
}

export default Login