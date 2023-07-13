import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import {
    Box,
    VStack,
    HStack,
    Stack,
    Text,
    Input,
    Button,
    Image,
    FormLabel,
    InputGroup,
    useToast,
    Radio,
    RadioGroup
} from '@chakra-ui/react'
import Navbar from '../../hocs/Navbar'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { ClientAxios } from '../../lib/axios'
var bcrypt = require('bcryptjs')

const Register = () => {
    const Router = useRouter()
    const [isRetailerDisabled, setIsRetailerDisabled] = useState(false)
    const [isDistributorDisabled, setIsDistributorDisabled] = useState(true)
    const [isSuperDistributorDisabled, setIsSuperDistributorDisabled] = useState(true)
    const [defaultRole, setDefaultRole] = useState("")
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const toast = useToast()

    const formik = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone: "",
            user_type: "",
            referral_id: "",
            organization_code: process.env.NEXT_PUBLIC_ORGANISATION.toUpperCase()
        },
        onSubmit: async (values) => {
            // Handling registration
            setIsBtnLoading(true)
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, JSON.stringify(values), {
                    withCredentials: true,
                    headers: {
                        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                }).then(() => {
                    toast({
                        status: "success",
                        title: "Credentials Sent",
                        description: "Check your phone for login steps.",
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right'
                    })
                    setIsBtnLoading(false)
                })
            } catch (error) {
                toast({
                    status: "error",
                    title: "Error Occured",
                    description: error.response.data.message,
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                })
                setIsBtnLoading(false)
            }
        }
    })

    useEffect(() => {

        ClientAxios.get('/api/global').then((res) => {
            setIsRetailerDisabled(!res.data[0].retailer)
            setIsDistributorDisabled(!res.data[0].distributor)
            setIsSuperDistributorDisabled(!res.data[0].super_distributor)
            formik.setFieldValue("user_type", res.data[0].default_role)
        }).catch((err) => {
            console.log(err)
        })

    }, [])

    return (
        <>
            <form action="#" method="post" onSubmit={formik.handleSubmit}>
                <VStack p={[4, 8]} w={'full'}>
                    <Text fontSize={'2xl'}
                        textTransform={'capitalize'}
                        fontWeight={'600'}
                        color={'#444'} pb={4}
                    >
                        Register
                    </Text>

                    <VStack spacing={8} alignItems={'center'}>
                        <VStack spacing={4} w={['xs', 'sm']}>
                            <Box w={'full'}>
                                <FormLabel
                                    pl={2}
                                    htmlFor='first_name'
                                    textAlign={'left'} mb={0}
                                    color={'darkslategray'}
                                >
                                    First Name
                                </FormLabel>
                                <Input
                                    rounded={'full'}
                                    name={'first_name'}
                                    placeholder={'First Name'}
                                    bg={'blue.100'}
                                    required value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                />
                            </Box>
                            <Box w={'full'}>
                                <FormLabel
                                    pl={2}
                                    htmlFor='first_name'
                                    textAlign={'left'} mb={0}
                                    color={'darkslategray'}
                                >
                                    Middle Name
                                </FormLabel>
                                <Input
                                    rounded={'full'}
                                    name={'middle_name'}
                                    placeholder={'Middle Name'}
                                    bg={'blue.100'}
                                    value={formik.values.middle_name}
                                    onChange={formik.handleChange}
                                />
                            </Box>
                            <Box w={'full'}>
                                <FormLabel
                                    pl={2}
                                    htmlFor='user_id'
                                    textAlign={'left'} mb={0}
                                    color={'darkslategray'}
                                >
                                    Last Name
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        rounded={'full'}
                                        name={'last_name'}
                                        placeholder={'Last Name'}
                                        bg={'blue.100'}
                                        required value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                    />
                                </InputGroup>
                            </Box>
                        </VStack>
                        <Box>
                            <FormLabel pl={2}
                                htmlFor='user_id'
                                textAlign={'left'} mb={0}
                                color={'darkslategray'}
                            >
                                Email
                            </FormLabel>
                            <InputGroup w={['xs', 'sm']}>
                                <Input
                                    rounded={'full'}
                                    name={'email'}
                                    placeholder={'Your Email'}
                                    bg={'blue.100'} type={'email'}
                                    required value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                            </InputGroup>
                        </Box>
                        <Box>
                            <FormLabel pl={2}
                                htmlFor='user_id'
                                textAlign={'left'} mb={0}
                                color={'darkslategray'}
                            >
                                Phone Number
                            </FormLabel>
                            <InputGroup w={['xs', 'sm']}>
                                <Input
                                    rounded={'full'}
                                    name={'phone'}
                                    placeholder={'Your Phone Number'}
                                    bg={'blue.100'} type={'tel'}
                                    required value={formik.values.phone}
                                    onChange={formik.handleChange}
                                />
                            </InputGroup>
                        </Box>
                        <Box>
                            <FormLabel
                                htmlFor='password'
                                textAlign={'left'} mb={0}
                                color={'darkslategray'}>Referral ID
                            </FormLabel>
                            <Input
                                rounded={'full'}
                                name={'referral_id'}
                                placeholder={'Enter Referral ID'}
                                bg={'blue.100'} w={['xs', 'sm']}
                                value={formik.values.referral_id}
                                onChange={formik.handleChange}
                            />
                        </Box>
                        <Box>
                            <FormLabel
                                htmlFor='user_type'
                                textAlign={'left'}
                                color={'darkslategray'}>Register as:
                            </FormLabel>
                            <RadioGroup name={'user_type'}
                                onChange={(value) => formik.setFieldValue("user_type", value)}
                                value={formik.values.user_type} >
                                <Stack
                                    direction={'row'} gap={[3, 6]}
                                    alignItems={'center'} justifyContent={'flex-start'}
                                >
                                    <Radio isDisabled={isRetailerDisabled} value={'retailer'}>Retailer</Radio>
                                    <Radio isDisabled={isDistributorDisabled} value={'distributor'}>Distributor</Radio>
                                    <Radio
                                        isDisabled={isSuperDistributorDisabled}
                                        value={'super_distributor'}
                                    >Super Distributor</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                        <Button
                            w={['xs', 'sm']} type={'submit'}
                            rounded={'full'}
                            colorScheme={'blue'}
                            bg={'#6C00FF'}
                            isLoading={isBtnLoading}
                        >
                            Register
                        </Button>
                    </VStack>
                </VStack>
            </form>
        </>
    )
}

export default Register