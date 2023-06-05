import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    Image,
    FormLabel,
    InputGroup,
    InputRightElement,
    InputLeftAddon,
    PinInput,
    PinInputField,
    useToast,
    RadioGroup,
    Radio,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react'
import Navbar from '../../hocs/Navbar'
import { FiPhone, FiMail } from 'react-icons/fi'
import { useFormik } from 'formik'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
var bcrypt = require('bcryptjs')

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpBtnDisabled, setOtpBtnDisabled] = useState(false)
    const [loginBtnDisabled, setLoginBtnDisabled] = useState(true)
    const [authMethod, setAuthMethod] = useState("phone")
    const [otp, setOtp] = useState("")
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const Toast = useToast({ position: 'top-right' })
    const Router = useRouter()

    const [loginPreference, setLoginPreference] = useState('otp')
    const [ModalStatus, setModalStatus] = useState(false)
    const [mpin, setMpin] = useState(null)

    useEffect(() => {
        getLocation()
        window.addEventListener("load", () => {
            window.onkeydown(e => {
                if (e.keyCode === 13) {
                    e.preventDefault()
                    return false
                }
            })
        })
    }, [])


    // Getting user location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                Cookies.set("latlong", position.coords.latitude + "," + position.coords.longitude)
            })
        } else {
            Toast({
                status: "error",
                title: "Location Error",
                description: "No GPS detected. Try logging in with another device."
            })
            setOtpBtnDisabled(true)
            setLoginBtnDisabled(true)
        }
    }

    // Sending the OTP
    async function sendOtp() {
        try {
            setOtpBtnDisabled(true)
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-otp`, JSON.stringify({
                authMethod: authMethod,
                ...(authMethod === "email" && { "email": formik.values.user_id }),
                ...(authMethod === "phone" && { "phone_number": formik.values.user_id }),
                password: formik.values.password
            }), {
                withCredentials: true,
                headers: {
                    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            })
            return {
                status: "success",
                title: "OTP Sent!",
                message: `We have sent an OTP to your ${authMethod}`,
            }
        } catch (error) {
            setOtpBtnDisabled(false)
            return {
                status: "error",
                title: "Error Occured",
                message: error.response.data.message || error.response.data || error.message,
            }
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
            if (loginPreference == 'otp') {
                const otpSuccess = await sendOtp(values)
                setOtpBtnDisabled(true)
                Toast({
                    title: otpSuccess.title,
                    description: otpSuccess.message,
                    status: otpSuccess.status,
                    duration: 3000
                })
                otpSuccess.status == "success" ? setOtpSent(true) : setOtpBtnDisabled(false)
                setTimeout(() => {
                    setOtpBtnDisabled(false)
                }, 10000)
            }
            else {
                setModalStatus(true)
            }
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


    // Handling login after OTP submission
    async function handleLogin() {
        setIsBtnLoading(true)
        if (!Cookies.get("latlong")) {
            Toast({
                status: 'warning',
                title: 'Location Not Found!',
                description: 'Please allow location access to login'
            })
            return
        }
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, JSON.stringify({
                "authMethod": authMethod,
                ...(authMethod === "email" && { "email": formik.values.user_id }),
                ...(authMethod === "phone" && { "phone_number": formik.values.user_id }),
                "otp": otp,
                "password": formik.values.password,
                "remember": 1,
                "latlong": Cookies.get("latlong"),
                organization_code: process.env.NEXT_PUBLIC_ORGANISATION.toUpperCase(),
            }), {
                withCredentials: true,
                headers: {
                    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            }).then(async (res) => {
                var hashedValue = await bcrypt.hash(`${res.data.id + res.data.name}`, 2)
                Cookies.set("verified", hashedValue)
                localStorage.setItem("userId", res.data.id)
                Cookies.set("userId", res.data.id)
                localStorage.setItem("userName", res.data.name)
                Cookies.set("userName", res.data.name)
                localStorage.setItem("userType", res.data.role[0].name)
                localStorage.setItem("balance", res.data.wallet)
                localStorage.setItem("profilePic", `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${res.data.profile_pic}`)

                Cookies.set('access-token', res.data.token.original.access_token)
                if (res.data.profile_complete == 0) localStorage.setItem("isProfileComplete", false)
                if (res.data.profile_complete == 1) localStorage.setItem("isProfileComplete", true)
            }).then(() => {
                setTimeout(() => {
                    Router.push("/dashboard?pageId=dashboard")
                }, 1000);
            })

        } catch (err) {
            console.log(err)
            Toast({
                status: "error",
                title: "Error Occured",
                description: err.response.data.message || err.response.data || err.message,
                isClosable: true,
                duration: 3000,
                position: "top-right"
            })
            setIsBtnLoading(false)
        }
    }


    // Handling MPIN Login
    async function handleMpin() {
        if (!Cookies.get("latlong")) {
            Toast({
                status: 'warning',
                title: 'Location Not Found!',
                description: 'Please allow location access to login'
            })
            return
        }
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, JSON.stringify({
                authMethod: authMethod,
                ...(authMethod === "email" && { "email": formik.values.user_id }),
                ...(authMethod === "phone" && { "phone": formik.values.user_id }),
                password: formik.values.password,
                mpin: mpin,
                organization_code: process.env.NEXT_PUBLIC_ORGANISATION.toUpperCase(),
                latlong: Cookies.get("latlong"),
            }), {
                withCredentials: true,
                headers: {
                    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            }).then(async (res) => {
                var hashedValue = await bcrypt.hash(`${res.data.id + res.data.name}`, 2)
                Cookies.set("verified", hashedValue)
                localStorage.setItem("userId", res.data.id)
                Cookies.set("userId", res.data.id)
                localStorage.setItem("userName", res.data.name)
                Cookies.set("userName", res.data.name)
                localStorage.setItem("userType", res.data.role[0].name)
                localStorage.setItem("balance", res.data.wallet)
                localStorage.setItem("profilePic", `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${res.data.profile_pic}`)

                Cookies.set('access-token', res.data.token.original.access_token)

                if (res.data.profile_complete == 0) localStorage.setItem("isProfileComplete", false)
                if (res.data.profile_complete == 1) localStorage.setItem("isProfileComplete", true)
            }).then(() => {
                setTimeout(() => {
                    Router.push("/dashboard?pageId=dashboard")
                }, 1000);
            })

        } catch (err) {
            console.log(err)
            Toast({
                status: 'error',
                description: err.response.data.message || err.response.data || err.message,
                title: 'Error Occured',
            })
        }
    }

    return (
        <>
            <Head>
                <title>Pesa24 - Login</title>
            </Head>
            <Box>
                <HStack
                    mx={'auto'} my={[0, '12']} minH={'90vh'}
                    w={['full', 'fit-content', 'fit-content']}
                    boxShadow={['none', 'lg']}
                    bg={['white']} borderWidth={['0px', '0.5px']}
                    borderColor={'rgb(224,224,224)'}
                    rounded={['unset', 12]} h={['auto', 'auto']}
                    alignItems={'center'} justifyContent={'center'}
                >
                    <form action="#" method="post" onSubmit={formik.handleSubmit}>
                        <VStack p={[4, 8]} w={['full', 'md', 'lg']}>
                            <Image src='/logo_long.png' w={'28'} pos={'relative'} top={'-16'} />
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
                                    <InputGroup w={['xs', 'sm']}>
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
                                    <InputGroup w={['xs', 'sm']}>
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
                                <HStack spacing={6} pt={4}>
                                    <Text>Login Preference</Text>
                                    <RadioGroup name='loginPreference' value={loginPreference} onChange={(value) => setLoginPreference(value)}>
                                        <HStack spacing={4}>
                                            <Radio value='otp'>OTP</Radio>
                                            <Radio value='mpin'>MPIN</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </HStack>
                                <Box pt={6}>
                                    <Button
                                        w={['xs', 'sm']}
                                        rounded={'full'}
                                        colorScheme={'blue'}
                                        variant={'outline'}
                                        autoFocus={false}
                                        disabled={otpBtnDisabled}
                                        onClick={formik.handleSubmit}
                                    >
                                        Login
                                    </Button>
                                </Box>

                            </VStack>
                            {
                                otpSent ?
                                    <>
                                        <VStack>
                                            <Text>Enter OTP</Text>
                                            <input type="hidden" name="user_id" value={formik.values.user_id} />
                                            <HStack>
                                                <PinInput type='number' otp onComplete={(value) => { setOtp(value); setLoginBtnDisabled(false) }}>
                                                    <PinInputField bg={'blue.100'} />
                                                    <PinInputField bg={'blue.100'} />
                                                    <PinInputField bg={'blue.100'} />
                                                    <PinInputField bg={'blue.100'} />
                                                </PinInput>
                                            </HStack>
                                            <Box pt={4}>
                                                <Button
                                                    w={['xs', 'sm']} onClick={handleLogin}
                                                    rounded={'full'}
                                                    colorScheme={'blue'}
                                                    bg={'#6C00FF'}
                                                    autoFocus={false}
                                                    disabled={loginBtnDisabled}
                                                    isLoading={isBtnLoading}
                                                >
                                                    Login
                                                </Button>
                                            </Box>
                                        </VStack>
                                    </> : null
                            }

                            <Link href={'/auth/register'}>
                                <Text color={'blue.700'} fontWeight={'semibold'}>Not a member yet? Register here.</Text>
                            </Link>
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
                <Text fontSize={'xs'} w={'full'} textAlign={'center'}>{process.env.NEXT_PUBLIC_ORGANISATION_NAME}</Text>
            </Box>


            {/* MPIN Modal */}
            <Modal
                isOpen={ModalStatus}
                onClose={() => setModalStatus(false)}
                isCentered={true}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text>Enter your MPIN</Text>
                    </ModalHeader>
                    <ModalBody>
                        <HStack spacing={4} justifyContent={'center'}>
                            <PinInput otp onChange={(values) => setMpin(values)}>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'} spacing={6}>
                            <Button colorScheme={'twitter'} onClick={() => handleMpin()}>Login</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Login