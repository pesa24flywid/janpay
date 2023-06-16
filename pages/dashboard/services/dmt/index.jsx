import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Text,
    Image,
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
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import { states } from '../../../../lib/states'
import { useToast } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import { BsCheck2Circle, BsDownload, BsTrash, BsXCircle } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import Pdf from 'react-to-pdf'
import Cookies from 'js-cookie'
import Loader from '../../../../hocs/Loader'

const Dmt = () => {
    const [dmtProvider, setDmtProvider] = useState("")
    const serviceId = 24
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        setIsBtnLoading(true)
        ClientAxios.post('/api/user/fetch', {
            user_id: localStorage.getItem('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data[0].allowed_pages.includes('dmtTransaction') == false) {
                window.location.assign('/dashboard/not-allowed')
            }
        }).catch((err) => {
            console.log(err)
        })

        ClientAxios.get(`/api/global`).then(res => {
            setDmtProvider(res.data[0].dmt_provider)
            if (res.data[0].dmt_status == false) {
                window.location.href('/dashboard/not-available')
            }
            setIsBtnLoading(false)
            setIsLoading(false)
        }).catch(err => {
            if (err.status > 400) {
                Toast({
                    title: 'Try again later',
                    description: 'We are facing some issues.'
                })
            }
            setIsBtnLoading(true)
            setIsLoading(false)
        })


        setIsLoading(true)
        ClientAxios.get(`/api/organisation`).then(res => {
            if (res.data.dmt_status == false) {
                setIsLoading(false)
                window.location.href('/dashboard/not-available')
            }
        }).catch(err => {
            setIsLoading(false)
            console.log(err)
        })


    }, [])

    const [showSenderIdInput, setShowSenderIdInput] = useState(true)
    const [customerStatus, setCustomerStatus] = useState("hidden") // Available options - hidden, registered, unregistered
    const [customerName, setCustomerName] = useState("")
    const [customerTotalLimit, setCustomerTotalLimit] = useState(50000)
    const [customerUsedLimit, setCustomerUsedLimit] = useState(20000)
    const [customerRemainingLimit, setCustomerRemainingLimit] = useState(30000)

    const [recipients, setRecipients] = useState([
        {
            accountNumber: "",
            beneficiaryName: "",
            bankCode: "",
            bankName: "",
            bankIfsc: "",
            beneficiaryId: "",
        }
    ])
    const [bankList, setBankList] = useState([])
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [isBtnHidden, setIsBtnHidden] = useState(true)
    const [customerId, setCustomerId] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpRefId, setOtpRefId] = useState("")

    const [newRecipientModal, setNewRecipientModal] = useState(false)
    const [paymentConfirmationModal, setPaymentConfirmationModal] = useState(false)

    const { isOpen, onClose, onOpen } = useDisclosure()
    const Toast = useToast({
        position: 'top-right'
    })

    useEffect(() => {
        setIsLoading(true)
        if (dmtProvider == "paysprint") {
            BackendAxios.get(`/api/paysprint/dmt/banks/${serviceId}`).then(res => {
                setBankList(res.data)
                setIsLoading(false)
            }).catch(err => {
                Toast({
                    description: err.response.data.message || err.response.data || err.message
                })
                setIsLoading(false)
            })
        }
        if (dmtProvider == "eko") {
            BackendAxios.get(`/api/eko/aeps/fetch-bank/${serviceId}`).then(res => {
                setBankList(res.data?.param_attributes?.list_elements)
                setIsLoading(false)
            }).catch(err => {
                Toast({
                    description: err.response.data.message || err.response.data || err.message
                })
                setIsLoading(false)
            })
        }
    }, [dmtProvider])

    const registrationFormik = useFormik({
        initialValues: {
            customerName: "",
            customerDob: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        },
        onSubmit: (values) => {
            setIsBtnLoading(true)
            setIsLoading(true)
            if (dmtProvider == "eko") {
                BackendAxios.post(`api/${dmtProvider}/dmt/create-customer/${serviceId}`, {
                    ...values, customerId: customerId
                }).then((res) => {
                    if (res.status == 200) {
                        setIsOtpSent(true)
                    }
                    setIsBtnLoading(false)
                    setIsLoading(false)
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
                    setIsLoading(false)
                })
            }
            if (dmtProvider == "paysprint") {
                setIsOtpSent(true)
                setIsLoading(false)
            }
        }
    })


    const pdfRef = React.createRef()
    const [receipt, setReceipt] = useState({
        show: false,
        status: "success",
        data: {}
    })
    const paymentFormik = useFormik({
        initialValues: {
            latlong: Cookies.get("latlong"),
            amount: "",
            selectedBank: "",
            selectedBankCode: "",
            beneficiaryAccount: "",
            beneficiaryName: "",
            ifsc: "",
            beneficiaryId: "",
            transactionType: "imps",
            mpin: ""
        },
        onSubmit: values => {
            setIsLoading(true)
            if (dmtProvider == "paysprint") {
                BackendAxios.post(`/api/paysprint/dmt/initiate-payment/${serviceId}`, { ...values, customerId: customerId }).then(res => {
                    setPaymentConfirmationModal(false)
                    if (res.status == 501) {
                        Toast({
                            status: "error",
                            title: "Error Occured",
                            description: "Server Busy"
                        })
                        setIsLoading(false)
                        return
                    }
                    setIsLoading(false)
                    setReceipt({
                        status: res.data.metadata.status || false,
                        show: true,
                        data: res.data.metadata
                    })
                }).catch(err => {
                    console.log(err)
                    if (err.response.status == 501) {
                        Toast({
                            status: "error",
                            title: "Error Occured",
                            description: "Server Busy"
                        })
                        setIsLoading(false)
                        return
                    }
                    setIsLoading(false)
                    Toast({
                        status: "error",
                        title: "Error Occured",
                        description: err.response?.data?.message || err.response?.data || err.message
                    })
                })
            }
            if (dmtProvider == "eko") {
                BackendAxios.post(`/api/eko/dmt/initiate-payment/${serviceId}`, {
                    ...values, customerId: customerId,
                }).then(res => {
                    setPaymentConfirmationModal(false)
                    if (res.status == 501) {
                        Toast({
                            status: "error",
                            title: "Error Occured",
                            description: "Server Busy"
                        })
                        setIsLoading(false)
                        return
                    }
                    setIsLoading(false)
                    setReceipt({
                        status: res.data.metadata?.status || false,
                        show: true,
                        data: res.data.metadata
                    })
                }).catch(err => {
                    console.log(err)
                    if (err.response.status == 501) {
                        Toast({
                            status: "error",
                            title: "Error Occured",
                            description: "Server Busy"
                        })
                        setIsLoading(false)
                        return
                    }
                    setIsLoading(false)
                    Toast({
                        status: "error",
                        title: "Error Occured",
                        description: err.response?.data?.message || err.response?.data || err.message
                    })
                })
            }
        }
    })

    const handleShare = async () => {
        const myFile = await toBlob(pdfRef.current, { quality: 0.95 })
        const data = {
            files: [
                new File([myFile], 'receipt.jpeg', {
                    type: myFile.type
                })
            ],
            title: 'Receipt',
            text: 'Receipt'
        }
        try {
            await navigator.share(data)
        } catch (error) {
            console.error('Error sharing:', error?.toString());
            Toast({
                status: 'warning',
                description: error?.toString()
            })
        }
    };

    const addRecipientFormik = useFormik({
        initialValues: {
            bankCode: "",
            accountNumber: "",
            beneficiaryName: "",
            beneficiaryPhone: "",
            ifsc: "",
            address: "",
            pincode: "",
        },
        onSubmit: (values) => {
            // Adding New Recipient
            setIsLoading(false)
            BackendAxios.post(`api/${dmtProvider}/dmt/add-recipient/${serviceId}`, {
                ...values,
                customerId: customerId,
            }).then((res) => {
                Toast({
                    description: 'Beneficiary Added'
                })
                setNewRecipientModal(false)
                setIsLoading(false)
                fetchRecipients()
            }).catch((err) => {
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
                setIsLoading(false)
                console.log(err)
            })
        }
    })

    // Get Account Holder Name
    function getAccountHolderName() {
        setIsLoading(true)
        BackendAxios.post(`/api/paysprint/bank/bank-verify`, {
            accountNumber: addRecipientFormik.values.accountNumber,
            ifsc: addRecipientFormik.values.ifsc,
        }).then(res => {
            setIsLoading(false)
            console.log(res.data)
            if (res.data.data.account_exists) {
                setIsLoading(false)
                addRecipientFormik.setFieldValue("beneficiaryName", res.data.data.full_name)
            }
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
            Toast({
                status: 'warning',
                description: "Could not verify bank account."
            })
        })
    }

    // Check if customer is registered or not
    function checkSender(event) {
        event.preventDefault()
        setIsLoading(true)
        setCustomerStatus("hide")
        setIsBtnLoading(true)
        if (!customerId || parseInt(customerId) <= 6000000000) {
            Toast({
                description: "Enter Correct Customer ID",
            })
            setIsLoading(false)
            setIsBtnLoading(false)
        }
        else {
            BackendAxios.post(`api/${dmtProvider}/dmt/customer-info/${serviceId}`, {
                customerId
            }).then((res) => {
                if (dmtProvider == "eko") {
                    if (res.data.status == 463 && res.data.response_status_id == 1) {
                        setCustomerStatus("unregistered")
                        setShowSenderIdInput(false)
                        setIsLoading(false)
                    }
                    if (res.data.status == 0 && res.data.response_status_id == 0) {
                        setCustomerRemainingLimit(res.data.data.available_limit)
                        setCustomerUsedLimit(res.data.data.used_limit)
                        setCustomerTotalLimit(res.data.data.total_limit)
                        setCustomerName(res.data.data.name)
                        setCustomerStatus("registered")
                        setShowSenderIdInput(false)
                        fetchRecipients()
                        setIsLoading(false)
                    }
                    if (res.data.status == 0 && res.data.response_status_id == -1) {
                        sendOtp()
                        setShowSenderIdInput(false)
                        setIsLoading(false)
                    }
                    setIsBtnLoading(false)
                }
                if (dmtProvider == "paysprint") {
                    if (res.data.response_code == 0) {
                        setCustomerStatus("unregistered")
                        setOtpRefId(res.data.stateresp)
                        Toast({
                            status: "info",
                            title: "OTP Sent",
                            description: `An OTP has been sent to ${customerId}`,
                            position: "top-right"
                        })
                        setShowSenderIdInput(false)
                        setIsLoading(false)
                    }
                    if (res.data.response_code == 1) {
                        setCustomerName(res.data.data.fname + " " + res.data.data.lname)
                        setCustomerRemainingLimit(
                            parseInt(res.data.data.bank1_limit) + parseInt(res.data.data.bank2_limit) + parseInt(res.data.data.bank3_limit)
                        )
                        setCustomerUsedLimit(
                            75000 - (parseInt(res.data.data.bank1_limit) + parseInt(res.data.data.bank2_limit) + parseInt(res.data.data.bank3_limit))
                        )
                        setCustomerTotalLimit("75000")
                        setCustomerStatus("registered")
                        setShowSenderIdInput(false)
                        fetchRecipients()
                        setIsLoading(false)
                    }
                }
                setIsBtnLoading(false)
            }).catch((err) => {
                console.log(err)
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.response?.data?.message || err.response?.data || err.message,
                })
                setIsLoading(false)
                setRecipients([])
            })
            setIsBtnLoading(false)
            setIsLoading(false)
        }
    }


    function handleRecipientSelection(acc_number) {
        const Recipient = recipients.find((beneficiary) => {
            if (beneficiary.accountNumber == acc_number) {
                return beneficiary
            }
        })
        paymentFormik.setFieldValue("accountNumber", Recipient.accountNumber)
        paymentFormik.setFieldValue("selectedBank", Recipient.bankName)
        paymentFormik.setFieldValue("selectedBankCode", Recipient.bankCode)
        paymentFormik.setFieldValue("beneficiaryName", Recipient.beneficiaryName)
        paymentFormik.setFieldValue("beneficiaryAccount", Recipient.accountNumber)
        paymentFormik.setFieldValue("beneficiaryId", Recipient.beneficiaryId)
        paymentFormik.setFieldValue("ifsc", Recipient.ifsc)
        setIsBtnHidden(false)

    }

    // Send OTP for account verification
    function sendOtp() {
        setIsLoading(true)
        if (dmtProvider == "eko") {
            BackendAxios.post(`api/${dmtProvider}/dmt/resend-otp/${serviceId}`, {
                customerId
            }).then((res) => {
                if (res.status == 200) {
                    setOtpRefId(res.data)
                    setIsOtpSent(true)
                    Toast({
                        status: "info",
                        title: "OTP Sent",
                        description: `An OTP has been sent to ${customerId}`,
                        position: "top-right"
                    })
                }
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
                setIsLoading(false)
            })
        }
        if (dmtProvider == "paysprint") {
            BackendAxios.post(`api/${dmtProvider}/dmt/customer-info/${serviceId}`, {
                customerId
            }).then((res) => {
                registrationFormik.setFieldValue("customerId", customerId)
                setCustomerStatus("unregistered")
                setOtpRefId(res.data.stateresp)
                Toast({
                    status: "info",
                    title: "OTP Sent",
                    description: `An OTP has been sent to ${customerId}`,
                    position: "top-right"
                })
                setIsLoading(false)
                setIsBtnLoading(false)
            }).catch((err) => {
                console.log(err)
                Toast({
                    status: "error",
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
                setIsLoading(false)
            })
            setIsBtnLoading(false)
            setIsLoading(false)
        }
    }

    function verifyOtp() {
        setIsLoading(true)
        if (dmtProvider == "eko") {
            BackendAxios.post(`api/${dmtProvider}/dmt/verify-customer/${serviceId}`, {
                customerId: customerId,
                otp,
                otp_ref_id: otpRefId,
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
                    setIsLoading(false)
                    Toast({
                        status: 'info',
                        title: "Error Occured!",
                        description: res.data.message,
                        position: "top-right"
                    })
                }
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                Toast({
                    status: 'error',
                    title: "Error Occured",
                    description: err.message,
                    position: "top-right"
                })
            })
        }
        if (dmtProvider == "paysprint") {
            BackendAxios.post(`api/${dmtProvider}/dmt/create-customer/${serviceId}`, {
                ...registrationFormik.values,
                otp: otp,
                stateresp: otpRefId,
                customerId: customerId
            }).then(res => {
                setIsLoading(false)
                console.log(res.data)
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
                Toast({
                    status: 'error',
                    title: "Error Occured",
                    description: err.response.data.message || err.response.data || err.message,
                })
            })
        }
    }

    function fetchRecipients() {
        setIsLoading(true)
        if (dmtProvider == "paysprint") {
            BackendAxios.post(`/api/paysprint/dmt/recipient-list/${serviceId}`, {
                customerId: customerId
            }).then(res => {
                setIsLoading(false)
                console.log(res.data)
                setRecipients(res.data.data.map((recipient) => {
                    return {
                        accountNumber: recipient.accno,
                        beneficiaryName: recipient.name,
                        bankCode: recipient.bankid,
                        bankName: recipient.bankname,
                        bankIfsc: recipient.ifsc,
                        beneficiaryId: recipient.bene_id,
                    }
                }))
            }).catch(err => {
                setIsLoading(false)
                Toast({
                    status: 'error',
                    title: "Error Occured",
                    description: err.response.data.message || err.response.data || err.message,
                })
                setRecipients([])
            })
        }
        if (dmtProvider == "eko") {
            BackendAxios.get(`/api/eko/dmt/recipient-list/${serviceId}?customerId=${customerId}`).then(res => {
                if (res.data?.data?.recipient_list?.length) {
                    setIsLoading(false)
                    setRecipients(res.data.data.recipient_list.map((recipient) => {
                        return {
                            accountNumber: recipient.account,
                            beneficiaryName: recipient.recipient_name,
                            bankCode: null,
                            bankName: recipient.bank,
                            bankIfsc: recipient.ifsc,
                            beneficiaryId: recipient.recipient_id,
                        }
                    }))
                }
                else {
                    setIsLoading(false)
                    Toast({
                        description: res.data.message || "No recipients found"
                    })
                    setRecipients([])
                }
            }).catch(err => {
                setIsLoading(false)
                Toast({
                    status: 'error',
                    title: "Error Occured",
                    description: err?.response?.data?.message || err.response?.data || err.message,
                })
                setRecipients([])
            })
        }
    }

    function deleteRecipient(beneficiaryId) {
        if (dmtProvider == "paysprint") {
            BackendAxios.post(`/api/paysprint/dmt/delete-recipient/${serviceId}`, {
                mobile: customerId,
                bene_id: beneficiaryId
            }).then(res => {
                console.log(res.data)
                Toast({
                    status: 'success',
                    description: 'Recipient Deleted!'
                })
                fetchRecipients()
            }).catch(err => {
                Toast({
                    status: 'error',
                    title: "Error Occured",
                    description: err.response.data.message || err.response.data || err.message,
                })
            })
        }
    }



    return (
        <>
            <DashboardWrapper titleText={"Domestic Money Transfer"}>
                {
                    isLoading ? <Loader /> : null
                }
                <Box
                    p={6} bg={'white'}
                    boxShadow={'md'}
                    rounded={12} mt={6}
                >
                    <HStack>
                        {
                            showSenderIdInput ?
                                <Box>
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
                                </Box> :
                                <HStack justifyContent={'space-between'} w={'full'}>
                                    <Input value={customerId} border={'none'} isDisabled={true} width={['full', 'xs']} />
                                    <Button
                                        size={'sm'}
                                        colorScheme='red'
                                        onClick={() => {
                                            setShowSenderIdInput(true)
                                            setCustomerStatus("hidden")
                                        }}>Logout</Button>
                                </HStack>
                        }
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
                                                <HStack w={'full'} spacing={6}>
                                                    <FormControl my={4}>
                                                        <FormLabel>Transaction Type</FormLabel>
                                                        <Select name='transactionType' onChange={paymentFormik.handleChange}>
                                                            <option value="imps">IMPS</option>
                                                            <option value="neft">NEFT</option>
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl my={4}>
                                                        <FormLabel>Enter Amount</FormLabel>
                                                        <InputGroup w={'full'}>
                                                            <InputLeftAddon children={'₹'} />
                                                            <Input type={'number'} name={'amount'} max={5000} value={paymentFormik.values.amount} onChange={paymentFormik.handleChange} />
                                                        </InputGroup>
                                                    </FormControl>
                                                </HStack>
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
                                                            boxShadow={'md'} pos={'relative'}
                                                            key={key}
                                                        >
                                                            <Text
                                                                w={'full'} px={4} py={1}
                                                                textTransform={'uppercase'}
                                                                fontWeight={'semibold'}
                                                                fontSize={'xs'} bg={'blanchedalmond'}
                                                                roundedTop={12}
                                                            >
                                                                {item.bankName}
                                                            </Text>
                                                            <Box w={'full'} p={4} fontSize={'xs'}>
                                                                <Text mb={2}>
                                                                    <span style={{ paddingRight: ".5rem" }}><b>Beneficiary: </b></span>
                                                                    {item.beneficiaryName}
                                                                </Text>
                                                                <Text mb={2} fontSize={'sm'}>
                                                                    <span style={{ paddingRight: ".5rem" }}><b>Account No: </b></span>
                                                                    {item.accountNumber}
                                                                </Text>
                                                                <Text mb={2}>
                                                                    <span style={{ paddingRight: "1.20rem" }}><b>Bank IFSC: </b></span>
                                                                    {item.bankIfsc}
                                                                </Text>
                                                            </Box>
                                                            <Stack direction={['row-reverse', 'column']} spacing={[0, 4]} pos={['relative', 'absolute']} top={[0, '2.25rem']} right={[0, '1rem']}>
                                                                <Button
                                                                    leftIcon={<FiSend />}
                                                                    w={['full', 'fit-content']}
                                                                    fontSize={['unset', 'xs']}
                                                                    rounded={['0', 'full']}
                                                                    colorScheme={'twitter'}
                                                                    value={item.accountNumber}
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
                                                                    onClick={() => deleteRecipient(item.beneficiaryId)}
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
                                        onClick={() => setPaymentConfirmationModal(true)}>Submit
                                    </Button>
                            }
                        </> : null
                    }


                </Box>
            </DashboardWrapper>



            {/* Confirm Payment Popup */}
            <Modal isOpen={paymentConfirmationModal} onClose={() => setPaymentConfirmationModal(false)}>
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
                            <PinInput otp onChange={(value) => paymentFormik.setFieldValue('mpin', value)}>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={paymentFormik.handleSubmit}>
                            Confirm and Pay
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
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
                                {
                                    bankList.map((bank, key) => (
                                        dmtProvider == "paysprint" ?
                                            <option key={key} value={bank.bank_id}>{bank.name}</option> :
                                            dmtProvider == "eko" ?
                                                <option key={key} value={bank.value}>{bank.label}</option> : null
                                    ))
                                }
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
                        <HStack justifyContent={'flex-end'} pt={2}>
                            <Button size={'xs'} onClick={getAccountHolderName}>Get Name</Button>
                        </HStack>
                        <FormControl id='beneficiaryPhone' pb={4}>
                            <FormLabel>Beneficiary Phone</FormLabel>
                            <Input value={addRecipientFormik.values.beneficiaryPhone} onChange={addRecipientFormik.handleChange} />
                        </FormControl>

                        <HStack gap={2} mt={8}>
                            <FormControl id='address'>
                                <FormLabel>Address</FormLabel>
                                <Input value={addRecipientFormik.values.address} onChange={addRecipientFormik.handleChange} />
                            </FormControl>
                            <FormControl id='pincode'>
                                <FormLabel>PINCODE</FormLabel>
                                <Input value={addRecipientFormik.values.pincode} onChange={addRecipientFormik.handleChange} />
                            </FormControl>
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
                                <Input
                                    onChange={(e) => setOtp(e.target.value)}
                                />
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
                                <Text color={'#FFF'} textTransform={'capitalize'}>₹ {receipt.data.amount || "0"}</Text>
                                <Text color={'#FFF'} fontSize={'xs'} textTransform={'uppercase'}>Transaction {receipt.status ? "success" : "failed"}</Text>
                            </VStack>
                        </ModalHeader>
                        <ModalBody p={0} bg={'azure'}>
                            <VStack w={'full'} spacing={0} p={4} bg={'#FFF'}>
                                {
                                    receipt.data ?
                                        Object.entries(receipt.data).map((item, key) => {

                                            if (
                                                item[0].toLowerCase() != "status" &&
                                                item[0].toLowerCase() != "user" &&
                                                item[0].toLowerCase() != "user_id" &&
                                                item[0].toLowerCase() != "user_phone" &&
                                                item[0].toLowerCase() != "amount"
                                            )
                                                return (
                                                    <HStack
                                                        justifyContent={'space-between'}
                                                        gap={8} pb={1} w={'full'} key={key}
                                                        borderWidth={'0.75px'} p={2}
                                                    >
                                                        <Text
                                                            fontSize={'xs'}
                                                            fontWeight={'medium'}
                                                            textTransform={'capitalize'}
                                                        >{item[0].replace(/_/g, " ")}</Text>
                                                        <Text fontSize={'xs'} maxW={'full'} >{`${item[1]}`}</Text>
                                                    </HStack>
                                                )

                                        }
                                        ) : null
                                }
                                <VStack pt={8} spacing={0} w={'full'}>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user}</Text>
                                    </HStack>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant ID:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_id}</Text>
                                    </HStack>
                                    <HStack borderWidth={'1px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant Mobile:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_phone}</Text>
                                    </HStack>
                                    <Image src='/logo_long.jpeg' w={'20'} pt={4} />
                                    <Text fontSize={'xs'}>{process.env.NEXT_PUBLIC_ORGANISATION_NAME}</Text>
                                </VStack>
                            </VStack>
                        </ModalBody>
                    </Box>
                    <ModalFooter>
                        <HStack justifyContent={'center'} gap={4}>
                            <Button
                                colorScheme='yellow'
                                size={'sm'} rounded={'full'}
                                onClick={handleShare}
                            >Share</Button>
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

export default Dmt