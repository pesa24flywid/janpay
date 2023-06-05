import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    HStack,
    VStack,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    InputGroup,
    InputLeftAddon,
    PinInputField,
    PinInput,
    Stack,
    Box,
    TableContainer,
    Table, Thead,
    Th, Tr, Td,
    Tbody,
    useToast
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import BackendAxios, { FormAxios } from '../../../lib/axios'

const Index = () => {
    const [settlementProvider, setSettlementProvider] = useState("paysprint")
    const [banksList, setBanksList] = useState([])
    const [userName, setUserName] = useState("")
    const [adminRemarks, setAdminRemarks] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(true)
    const [userBanks, setUserBanks] = useState([])
    const [isPinModalVisible, setIsPinModalVisible] = useState(false)
    const Toast = useToast({
        position: 'top-right'
    })

    const [settlements, setSettlements] = useState([])

    const Formik = useFormik({
        initialValues: {
            amount: "",
            // transactionType: "",
            bank: "",
            mpin: "",
            message: ""
        },
        onSubmit: values => {
            BackendAxios.post(`/api/fund/settlement-request`, values).then(res => {
                Toast({
                    description: 'Transaction Successful!'
                })
                setIsPinModalVisible(false)
            }).catch(err => {
                console.log(err)
                Toast({
                    status: 'error',
                    title: 'Error Occured',
                    description: 'Transaction Failed'
                })
                setIsPinModalVisible(false)
            })
        }
    })

    const BankFormik = useFormik({
        initialValues: {
            amount: "",
            accountNumber: "",
            bankName: "",
            paysprintBankCode: "",
            ifsc: "",
            passbook: null,
        },
        onSubmit: (values) => {
            FormAxios.postForm('api/user/add-bank', values).then(res => {
                // console.log(res.data)
                Toast({
                    description: res.data.message || "Bank details sent for review!"
                })
                setIsModalVisible(false)
            }).catch(err => {
                // console.log(err.message)
                Toast({
                    status: 'error',
                    title: 'Error while adding bank.',
                    description: err.response?.data?.message || err.response?.data || err.message
                })
                setIsModalVisible(false)
            })
        }
    })

    function fetchSettlements() {
        BackendAxios.get(`/api/fund/settlement-request`).then(res => {
            setSettlements(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        setUserName(localStorage.getItem('userName'))
        fetchSettlements()
        BackendAxios.get('api/user/bank').then(res => {
            if (res.data[0].account_number) {
                setIsModalVisible(false)
                setUserBanks(res.data)
                setAdminRemarks(res.data[0].bank_account_remarks)
            }
            else {
                setIsModalVisible(true)
                setUserBanks([])
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if (settlementProvider == "paysprint") {
            BackendAxios.get(`/api/${settlementProvider}/aeps/fetch-bank/20`).then(res => {
                setBanksList(res.data?.banklist.data)
            }).catch(err => {
                Toast({
                    status: 'error',
                    description: err.response?.data.message || err.response?.data || err.message
                })
            })
        }
    }, [])

    return (
        <>
            <DashboardWrapper titleText={'Settle Funds'}>
                {
                    adminRemarks &&
                    <Box py={8}>
                        <Box p={2} bg={'white'}>
                            <Text fontWeight={'semibold'}>Admin Remarks</Text>
                            <Text>{adminRemarks}</Text>
                        </Box>
                    </Box>
                }
                <Stack
                    direction={['column', 'row']}
                    gap={16} w={'full'}
                >
                    <Box
                        w={['full', 'sm']}
                        p={4} bg={'white'}
                        rounded={12}
                        boxShadow={'lg'}
                    >
                        <Text mb={8}>Settle amount from your wallet</Text>
                        <InputGroup>
                            <InputLeftAddon children={'₹'} />
                            <Input
                                type={'number'}
                                name={'amount'}
                                onChange={Formik.handleChange}
                                value={Formik.values.amount}
                                placeholder={'Enter Amount'}
                            />
                        </InputGroup>
                        <FormControl mt={8}>
                            <FormLabel>Select Bank Account</FormLabel>
                            <Select name={'bank'} onChange={Formik.handleChange} placeholder='Select Here'>
                                {
                                    userBanks.map((bank, key) => {
                                        return (
                                            <option
                                                value={bank.paysprint_bank_code} key={key}
                                                disabled={bank.is_verified === 0}
                                            >{bank.account_number} {bank.is_verified === 0 && "(Verification Pending)"}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        {/* <FormControl mt={8}>
                            <FormLabel>Transaction Type</FormLabel>
                            <Select name={'transactionType'} onChange={Formik.handleChange}>
                                <option value="imps">IMPS (2-4 hours)</option>
                                <option value="neft">NEFT (instant)</option>
                            </Select>
                        </FormControl> */}
                        <FormControl mt={8}>
                            <FormLabel>Remarks (optional)</FormLabel>
                            <Input name='message' onChange={Formik.handleChange} />
                        </FormControl>
                        <Button
                            colorScheme={'twitter'} mt={8} w={'full'}
                            onClick={() => setIsPinModalVisible(true)}
                        >
                            Done
                        </Button>
                    </Box>

                    <Box
                        w={['full', 'lg', '2xl']}
                        p={4} bg={'white'}
                        rounded={12}
                        boxShadow={'lg'}
                    >
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Amount</Th>
                                        <Th>Status</Th>
                                        <Th>Created At</Th>
                                        <Th>Updated At</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        settlements.map((settlement, key) => (
                                            <Tr key={key}>
                                                <Td>{key + 1}</Td>
                                                <Td>{settlement.amount}</Td>
                                                <Td>{settlement.status}</Td>
                                                <Td>{settlement.created_at}</Td>
                                                <Td>{settlement.updated_at}</Td>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            </DashboardWrapper>


            {/* MPIN Modal */}
            <Modal
                isOpen={isPinModalVisible}
                isCentered
                onClose={() => setIsPinModalVisible(false)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text textAlign={'center'}>Confirm Transaction</Text>
                    </ModalHeader>
                    <ModalBody>
                        <VStack>
                            <Text>Are you sure you want to settle ₹{Formik.amount}</Text>
                            <FormControl mb={8}>
                                <FormLabel textAlign={'center'}>Enter your MPIN to confirm</FormLabel>
                                <HStack spacing={4} w={'full'} alignItems={'center'} justifyContent={'center'}>
                                    <PinInput onComplete={values => Formik.setFieldValue("mpin", values)}>
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                        <PinInputField bg={'aqua'} />
                                    </PinInput>
                                </HStack>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button onClick={Formik.handleSubmit} colorScheme='twitter'>Confirm</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>



            {/* Add Bank Modal */}
            <Modal
                isOpen={isModalVisible}
                isCentered
                onClose={() => setIsModalVisible(false)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text>Add Your Bank Account</Text>
                    </ModalHeader>
                    <ModalBody>
                        <FormControl mb={8}>
                            <FormLabel>Account Holder</FormLabel>
                            <Input name={'beneficiaryName'} disabled value={userName} />
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Account Number</FormLabel>
                            <Input name={'accountNumber'} onChange={BankFormik.handleChange} />
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Bank Name</FormLabel>
                            <Select
                                name={'paysprintBankCode'}
                                onChange={BankFormik.handleChange}
                                placeholder='Select Bank'
                            >
                                {
                                    banksList.map((bank, key) => (
                                        settlementProvider == "paysprint" &&
                                        <option key={key} value={bank.id}>{bank.bankName}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Bank IFSC</FormLabel>
                            <Input name={'ifsc'} onChange={BankFormik.handleChange} />
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Passbook First Page</FormLabel>
                            <Input type='file' name={'passbook'} onChange={e => BankFormik.setFieldValue("passbook", e.currentTarget.files[0])} accept='.jpg, .jpeg, .png, .pdf' />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button onClick={BankFormik.handleSubmit} colorScheme='twitter'>Save</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Index