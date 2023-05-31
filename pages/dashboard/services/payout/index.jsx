import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Text,
    Stack,
    HStack,
    VStack,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    PinInput,
    PinInputField,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useToast
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import Pdf from 'react-to-pdf'
import { BsCheck2Circle, BsDownload, BsXCircle } from 'react-icons/bs'


const Payout = () => {

    const [serviceId, setServiceId] = useState("25")
    const { isOpen, onClose, onOpen } = useDisclosure()
    const Toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        ClientAxios.get(`/api/organisation`).then(res => {
            if (!res.data.payout_status) {
                window.location.href('/dashboard/not-available')
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const Formik = useFormik({
        initialValues: {
            beneficiaryName: "",
            account: "",
            ifsc: "",
            amount: "",
            mpin: "",
        }
    })

    const pdfRef = React.createRef()
    const [receipt, setReceipt] = useState({
        show: false,
        status: "success",
        data: {}
    })
    function makePayout() {
        setIsLoading(true)
        BackendAxios.post(`/api/razorpay/payout/new-payout/${serviceId}`, JSON.stringify({
            beneficiaryName: Formik.values.beneficiaryName,
            account: Formik.values.account,
            ifsc: Formik.values.ifsc,
            mpin: Formik.values.mpin,
            amount: Formik.values.amount,
        })
        ).then((res) => {
            setIsLoading(false)
            setReceipt({
                status: res.data.metadata.status,
                show: true,
                data: res.data.metadata
            })
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Transaction Failed',
                description: err.response.data.message || err.response.data || err.message,
                position: 'top-right'
            })
            setIsLoading(false)
        })
    }

    const [rowdata, setRowdata] = useState([])
    useEffect(() => {
        ClientAxios.post('/api/user/fetch', {
            user_id: localStorage.getItem('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data[0].allowed_pages.includes('payoutTransaction') == false) {
                window.location.assign('/dashboard/not-allowed')
            }
        }).catch((err) => {
            console.log(err)
        })

        BackendAxios.get(`/api/razorpay/fetch-payout/${serviceId}`).then((res) => {
            setRowdata(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function showReceipt(data) {
        if (!data) {
            Toast({
                description: "No receipt for this transaction"
            })
            return
        }
        setReceipt({
            status: data.status,
            show: true,
            data: data
        })
    }

    return (
        <>
            <DashboardWrapper titleText={"Payout"}>
                <Stack direction={['column', 'row']} pt={6} spacing={8} alignItems={'flex-start'}>

                    <Box
                        p={6} bg={'white'}
                        boxShadow={'md'}
                        rounded={12}
                        w={'full'}
                    >
                        <Stack
                            direction={['column']}
                            p={4} spacing={6}
                        >
                            <FormControl>
                                <FormLabel>Enter Recipient Name</FormLabel>
                                <Input
                                    name={'beneficiaryName'} onChange={Formik.handleChange}
                                    placeholder={'Enter Beneficiary Name'}
                                    value={Formik.values.beneficiaryName}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Enter Account Number</FormLabel>
                                <Input
                                    name={'account'} onChange={Formik.handleChange}
                                    placeholder={'Enter Account Number'}
                                    value={Formik.values.account}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Enter IFSC Code</FormLabel>
                                <Input
                                    name={'ifsc'} onChange={Formik.handleChange}
                                    placeholder={'Enter IFSC Code'}
                                    value={Formik.values.ifsc}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Enter Amount</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon children={'₹'} />
                                    <Input
                                        name={'amount'} onChange={Formik.handleChange}
                                        placeholder={'Enter Amount'}
                                        value={Formik.values.amount}
                                    />
                                </InputGroup>
                            </FormControl>
                            <Button colorScheme={'twitter'} onClick={onOpen}>Done</Button>
                        </Stack>

                    </Box>

                    <Box
                        p={4} bg={'white'}
                        boxShadow={'md'}
                        rounded={12}
                        w={['full', 'lg']}
                        h={'auto'}
                    >
                        <Text>Recent Payouts</Text>
                        <TableContainer h={'full'}>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Receipt</Th>
                                        <Th>Beneficiary Name</Th>
                                        <Th>Account Number</Th>
                                        <Th>Amount</Th>
                                        <Th>Datetime</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody textTransform={'uppercase'}>
                                    {
                                        rowdata.slice(0, 10).map((item, key) => {
                                            return (
                                                <Tr key={key}>
                                                    <Td>{key + 1}</Td>
                                                    <Td>
                                                        <Button
                                                            size={'xs'}
                                                            colorScheme='twitter'
                                                            rounded={'full'}
                                                            onClick={() => showReceipt(item.metadata)}
                                                        >Receipt</Button>
                                                    </Td>
                                                    <Td>{item.beneficiary_name || "No name"}</Td>
                                                    <Td>{item.account_number || "0"}</Td>
                                                    <Td>{item.amount || "0"}</Td>
                                                    <Td>{item.created_at || "Non-Format"}</Td>
                                                    <Td>
                                                        {
                                                            item.status == 'processing' ?
                                                                <Text color={'green'}>Success</Text> :
                                                                <Text textTransform={'capitalize'}>{item.status}</Text>
                                                        }
                                                    </Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>

                </Stack>
            </DashboardWrapper>



            {/* Confirm Payment Popup */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Please Confirm</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        as={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'flex-start'}
                        textAlign={'center'}
                    >
                        Are you sure you want to send ₹ <b>{Formik.values.amount}</b> to <b>{Formik.values.beneficiaryName}</b>
                        <br /><br />
                        Enter your MPIN to confirm.
                        <br />
                        <HStack w={'full'} alignItems={'center'} justifyContent={'center'} pt={2} pb={6}>
                            <PinInput otp onComplete={(value) => Formik.setFieldValue('mpin', value)}>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme='blue'
                            mr={3} isLoading={isLoading}
                            onClick={() => makePayout()}>
                            Confirm and Pay
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
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
                                                <Text
                                                    fontSize={14}
                                                    fontWeight={'medium'}
                                                    textTransform={'capitalize'}
                                                >{item[0]}</Text>
                                                <Text fontSize={14} maxW={'full'} >{`${item[1]}`}</Text>
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

export default Payout