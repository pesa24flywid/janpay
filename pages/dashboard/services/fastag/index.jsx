import React, { useEffect, useState, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Button,
    Text,
    HStack,
    FormControl,
    FormLabel,
    Input,
    PinInput,
    PinInputField,
    Select,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    useDisclosure
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios from '../../../../lib/axios'
import Cookies from 'js-cookie'
import { BsCheck2Circle, BsDownload, BsXCircle } from 'react-icons/bs'
import Pdf from 'react-to-pdf'

const Fastag = () => {
    const Toast = useToast({ position: 'top-right' })
    const pdfRef = useRef(null)

    const { isOpen, onClose, onOpen } = useDisclosure()
    const [mpin, setMpin] = useState("")

    const [operators, setOperators] = useState([])
    const [billFetched, setBillFetched] = useState(false)

    const [billInfo, setBillInfo] = useState({})
    const [customerName, setCustomerName] = useState("")
    const [billAmount, setBillAmount] = useState("0")

    const [receipt, setReceipt] = useState({
        status: false,
        data: {},
        show: false
    })

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
            if(!res.data.status){
                Toast({
                    status: 'warning',
                    title: 'warning',
                    description: res.data.message
                })
                return
            }
            setOperators(res.data.data)
        }).catch(err => {
            Toast({
                status: 'error',
                title: "Error while fetching operators",
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }, [])

    function payBill() {
        BackendAxios.post(`/api/paysprint/fastag/pay-bill`, {
            ...Formik.values,
            bill: billInfo,
            amount: billAmount,
            latlong: Cookies.get("latlong"),
            mpin: mpin
        }).then(res => {
            setBillFetched(false)
            onClose()
            setReceipt({
                status: res.data.metadata?.status || false,
                show: true,
                data: res.data.metadata || { message: "Transaction Failed Without Metadata" }
            })
            Toast({
                status: 'success',
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
                        <Select
                            name='operator'
                            onChange={Formik.handleChange}
                            placeholder='Select Here'
                        >
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
                                <Button colorScheme='whatsapp' onClick={onOpen}>Pay Bill</Button> :
                                <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Fetch Bill</Button>
                        }
                    </HStack>
                </Box>

            </DashboardWrapper>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={4}>
                        <Text textAlign={'center'}>Enter MPIN To Confirm Transaction</Text>
                        <HStack p={4} spacing={4} justifyContent={'center'}>
                            <PinInput otp onComplete={value => setMpin(value)}>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button colorScheme='twitter' onClick={payBill}>Confirm</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <Modal
                isOpen={receipt.show}
                onClose={() => setReceipt({ ...receipt, show: false })}
            >
                <ModalOverlay />
                <ModalContent width={'xs'}>
                    <Box ref={pdfRef} style={{ border: '1px solid #999' }}>
                        <ModalHeader p={0}>
                            <VStack w={'full'} p={8} bg={receipt.status ? "green.500" : "red.500"}>
                                {
                                    receipt.status ?
                                        <BsCheck2Circle color='#FFF' fontSize={72} /> :
                                        <BsXCircle color='#FFF' fontSize={72} />
                                }
                                <Text color={'#FFF'} textTransform={'capitalize'}>Transaction {receipt.status ? "success" : "failed"}</Text>
                            </VStack>
                        </ModalHeader>
                        <ModalBody p={0} bg={'azure'}>
                            <VStack w={'full'} p={4} bg={'#FFF'}>
                                {
                                    receipt.data ?
                                        Object.entries(receipt.data).map((item, key) => (
                                            <HStack
                                                justifyContent={'space-between'}
                                                gap={8} pb={4} w={'full'} key={key}
                                            >
                                                <Text fontSize={14}
                                                    fontWeight={'medium'}
                                                    textTransform={'capitalize'}
                                                >{item[0]}</Text>
                                                <Text fontSize={14} >{`${item[1]}`}</Text>
                                            </HStack>
                                        )) : null
                                }
                            </VStack>
                        </ModalBody>
                    </Box>
                    <ModalFooter>
                        <HStack justifyContent={'center'} gap={8}>

                            <Pdf targetRef={pdfRef} filename="Receipt.pdf">
                                {
                                    ({ toPdf }) => <Button
                                        rounded={'full'}
                                        size={'sm'}
                                        colorScheme={'twitter'}
                                        leftIcon={<BsDownload />}
                                        onClick={toPdf}
                                    >Download
                                    </Button>
                                }
                            </Pdf>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Fastag