import React from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Input,
    Button,
    Text,
    FormControl,
    FormLabel,
    useToast,
    Select,
    HStack
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { useFormik } from 'formik'


const Cms = () => {
    const Toast = useToast({ position: 'top-right' })
    const Formik = useFormik({
        initialValues: {
            provider: "airtelcms",
            transactionId: ""
        },
        onSubmit: values => {
            BackendAxios.post(`/api/${values.provider}`, {...values}).then(res => {
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
                    w={['full', 'lg']}
                    p={4} rounded={8}
                    boxShadow={'lg'}
                    bg={'#FFF'}
                >
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Select Provider</FormLabel>
                        <Select placeholder='Select CMS Provider' name={'provider'} onChange={Formik.handleChange}>
                            <option value="airtelcms">Airtel CMS</option>
                            <option value="finocms">Fino CMS</option>
                        </Select>
                    </FormControl>
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Transaction ID</FormLabel>
                        <Input name='transactionId' onChange={Formik.handleChange} />
                    </FormControl>
                    <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Submit</Button>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default Cms