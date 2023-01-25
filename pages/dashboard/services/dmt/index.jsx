import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Text,
    Stack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import axios from '../../../../lib/axios'

const Dmt = () => {
    const [isSenderRegistered, setIsSenderRegistered] = useState(false)
    const formik = useFormik({
        initialValues: {
            customerId: "",
            customerName: "",
            customerDob: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        }
    })

    function checkSender() {

        // Check if customer is registered or not

    }

    // Get State name
    useEffect(() => {
        if (parseInt(formik.values.pincode) > 100000 && parseInt(formik.values.pincode) < 999999) {
            fetch(`https://api.postalpincode.in/pincode/${formik.values.pincode}`).then((res) => {
                console.log(res)
                if (res.data[0].PostOffice[0].State) formik.setFieldValue("state", res.data[0].PostOffice[0].State)
                if (!res.data[0].PostOffice[0].State) formik.setFieldValue("state", "Wrong Pincode")
            }).catch((err)=>{
                console.log(err)
            })
        }
    }, [formik])

    return (
        <>
            <DashboardWrapper titleText={"Domestic Money Transfer"}>
                <Box
                    p={6} bg={'white'}
                    boxShadow={'md'}
                    rounded={12} mt={6}
                >
                    <FormControl id={'customerId'} w={['full', 'xs']}>
                        <FormLabel>Sender Mobile Number</FormLabel>
                        <HStack spacing={2}>
                            <Input type={'tel'}
                                name={'customerId'}
                                placeholder={'Enter Here'}
                                maxLength={10}
                                value={formik.values.customerId}
                                onChange={formik.handleChange}
                            />
                            <Button colorScheme={'twitter'}>Check</Button>
                        </HStack>
                    </FormControl>

                    {/* If the customer is not registered */}
                    <Text pt={16} pb={4}>The customer isn't registered yet. Please fill the form before initaing the transaction.</Text>
                    <Stack direction={['column', 'row']} py={4} spacing={4} justifyContent={'flex-start'}>
                        <FormControl id='customerName' w={['full', 'xs']}>
                            <FormLabel>Customer Name</FormLabel>
                            <Input name='customerName' placeholder='Enter Name' value={formik.values.customerName} onChange={formik.handleChange} />
                        </FormControl>
                        <FormControl id='customerDob' w={['full', 'xs']}>
                            <FormLabel>Date of Birth</FormLabel>
                            <Input type={'date'} name='customerDob' value={formik.values.customerDob} onChange={formik.handleChange} />
                        </FormControl>
                    </Stack>

                    <Text py={4}>Address Details of Customer</Text>
                    <FormControl id='street' w={['full']}>
                        <FormLabel>Street Address</FormLabel>
                        <Input name='street' placeholder='Enter Name' value={formik.values.street} onChange={formik.handleChange} />
                    </FormControl>
                    <Stack direction={['column', 'row']} py={4} spacing={4} justifyContent={'flex-start'}>
                        <FormControl id='city' w={['full']}>
                            <FormLabel>City</FormLabel>
                            <Input name='city' value={formik.values.city} onChange={formik.handleChange} />
                        </FormControl>
                        <FormControl id='pincode' w={['full']}>
                            <FormLabel>Pincode</FormLabel>
                            <Input type={'tel'} maxLength={6} name='pincode' value={formik.values.pincode} onChange={formik.handleChange} />
                        </FormControl>
                        <FormControl id='state' w={['full']}>
                            <FormLabel>State</FormLabel>
                            <Input disabled name='state' value={formik.values.state} />
                        </FormControl>
                    </Stack>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default Dmt