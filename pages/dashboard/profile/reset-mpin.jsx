import React from 'react'
import {
    HStack,
    Box,
    Stack,
    VStack,
    Text,
    FormControl,
    FormLabel,
    PinInput,
    PinInputField,
    Button,
    useToast
} from '@chakra-ui/react'
import { useFormik } from "formik";
import DashboardWrapper from '../../../hocs/DashboardLayout';
import BackendAxios from '../../../lib/axios';

const ResetMpin = () => {
    const Toast = useToast({
        position: 'top-right'
    })

    const MpinFormik = useFormik({
        initialValues: {
            old_mpin: "",
            new_mpin: "",
            new_mpin_confirmation: "",
        }
    })

    function handleMpinReset() {
        BackendAxios.post('/api/user/new-mpin', JSON.stringify({
            old_mpin: MpinFormik.values.old_mpin,
            new_mpin: MpinFormik.values.new_mpin,
            new_mpin_confirmation: MpinFormik.values.new_mpin_confirmation,
        })).then((res) => {
            Toast({
                status: 'success',
                title: 'Success',
                description: 'Your MPIN was changed succesfully.'
            })
        }).catch((err) => {
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper titleText={'Reset MPIN'}>
                <HStack w={'full'} minH={'100vh'} justifyContent={'center'}>
                    <Box
                        bg={'white'}
                        boxShadow={'md'}
                        p={6} w={['full', 'md']}
                        rounded={16}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Text fontSize={'lg'} mb={12}>Reset Your MPIN</Text>
                        <VStack spacing={8}>
                            <FormControl>
                                <FormLabel textAlign={'center'}>Enter Old MPIN</FormLabel>
                                <HStack spacing={6} justifyContent={'center'}>
                                    <PinInput otp onChange={(value) => MpinFormik.setFieldValue('old_mpin', value)}>
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                    </PinInput>
                                </HStack>
                            </FormControl>
                            <FormControl >
                                <FormLabel textAlign={'center'}>Enter New MPIN</FormLabel>
                                <HStack spacing={6} justifyContent={'center'}>
                                    <PinInput otp mask onChange={(value) => MpinFormik.setFieldValue('new_mpin', value)}>
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                    </PinInput>
                                </HStack>
                            </FormControl>
                            <FormControl >
                                <FormLabel textAlign={'center'}>Verify New MPIN</FormLabel>
                                <HStack spacing={6} justifyContent={'center'}>
                                    <PinInput otp onChange={(value) => MpinFormik.setFieldValue('new_mpin_confirmation', value)}>
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                    </PinInput>
                                </HStack>
                            </FormControl>
                            <Button colorScheme={'twitter'} onClick={handleMpinReset}>Done</Button>
                        </VStack>
                    </Box>
                </HStack>
            </DashboardWrapper>
        </>
    )
}

export default ResetMpin