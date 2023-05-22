import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Button,
    Text,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios from '../../../../lib/axios'
import Cookies from 'js-cookie'

const Fastag = () => {
    const Toast = useToast({ position: 'top-right' })
    const [operators, setOperators] = useState([])
    const [billFetched, setBillFetched] = useState(false)

    const [billInfo, setBillInfo] = useState({})
    const [customerName, setCustomerName] = useState("")
    const [billAmount, setBillAmount] = useState("0")

    const Formik = useFormik({
        initialValues: {
            operator: "",
            canumber: "",
        },
        onSubmit: (values) => {
            BackendAxios.post(`/api/paysprint/fastag/fetch-bill`, values).then(res => {
                setCustomerName(res.data.name)
                setBillAmount(res.data.amount)
                setBillInfo(res.data.bill_fetch)
                setBillFetched(true)
            }).catch(err => {
                setBillFetched(false)
                Toast({
                    status: 'error',
                    title: 'Error while paying bill',
                    description: err.response?.data?.message || err.response?.data || err.message
                })
            })
        }
    })

    // Fetching operators
    useEffect(() => {
        BackendAxios.get(`/api/paysprint/fastag/operators`).then(res => {
            setOperators(res.data.data)
        }).catch(err => {
            Toast({
                status: 'error',
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }, [])

    function payBill() {
        BackendAxios.post(`/api/paysprint/fastag/pay-bill`, {
            ...Formik.values,
            bill: billInfo,
            amount: billAmount,
            latlong: Cookies.get("latlong")
        }).then(res => {
            setBillFetched(false)
            Toast({
                status: 'success',
                title: 'Error while paying bill',
                description: res.data.message || 'Bill paid successfully!'
            })
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Error while paying bill',
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper pageTitle={'Fastag Services'}>

                <Box
                    w={['full', 'md']} p={6}
                    bg={'#FFF'} rounded={12}
                    boxShadow={'lg'}
                >
                    <FormControl mb={8}>
                        <FormLabel>Select Provider</FormLabel>
                        <Select name='operator' onChange={Formik.handleChange}>
                            {
                                operators.map((operator, key) => (
                                    <option value={operator.id}>{operator.name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel>Vehicle Registration Number</FormLabel>
                        <Input name='canumber' onChange={Formik.handleChange} />
                    </FormControl>
                    {
                        billFetched ?
                            <Box
                                p={4} bg={'blue.50'} mb={8}
                                rounded={8} border={'1px'}
                                borderColor={'blue.200'}
                            >
                                <HStack justifyContent={'space-between'} pb={4}>
                                    <Text fontWeight={'semibold'}>Name: </Text>
                                    <Text>{customerName}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'}>
                                    <Text fontWeight={'semibold'}>Amount: </Text>
                                    <Text>₹ {billAmount}</Text>
                                </HStack>
                            </Box> : null
                    }
                    <HStack justifyContent={'flex-end'}>
                        {
                            billFetched ?
                                <Button colorScheme='whatsapp' onClick={payBill}>Pay Bill</Button> :
                                <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Fetch Bill</Button>
                        }
                    </HStack>
                </Box>

            </DashboardWrapper>
        </>
    )
}

export default Fastag