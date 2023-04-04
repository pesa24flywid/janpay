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
import { Document, Page, Text as PText, StyleSheet, View, Image, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    img: {
        width: '120px',
        margin: '0 auto',
    },
    text: {
        margin: '8px 0'
    }
})

const PaymentReceipt = ({ amount, payout_id, name, account }) => {
    return (
        <Document>
            <Page size={'A6'} style={styles.page}>
                <View>
                    <Image style={styles.img}
                        src={'https://thumbs.dreamstime.com/b/success-grunge-vintage-stamp-isolated-white-background-success-sign-success-stamp-122353526.jpg'} />

                    <PText style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;</PText>
                    <PText style={styles.text}>Amount: &nbsp;&nbsp;&nbsp;&nbsp; Rs. {amount}</PText>
                    <PText style={styles.text}>Payout ID: &nbsp;&nbsp; {payout_id}</PText>
                    <PText style={styles.text}>Beneficiary:  {name}</PText>
                    <PText style={styles.text}>Account: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {account}</PText>
                </View>
            </Page>
        </Document>
    )
}

const Payout = () => {

    const [serviceId, setServiceId] = useState("25")
    const { isOpen, onClose, onOpen } = useDisclosure()
    const Toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const [paymentModal, setPaymentModal] = useState(false)
    const [payout_id, setPayout_id] = useState("")


    const Formik = useFormik({
        initialValues: {
            beneficiaryName: "",
            account: "",
            ifsc: "",
            amount: "",
            mpin: "",
        }
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
            setPayout_id(res.data.payout_id)
            setPaymentModal(true)
            setIsLoading(false)
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Transaction Failed',
                description: err.message,
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
                                                    <Td>{item.beneficiary_name || "No name"}</Td>
                                                    <Td>{item.account_number || "0"}</Td>
                                                    <Td>{item.amount || "0"}</Td>
                                                    <Td>{item.created_at || "Non-Format"}</Td>
                                                    <Td>{
                                                        item.status == 'processing' ?
                                                            <Text color={'green'}>Success</Text> :
                                                            <Text textTransform={'capitalize'}>{item.status}</Text>
                                                    }</Td>
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
                isOpen={paymentModal}
                onClose={() => setPaymentModal(false)}
            >
                <ModalOverlay />
                <ModalContent h={'xl'} w={'auto'}>
                    <ModalBody>
                        <PDFViewer height={'100%'}>
                            <PaymentReceipt
                                amount={Formik.values.amount}
                                payout_id={payout_id}
                                name={Formik.values.beneficiaryName}
                                account={Formik.values.account}
                            />
                        </PDFViewer>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Payout