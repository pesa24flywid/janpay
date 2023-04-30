import React from 'react'
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
    HStack
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { useFormik } from 'formik'
import { IoIosMan, IoIosTransgender, IoIosWoman } from 'react-icons/io'


const Cms = () => {
    const Toast = useToast({ position: 'top-right' })
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
            BackendAxios.post(`/api/`, {...values}).then(res => {
                window.open(`${res.data.callback_url}`, "_blank")
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
            <DashboardWrapper pageTitle={'CMS'}>
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
                    {Formik.values.mode == "E" ?
                        <FormControl w={['full', 'sm']} pb={8} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name='email' onChange={Formik.handleChange} />
                        </FormControl> : null
                    }
                    <HStack justifyContent={'flex-end'}>
                        <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Submit</Button>
                    </HStack>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default Cms