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
    Select,
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
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerFooter,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import axios, { ClientAxios } from '../../../../lib/axios'
import { states } from '../../../../lib/states'
import { useToast } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import { BsTrash } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import PermissionMiddleware from '../../../../lib/utils/checkPermission'

const Dmt = () => {

    useEffect(() => {

        ClientAxios.post('/api/user/fetch', {
            user_id: localStorage.getItem('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data[0].allowed_pages.includes('dmt') == false) {
                window.location.assign('/dashboard/not-allowed')
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const [customerStatus, setCustomerStatus] = useState("hidden") // Available options - hidden, registered, unregistered

    const [customerName, setCustomerName] = useState("")
    const [customerTotalLimit, setCustomerTotalLimit] = useState(50000)
    const [customerUsedLimit, setCustomerUsedLimit] = useState(20000)
    const [customerRemainingLimit, setCustomerRemainingLimit] = useState(30000)

    const [recipients, setRecipients] = useState([])

    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [isBtnHidden, setIsBtnHidden] = useState(true)
    const [customerId, setCustomerId] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState("")

    const [newRecipientModal, setNewRecipientModal] = useState(false)

    const { isOpen, onClose, onOpen } = useDisclosure()
    const Toast = useToast()


    const registrationFormik = useFormik({
        initialValues: {
            customerId: "",
            customerName: "",
            customerDob: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        },
        onSubmit: (values) => {
            setIsBtnLoading(true)
            axios.post("api/eko/dmt/create-customer", {
                values
            }).then((res) => {
                if (res.status == 200) {
                    setIsOtpSent(true)
                }
                setIsBtnLoading(false)
            }).catch((err) => {
                console.log(err)
                if (err.response.status == 409) {
                    Toast({
                        status: "warning",
                        title: "Already Registered",
                        description: "This phone number is already registered.",
                        position: "top-right",
                    })
                }
                else {
                    Toast({
                        status: "error",
                        title: "Error Occured",
                        description: err.message,
                        position: "top-right"
                    })
                }
                setIsBtnLoading(false)
            })
        }
    })

    useEffect(() => {
        registrationFormik.setFieldValue("customerId", customerId)
    }, [customerId])

    const Recipients = [
        {
            accountNumber: "39486516779846",
            beneficiaryName: "Sangam Kumar",
            bankName: "State Bank of India",
            bankIfsc: "SBIN0032284"
        }
    ]

    const paymentFormik = useFormik({
        initialValues: {
            customerId: registrationFormik.values.customerId,
            amount: "",
            selectedBank: "",
            beneficiaryAccount: "",
            beneficiaryName: "",
        }
    })


    const addRecipientFormik = useFormik({
        initialValues: {
            bankCode: "",
            accountNumber: "",
            beneficiaryName: "",
            ifsc: "",
            phone: "",
        },
        onSubmit: (values) => {
            // Adding New Recipient
            axios.post("api/eko/dmt/add-recipient", {
                values,
                customerId,
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
                console.log(err)
            })
        }
    })

    // Check if customer is registered or not
    function checkSender(event) {
        event.preventDefault()
        setCustomerStatus("hide")
        setIsBtnLoading(true)
        if (!customerId || parseInt(customerId) <= 6000000000) {
            Toast({
                description: "Enter Correct Customer ID",
                position: "top-right"
            })
            setIsBtnLoading(false)
        }
        else {
            axios.post("api/eko/dmt/customer-info", {
                customerId
            }).then((res) => {
                if (res.data.response.status == 463 && res.data.response.response_status_id == 1) {
                    registrationFormik.setFieldValue("customerId", customerId)
                    setCustomerStatus("unregistered")
                }
                if (res.data.response.status == 0 && res.data.response.response_status_id == 0) {
                    setCustomerRemainingLimit(res.data.response.data.available_limit)
                    setCustomerUsedLimit(res.data.response.data.used_limit)
                    setCustomerTotalLimit(res.data.response.data.total_limit)
                    setCustomerName(res.data.response.data.name)
                    setCustomerStatus("registered")
                }
                if (res.data.status == 0 && res.data.response_status_id == -1) {
                    sendOtp()
                }
                setIsBtnLoading(false)
            }).catch((err) => {
                console.log(err)
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
            })
            setIsBtnLoading(false)
        }
    }


    function handleRecipientSelection(acc_number) {
        const Recipient = Recipients.find((beneficiary) => {
            if (beneficiary.accountNumber == acc_number) {
                return beneficiary
            }
        })
        paymentFormik.setFieldValue("selectedBank", Recipient.accountNumber)
        paymentFormik.setFieldValue("beneficiaryName", Recipient.beneficiaryName)
        paymentFormik.setFieldValue("beneficiaryAccount", Recipient.beneficiaryAccount)
        setIsBtnHidden(false)

    }

    // Send OTP for account verification
    function sendOtp() {
        axios.post("api/eko/dmt/resend-otp", {
            customerId
        }).then((res) => {
            if (res.status == 200) {
                setIsOtpSent(true)
                Toast({
                    status: "info",
                    title: "OTP Sent",
                    description: `An OTP has been sent to ${customerId}`,
                    position: "top-right"
                })
            }
        }).catch((err) => {
            console.log(err)
            Toast({
                status: "error",
                title: "Error Occured",
                description: err.message,
                position: "top-right"
            })
        })
    }

    function verifyOtp() {
        axios.post("api/eko/dmt/verify-customer", {
            customerId: registrationFormik.values.customerId,
            otp
        }).then((res) => {
            if (res.data.response_status_id == 0 && res.data.status == 0) {
                Toast({
                    status: 'success',
                    title: "Customer Added!",
                    description: "Please wait, the page will refresh automatically",
                    position: "top-right"
                })
                setTimeout(() => {
                    window.location.reload(false)
                }, 2000);
            }
            else {
                Toast({
                    status: 'info',
                    title: "Oops!",
                    description: res.message,
                    position: "top-right"
                })
            }
        }).catch((err) => {
            console.log(err)
            Toast({
                status: 'error',
                title: "Error Occured",
                description: err.message,
                position: "top-right"
            })
        })
    }

    function activateDmt() {

    }



    return (
        <>
            <DashboardWrapper titleText={"Domestic Money Transfer"}>
                <Box
                    p={6} bg={'white'}
                    boxShadow={'md'}
                    rounded={12} mt={6}
                >
                    {/* <Button onClick={()=>activateDmt()}>Activate DMT</Button> */}
                    <FormLabel>Sender Mobile Number</FormLabel>
                    <HStack spacing={2}>
                        <Input
                            w={['full', 'xs']} type={'tel'}
                            name={'customerId'}
                            placeholder={'Enter Here'}
                            minLength={10} maxLength={10} isRequired
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />
                        <Button type={'submit'} colorScheme={'twitter'} isLoading={isBtnLoading} onClick={(event) => checkSender(event)}>Check</Button>
                    </HStack>


                    {/* If the customer is not registered */}
                    {
                        customerStatus == "unregistered" ? <>
                            <Text pt={16} pb={4}>The customer isn't registered yet. Please fill the form before initaing the transaction.</Text>
                            <Stack direction={['column', 'row']} py={4} spacing={4} justifyContent={'flex-start'}>
                                <FormControl id='customerName' w={['full', 'xs']} isRequired>
                                    <FormLabel>Customer Name</FormLabel>
                                    <Input name='customerName' placeholder='Enter Name' value={registrationFormik.values.customerName} onChange={registrationFormik.handleChange} />
                                </FormControl>
                                <FormControl id='customerId' w={['full', 'xs']} isRequired>
                                    <FormLabel>Customer Phone</FormLabel>
                                    <Input name='customerId' placeholder='Enter Phone' maxLength={10} value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
                                </FormControl>
                                <FormControl id='customerDob' w={['full', 'xs']} isRequired>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Input type={'date'} name='customerDob' value={registrationFormik.values.customerDob} onChange={registrationFormik.handleChange} />
                                </FormControl>
                            </Stack>

                            <Text py={4}>Address Details of Customer</Text>
                            <FormControl id='street' w={['full']} isRequired>
                                <FormLabel>Street Address</FormLabel>
                                <Input name='street' placeholder='Enter Name' value={registrationFormik.values.street} onChange={registrationFormik.handleChange} />
                            </FormControl>
                            <Stack direction={['column', 'row']} py={4} spacing={4} justifyContent={'flex-start'}>
                                <FormControl id='city' w={['full']} isRequired>
                                    <FormLabel>City</FormLabel>
                                    <Input name='city' value={registrationFormik.values.city} onChange={registrationFormik.handleChange} />
                                </FormControl>
                                <FormControl id='pincode' w={['full']} isRequired>
                                    <FormLabel>Pincode</FormLabel>
                                    <Input type={'tel'} maxLength={6} name='pincode' value={registrationFormik.values.pincode} onChange={registrationFormik.handleChange} />
                                </FormControl>
                                <FormControl id='state' w={['full']} isRequired>
                                    <FormLabel>State</FormLabel>
                                    <Select name="state" placeholder="Select State" value={registrationFormik.values.state} onChange={registrationFormik.handleChange}>
                                        {states.map((state, key) => {
                                            return (
                                                <option value={state} key={key}>{state}</option>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Button colorScheme={'twitter'} isLoading={isBtnLoading} onClick={registrationFormik.handleSubmit}>Submit</Button>
                        </> : null
                    }

                    {/* If the customer is registered */}
                    {
                        customerStatus == "registered" ? <>
                            <Text pt={16} pb={4}>Following details were formed. You can initate the transaction now.</Text>
                            <Stack direction={['column', 'row']} alignItems={'flex-start'} justifyContent={'space-between'}>
                                <VStack w={['full', 'lg']} alignItems={'flex-start'}>
                                    <Box w={'inherit'} p={4} rounded={12} my={4} bg={'blue.100'}>
                                        <Stack direction={['column', 'row']} spacing={4} py={2}>
                                            <Text fontWeight={'semibold'}>Full Name: </Text>
                                            <Text>{customerName}</Text>
                                        </Stack>
                                        <Stack direction={['column', 'row']} spacing={4} py={2}>
                                            <Text fontWeight={'semibold'}>Total Limit: </Text>
                                            <Text>₹ {customerTotalLimit.toLocaleString("en-IN")}</Text>
                                        </Stack>
                                        <Stack direction={['column', 'row']} spacing={4} py={2}>
                                            <Text fontWeight={'semibold'}>Remaining Limit: </Text>
                                            <Text>₹ {customerRemainingLimit.toLocaleString("en-IN")}</Text>
                                        </Stack>
                                        <Stack direction={['column', 'row']} spacing={4} py={2}>
                                            <Text fontWeight={'semibold'}>Used Limit: </Text>
                                            <Text>₹ {customerUsedLimit.toLocaleString("en-IN")}</Text>
                                        </Stack>
                                    </Box>
                                    {
                                        paymentFormik.values.selectedBank ?
                                            <Box w={'inherit'} rounded={12}>
                                                <FormControl w={'full'} my={4}>
                                                    <FormLabel>Account Number</FormLabel>
                                                    <Input
                                                        type={'number'}
                                                        name={'beneficiaryAccount'}
                                                        max={5000}
                                                        value={paymentFormik.values.beneficiaryAccount}
                                                        readOnly bg={'aqua'}
                                                    />
                                                </FormControl>
                                                <FormControl w={'full'} my={4}>
                                                    <FormLabel>Beneficiary Name</FormLabel>
                                                    <Input
                                                        name={'beneficiaryName'}
                                                        value={paymentFormik.values.beneficiaryName}
                                                        readOnly bg={'aqua'}
                                                    />
                                                </FormControl>
                                                <FormControl w={'full'} my={4}>
                                                    <FormLabel>Enter Amount</FormLabel>
                                                    <InputGroup w={'full'}>
                                                        <InputLeftAddon children={'₹'} />
                                                        <Input type={'number'} name={'amount'} max={5000} value={paymentFormik.values.amount} onChange={paymentFormik.handleChange} />
                                                    </InputGroup>
                                                </FormControl>
                                            </Box> : null
                                    }
                                </VStack>
                                <Box w={['full', 'md']}>
                                    <HStack w={'full'} justifyContent={'flex-end'}>
                                        <Button leftIcon={<AiOutlinePlus />} onClick={() => setNewRecipientModal(true)}>Add New Account</Button>
                                    </HStack>
                                    <VStack
                                        my={4}
                                        p={2}
                                        border={'1px'}
                                        borderColor={'#888'}
                                        rounded={12}
                                        h={'sm'} overflowY={'scroll'}
                                        spacing={4}
                                    >
                                        {
                                            recipients ? (
                                                recipients.map((item, key) => {
                                                    return (
                                                        <Box
                                                            w={'full'} rounded={'inherit'}
                                                            h={'auto'} boxShadow={'md'}
                                                            overflow={'hidden'} pos={'relative'}
                                                        >
                                                            <Text
                                                                w={'full'} px={4} py={1}
                                                                textTransform={'uppercase'}
                                                                fontWeight={'semibold'}
                                                                fontSize={'xs'} bg={'blanchedalmond'}
                                                            >
                                                                state bank of india
                                                            </Text>
                                                            <Box w={'full'} p={4} fontSize={'xs'}>
                                                                <Text mb={2}>
                                                                    <span style={{ paddingRight: ".5rem" }}><b>Beneficiary: </b></span>
                                                                    Sangam Kumar
                                                                </Text>
                                                                <Text mb={2} fontSize={'sm'}>
                                                                    <span style={{ paddingRight: ".5rem" }}><b>Account No: </b></span>
                                                                    39486516779846
                                                                </Text>
                                                                <Text mb={2}>
                                                                    <span style={{ paddingRight: "1.20rem" }}><b>Bank IFSC: </b></span>
                                                                    SBIN0032284
                                                                </Text>
                                                            </Box>
                                                            <Stack direction={['row-reverse', 'column']} spacing={[0, 4]} pos={['relative', 'absolute']} top={[0, '2.25rem']} right={[0, '1rem']}>
                                                                <Button
                                                                    leftIcon={<FiSend />}
                                                                    w={['full', 'fit-content']}
                                                                    fontSize={['unset', 'xs']}
                                                                    rounded={['0', 'full']}
                                                                    colorScheme={'twitter'}
                                                                    value={"39486516779846"}
                                                                    onClick={(e) => handleRecipientSelection(e.target.value)}
                                                                >Transfer</Button>
                                                                <Button
                                                                    boxSize={['unset', 8]}
                                                                    w={['full', 'unset']}
                                                                    leftIcon={[<BsTrash />]}
                                                                    display={['flex']}
                                                                    fontSize={['unset', 'xs']}
                                                                    placeContent={['unset', 'center']}
                                                                    rounded={['0', 'full']}
                                                                    colorScheme={'red'}
                                                                >
                                                                    <Text>Delete</Text>
                                                                </Button>
                                                            </Stack>
                                                        </Box>
                                                    )
                                                })
                                            ) : null
                                        }
                                    </VStack>
                                </Box>
                            </Stack>
                            {
                                isBtnHidden ?
                                    null :
                                    <Button
                                        colorScheme={'twitter'}
                                        isLoading={isBtnLoading}
                                        onClick={onOpen}>Submit
                                    </Button>
                            }
                        </> : null
                    }


                </Box>
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
                        Are you sure you want to send ₹ <b>{paymentFormik.values.amount}</b> to <b>{paymentFormik.values.beneficiaryName}</b>
                        <br /><br />
                        Enter your MPIN to confirm.
                        <br />
                        <HStack w={'full'} alignItems={'center'} justifyContent={'center'} pt={2} pb={6}>
                            <PinInput otp>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Confirm and Pay
                        </Button>
                        <Button variant='ghost'>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* Add New Account Popup */}
            <Modal isOpen={newRecipientModal} onClose={() => setNewRecipientModal(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        as={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'flex-start'}
                        textAlign={'center'}
                    >
                        <FormControl id='bankCode' pb={4}>
                            <FormLabel>Select Bank</FormLabel>
                            <Select
                                name='bankCode' placeholder='Select Bank'
                                value={addRecipientFormik.values.bankCode}
                                onChange={addRecipientFormik.handleChange}
                            >
                                <option value="2">Bank of Baroda</option>
                                <option value="108">State Bank of India</option>
                            </Select>
                        </FormControl>
                        <FormControl id='ifsc' pb={4}>
                            <FormLabel>Bank IFSC</FormLabel>
                            <Input value={addRecipientFormik.values.ifsc} onChange={addRecipientFormik.handleChange} />
                        </FormControl>
                        <FormControl id='accountNumber' pb={4}>
                            <FormLabel>Account Number</FormLabel>
                            <Input type={'number'} value={addRecipientFormik.values.accountNumber} onChange={addRecipientFormik.handleChange} />
                        </FormControl>
                        <FormControl id='beneficiaryName' pb={4}>
                            <FormLabel>Beneficiary Name</FormLabel>
                            <Input value={addRecipientFormik.values.beneficiaryName} onChange={addRecipientFormik.handleChange} />
                        </FormControl>
                        <FormControl id='phone'>
                            <FormLabel>Beneficiary Phone</FormLabel>
                            <Input type={'tel'} maxLength={10} value={addRecipientFormik.values.phone} onChange={addRecipientFormik.handleChange} />
                        </FormControl>
                        <HStack justifyContent={'flex-end'} pt={2}>
                            <Button size={'xs'}>Verify Details (optional)</Button>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' onClick={() => setNewRecipientModal(false)}>Cancel</Button>
                        <Button colorScheme='blue' mr={3} onClick={addRecipientFormik.handleSubmit}>
                            Add Account
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* OTP Drawer */}
            <Drawer
                isOpen={isOtpSent}
                placement='bottom'
                onClose={() => setIsOtpSent(false)}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Enter OTP sent on {customerId}</DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <VStack>
                            <HStack spacing={4}>
                                <PinInput otp mask onChange={(value) => setOtp(value)}>
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                    <PinInputField bg={'aqua'} />
                                </PinInput>
                            </HStack>
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={() => sendOtp()}>
                            Resend OTP
                        </Button>
                        <Button colorScheme='blue' onClick={() => verifyOtp()}>Submit</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Dmt