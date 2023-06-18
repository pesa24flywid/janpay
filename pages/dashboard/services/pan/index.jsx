import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Input,
    Button,
    Text,
    Stack,
    FormControl,
    FormLabel,
    useToast,
    Select,
    HStack,
    VStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import { useFormik } from 'formik'
import { IoIosMan, IoIosTransgender, IoIosWoman } from 'react-icons/io'


const Pan = () => {
    const Toast = useToast({ position: 'top-right' })


    useEffect(() => {
        ClientAxios.get(`/api/organisation`).then(res => {
            if (!res.data.pan_status) {
                window.location.href('/dashboard/not-available')
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [encData, setEncData] = useState("")
    const [encUrl, setEncUrl] = useState("")
    const Formik = useFormik({
        initialValues: {
            title: "",
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            mode: "",
            email: "",
        },
        onSubmit: values => {
            BackendAxios.post(`/api/paysprint/pan/start`, { ...values }).then(res => {
                setEncData(res.data.data.encdata)
                setEncUrl(res.data.data.url)
                onOpen()
            }).catch(err => {
                Toast({
                    status: 'error',
                    title: 'Error while sending request',
                    description: err.response.data.message || err.response.data || err.message
                })
            })
        }
    })
    return (
        <>
            <DashboardWrapper pageTitle={'PAN'}>
                <form action={encUrl} method='POST' id='encForm'>
                    <input type="hidden" name='encdata' value={encData} />
                </form>
                <Box
                    w={['full']}
                    p={4} rounded={8}
                    boxShadow={'lg'}
                    bg={'#FFF'}
                >
                    <Stack
                        gap={8} py={8} w={'full'}
                        direction={['column', 'row']}
                    >
                        <FormControl w={['full', 'sm']}>
                            <FormLabel>Select Gender</FormLabel>
                            <HStack gap={4}>
                                <Button
                                    colorScheme='telegram' size={['sm', 'md']}
                                    variant={Formik.values.gender == "M" ? "solid" : 'outline'}
                                    leftIcon={<IoIosMan />} onClick={() => Formik.setFieldValue("gender", "M")}
                                >
                                    Male
                                </Button>
                                <Button
                                    colorScheme='telegram' size={['sm', 'md']}
                                    variant={Formik.values.gender == "F" ? "solid" : 'outline'}
                                    leftIcon={<IoIosWoman />} onClick={() => Formik.setFieldValue("gender", "F")}
                                >
                                    Female
                                </Button>
                                <Button
                                    colorScheme='telegram' size={['sm', 'md']}
                                    variant={Formik.values.gender == "T" ? "solid" : 'outline'}
                                    leftIcon={<IoIosTransgender />} onClick={() => Formik.setFieldValue("gender", "T")}
                                >
                                    Transgender
                                </Button>
                            </HStack>
                        </FormControl>
                        <FormControl w={['full', 'sm']} isRequired>
                            <FormLabel>Select Title</FormLabel>
                            <Select placeholder='Select Title' name={'title'} onChange={Formik.handleChange}>
                                {
                                    Formik.values.gender == "M" || Formik.values.gender == "T" ?
                                        <option value="1">Shri</option> : null
                                }
                                {
                                    Formik.values.gender == "F" || Formik.values.gender == "T" ?
                                        <>
                                            <option value="2">Smt.</option>
                                            <option value="3">Kumari</option>
                                        </> : null
                                }
                            </Select>
                        </FormControl>
                        <FormControl w={['full', 'sm']}>
                            <FormLabel>Select PAN Card Type</FormLabel>
                            <HStack gap={4}>
                                <Button
                                    colorScheme='telegram' size={['sm', 'md']}
                                    variant={Formik.values.mode == "P" ? "solid" : 'outline'}
                                    onClick={() => Formik.setFieldValue("mode", "P")}
                                >
                                    Physical
                                </Button>
                                <Button
                                    colorScheme='telegram' size={['sm', 'md']}
                                    variant={Formik.values.mode == "E" ? "solid" : 'outline'}
                                    onClick={() => Formik.setFieldValue("mode", "E")}
                                >
                                    Electronic
                                </Button>
                            </HStack>
                        </FormControl>
                    </Stack>
                    <Stack
                        gap={8} py={8} w={'full'}
                        direction={['column', 'row']}
                    >
                        <FormControl w={['full', 'sm']}>
                            <FormLabel>First Name</FormLabel>
                            <Input name='firstName' onChange={Formik.handleChange} />
                        </FormControl>
                        <FormControl w={['full', 'sm']}>
                            <FormLabel>Middle Name</FormLabel>
                            <Input name='middleName' onChange={Formik.handleChange} />
                        </FormControl>
                        <FormControl w={['full', 'sm']} isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input name='lastName' onChange={Formik.handleChange} />
                        </FormControl>
                    </Stack>

                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input name='email' onChange={Formik.handleChange} />
                    </FormControl>
                    <HStack justifyContent={'flex-end'}>
                        <Button colorScheme='orange' onClick={Formik.handleSubmit}>Submit</Button>
                    </HStack>
                </Box>
            </DashboardWrapper>

            <VStack
                bg={'blackAlpha.600'} w={'full'}
                position={'fixed'} top={0} bottom={0}
                zIndex={999} left={0} right={0}
                display={isOpen ? "flex" : "none"}
                justifyContent={'center'}
                onClick={onClose}
            >
                <form action={encUrl} method='POST' target='_blank'>
                    <input type="text" style={{ display: 'none' }} name='encdata' value={encData} />
                    <Box
                        p={4} w={['full', 'sm']}
                        rounded={8} bg={'#FFF'}
                    >
                        <Text pb={8} fontSize={'lg'} fontWeight={'semibold'}>
                            Please confirm these details
                        </Text>
                        {
                            Object.entries(Formik.values).map((item, key) => (
                                <HStack pb={2} justifyContent={'space-between'}>
                                    <Text
                                        fontWeight={'semibold'}
                                        textTransform={'capitalize'}
                                    >{item[0]}</Text>
                                    <Text
                                        textTransform={'uppercase'}
                                    >{item[1] == "1" ? "Shri" : item[1] == "2" ? "Smt." : item[1] == "3" ? "Kumari" : item[1]}
                                    </Text>
                                </HStack>
                            ))
                        }
                        <HStack justifyContent={'flex-end'} p={4}>
                            <Button colorScheme='whatsapp' type='submit'>Confirm</Button>
                        </HStack>
                    </Box>
                </form>
            </VStack>
        </>
    )
}

export default Pan