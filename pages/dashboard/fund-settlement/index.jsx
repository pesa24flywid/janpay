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
    const [userName, setUserName] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(true)
    const [userBanks, setUserBanks] = useState([])
    const [isPinModalVisible, setIsPinModalVisible] = useState(false)
    const Toast = useToast({
        position: 'top-right'
    })
    const Formik = useFormik({
        initialValues: {
            amount: "",
            transactionType: "",
            bank: "",
            mpin: ""
        },
        onSubmit: values => {
            BackendAxios.post(`/api/paysprint/payout/new-payout`, values).then(res => {
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
                    description: 'Bank Added!'
                })
            }).catch(err => {
                // console.log(err.message)
                Toast({
                    status: 'error',
                    title: 'Error Occured',
                    description: 'Error while adding your bank account'
                })
            })
            setIsModalVisible(false)
        }
    })

    useEffect(() => {
        setUserName(localStorage.getItem('userName'))
        BackendAxios.get('api/user/bank').then(res => {
            if (res.data) {
                setIsModalVisible(false)
                setUserBanks(res.data)
            }
            else {
                setIsModalVisible(true)
                setUserBanks([])
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <>
            <DashboardWrapper titleText={'Settle Funds'}>
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
                            <Select name={'bank'} onChange={Formik.handleChange}>
                                {
                                    userBanks.map((bank, key) => {
                                        return (
                                            <option value={bank.paysprint_bank_code} key={key}>State Bank of India - {bank.account_number}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl mt={8}>
                            <FormLabel>Transaction Type</FormLabel>
                            <Select name={'transactionType'} onChange={Formik.handleChange}>
                                <option value="imps">IMPS (2-4 hours)</option>
                                <option value="neft">NEFT (instant)</option>
                            </Select>
                        </FormControl>
                        <Button colorScheme={'twitter'} mt={8} w={'full'} onClick={() => setIsPinModalVisible(true)}>
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
                                        <Th>Type</Th>
                                        <Th>Account</Th>
                                        <Th>Status</Th>
                                        <Th>Timestamp</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>1</Td>
                                        <Td>1000</Td>
                                        <Td>IMPS</Td>
                                        <Td>39488734970</Td>
                                        <Td>Success</Td>
                                        <Td>28-01-2023 16:39</Td>
                                    </Tr>
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
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text>Confirm Transaction</Text>
                    </ModalHeader>
                    <ModalBody>
                        <Text>Are you sure you want to settle ₹{Formik.amount}</Text>
                        <FormControl mb={8}>
                            <FormLabel>Enter your MPIN to confirm</FormLabel>
                            <HStack spacing={4}>
                                <PinInput onComplete={values => Formik.setFieldValue("mpin", values)}>
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                </PinInput>
                            </HStack>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button onClick={Formik.handleSubmit} colorScheme='twitter'>Confirm & Settle</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>



            {/* Add Bank Modal */}
            <Modal
                isOpen={isModalVisible}
                isCentered
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
                                <option value={'3498'}>State Bank of India</option>
                            </Select>
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Bank IFSC</FormLabel>
                            <Input name={'ifsc'} onChange={BankFormik.handleChange} />
                        </FormControl>
                        <FormControl mb={8}>
                            <FormLabel>Bank IFSC</FormLabel>
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