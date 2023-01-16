import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import axios from '../../lib/axios'
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

const Register = () => {
    const [isRetailerDisabled, setIsRetailerDisabled] = useState(false)
    const [isDistributorDisabled, setIsDistributorDisabled] = useState(false)
    const [isSuperDistributorDisabled, seSupertIsDistributorDisabled] = useState(true)
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        axios.get("/sanctum/csrf-cookie")
    
    }, [])

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            user_type: "Retailer",
            referral_id: "",
        },
        onSubmit: async (values) => {
            // Handling registration
            setIsBtnLoading(true)
            try {
                await axios.post("/register", JSON.stringify(values)).then(() => {
                    toast({
                        status: "success",
                        title: "Credentials Sent",
                        description: "Check your mail for login steps.",
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

    return (
        <>
            <Head>
                <title>Pesa24 - Register</title>
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
                                Register
                            </Text>

                            <VStack py={8} spacing={8} alignItems={'flex-start'}>
                                <HStack spacing={4} w={['xs', 'sm']}>
                                    <Box>
                                        <FormLabel
                                            pl={2}
                                            htmlFor='first_name'
                                            textAlign={'left'} mb={0}
                                            color={'darkslategray'}
                                        >
                                            First Name
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                rounded={'full'}
                                                name={'first_name'}
                                                placeholder={'First Name'}
                                                bg={'blue.100'}
                                                required value={formik.values.first_name}
                                                onChange={formik.handleChange}
                                            />
                                        </InputGroup>
                                    </Box>
                                    <Box>
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
                                </HStack>
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
                                    <RadioGroup name={'user_type'} onChange={formik.handleChange} defaultValue={formik.values.user_type}>
                                        <Stack direction={['column', 'row']} spacing={[3, 6]}>
                                            <Radio isDisabled={isRetailerDisabled} value={'Retailer'}>Retailer</Radio>
                                            <Radio isDisabled={isDistributorDisabled} value={'Distributor'}>Distributor</Radio>
                                            <Radio isDisabled={isSuperDistributorDisabled} value={'Super Distributor'}>Super Distributor</Radio>
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

                    <VStack
                        w={['none', 'sm', 'md']} pr={6}
                        display={['none', 'flex', 'flex']}
                        alignItems={'center'} justifyContent={'center'}
                        h={'full'} borderRadius={['unset', '0 12 12 0']}
                    >
                        <Image
                            src={'../register.png'}
                        />
                    </VStack>
                </HStack>
            </Box>
        </>
    )
}

export default Register