import React, { useEffect, useState } from "react";
import {
  Text,
  HStack,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  PinInput,
  PinInputField,
  InputGroup,
  InputLeftAddon,
  useToast,
  Select,
} from "@chakra-ui/react";
import Head from "next/head";
import { useFormik } from "formik";
import DashboardWrapper from "../../../hocs/DashboardLayout";
// import axios from "axios";
import axios from "../../../lib/axios";
import Cookies from "js-cookie";
import { states } from "../../../lib/states";

const EditProfile = () => {
  const [isPhoneOtpDisabled, setIsPhoneOtpDisabled] = useState(true)
  const [isAadhaarOtpDisabled, setIsAadhaarOtpDisabled] = useState(true)
  const [isPanOtpDisabled, setIsPanOtpDisabled] = useState(true)
  const [otpSent, setOtpSent] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [newAadhaar, setNewAadhaar] = useState("")
  const [newPan, setNewPan] = useState("")
  const [otp, setOtp] = useState("")
  const [phoneModal, setPhoneModal] = useState(false)
  const [aadhaarModal, setAadhaarModal] = useState(false)
  const Toast = useToast()

  // Form Data handling
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: null,
      email: "",
      dob: "",
      aadhaar: null,
      pan: "",
      companyName: "",
      line: "",
      city: "",
      state: "",
      pincode: ""
    },
    onSubmit: async (values) => {
      // Handle submit
      axios.post('api/user/update', {
        values
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
  });

  const profileFormik = useFormik({
    initialValues: {
      profilePicture: null,
      eAadharFront: null,
      eAadharBack: null,
      panCard: null,
    }
  })


  useEffect(() => {
    formik.setFieldValue("firstName", localStorage.getItem("firstName"))
    formik.setFieldValue("lastName", localStorage.getItem("lastName"))
    formik.setFieldValue("phone", localStorage.getItem("phone"))
    formik.setFieldValue("email", localStorage.getItem("userEmail"))
    formik.setFieldValue("aadhaar", localStorage.getItem("aadhaar"))
    formik.setFieldValue("pan", localStorage.getItem("pan"))
    formik.setFieldValue("dob", localStorage.getItem("dob"))
    formik.setFieldValue("companyName", localStorage.getItem("companyName"))
    formik.setFieldValue("line", localStorage.getItem("line"))
    formik.setFieldValue("city", localStorage.getItem("city"))
    formik.setFieldValue("state", localStorage.getItem("state"))
    formik.setFieldValue("pincode", localStorage.getItem("pincode"))
  }, [])

  useEffect(() => {
    setIsPhoneOtpDisabled(true)
    setIsAadhaarOtpDisabled(true)
    setIsPanOtpDisabled(true)
    if (parseInt(newPhone) > 4000000000) setIsPhoneOtpDisabled(false)
    if (parseInt(newAadhaar) > 100000000000) setIsAadhaarOtpDisabled(false)

  }, [newPhone, newAadhaar])


  async function sendPhoneOtp() {
    axios.post(`/api/users/otp`, {
      userId: localStorage.getItem("userId"),
      newNumber: newPhone
    }, {
      headers: {
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((res) => {
      setOtpSent(true)
    }).catch((error) => {
      Toast({
        status: "error",
        title: `Error Occured`,
        description: error.message,
        position: "top-right",
        duration: 3000
      })
      setOtpSent(false)
    })
  }

  async function verifyPhoneOtp() {
    await axios.post(`/api/users/verify-otp`, {
      userId: localStorage.getItem("userId"),
      newNumber: newPhone,
      otp: otp
    }).then((res) => {
      if (res.status == 200) {
        setPhoneModal(false)
        formik.setFieldValue("phone", newPhone)
      }
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message
      })
    })
    setOtpSent(false)
  }

  function sendAadhaarOtp() {
    fetch("https://api.apiclub.in/uat/v1/aadhaar_v2/send_otp", {
      headers: {
        "API-KEY": process.env.APICLUB_API_KEY, //API Club API KEY
        "content-type": "application/json",
      },
      body: JSON.stringify({
        aadhaar_no: newAadhaar,
      })
    })
  }

  return (
    <>
      <Head>
        <title>Pesa24 - Edit Profile</title>
      </Head>
      <DashboardWrapper titleText="Edit Profile">
        <Stack direction={['column', 'row']} my={4} spacing={4} alignItems={'flex-start'}>
          <Stack
            spacing={4}
            maxW={"2xl"}
            bg={"white"}
            boxShadow={"lg"}
            rounded={"xl"}
            p={[4, 6]}
            mx={'auto'}
          >
            {/* Edit info Form */}
            <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Personal Details</Text>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl py={2} id="lastName" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="Email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.email}
                  disabled
                />
              </FormControl>
              <FormControl py={2} id="phone" isRequired>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  placeholder="Phone number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.phone}
                  onClick={() => setPhoneModal(true)}
                  readOnly
                  cursor={'pointer'}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="dob" isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  placeholder="dd/mm/yyyy"
                  _placeholder={{ color: "gray.500" }}
                  type="date"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl py={2} id="companyName" isRequired>
                <FormLabel>Company name</FormLabel>
                <Input
                  placeholder="Company name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="verifiedAadhaar" isRequired>
                <FormLabel>Aadhar Number</FormLabel>
                <Input
                  placeholder="Aadhar number"
                  _placeholder={{ color: "gray.500" }}
                  type="number" readOnly cursor={'pointer'}
                  value={formik.values.aadhaar}
                  onClick={() => setAadhaarModal(true)}
                />
              </FormControl>
              <FormControl py={2} id="pan" isRequired>
                <FormLabel>Your PAN</FormLabel>
                <Input
                  placeholder="Peresonal Account Number"
                  _placeholder={{ color: "gray.500" }}
                  value={formik.values.pan}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>

            <VStack alignItems={'flex-start'} py={8}>
              <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Address Details</Text>
              <Stack direction={['column', 'row']} w={'full'} spacing={8}>
                <FormControl py={2} id="line" isRequired>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.line}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction={['column', 'row']} spacing={8}>
                <FormControl py={2} id="city" isRequired>
                  <FormLabel>City</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl py={2} id="pincode" isRequired>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl py={2} id="state" isRequired>
                  <FormLabel>State</FormLabel>
                  <Select name="state" placeholder="Select State" value={formik.values.state} onChange={formik.handleChange}>
                    {states.map((state, key) => {
                      return (
                        <option value={state} key={key}>{state}</option>
                      )
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </VStack>

            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                onClick={formik.handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Stack>

          <Stack w={['full', 'sm']} rounded={12} bg={'white'} p={4} boxShadow={'lg'}>
            <Text fontSize={'lg'} fontWeight={'medium'} color={'#333'}>Upload Documents</Text>
            <Stack direction={["column"]} spacing="6" pb={6}>
              <FormControl py={2} id="profilePicture" isRequired>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => profileFormik.setFieldValue("profilePicture", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg"}
                />
              </FormControl>
              <FormControl py={2} id="panCard" isRequired>
                <FormLabel>Pan Card</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => profileFormik.setFieldValue("panCard", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column"]} spacing="6" pb={6}>
              <FormControl py={2} id="eAadharBack" isRequired>
                <FormLabel>eAadhar (Back)</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => profileFormik.setFieldValue("eAadharBack", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
              <FormControl py={2} id="eAadharFront" isRequired>
                <FormLabel>eAadhar (Front)</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => profileFormik.setFieldValue("eAadharFront", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
            </Stack>
            <Button colorScheme={'orange'} onClick={profileFormik.handleSubmit}>Upload</Button>
          </Stack>
        </Stack>
      </DashboardWrapper>

      {/* Phone Number Addition */}
      <Modal isOpen={phoneModal} onClose={() => { setPhoneModal(false); setOtpSent(false) }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add New Phone Number
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputLeftAddon children={"+91"} />
              <Input type={'tel'} maxLength={10} placeholder={'Your Phone Number'} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </InputGroup>
            <HStack justifyContent={'flex-end'} py={2}>
              <Button colorScheme={'twitter'} disabled={isPhoneOtpDisabled} size={'xs'} onClick={sendPhoneOtp}>Send OTP</Button>
            </HStack>

            <VStack display={otpSent ? "flex" : "none"}>
              <Text>Enter OTP</Text>
              <HStack py={2}>
                <PinInput otp onComplete={(value) => setOtp(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <Button colorScheme={'twitter'} onClick={verifyPhoneOtp}>Verify</Button>
            </VStack>

          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Aadhaar Number Add */}
      <Modal isOpen={aadhaarModal} onClose={() => { setAadhaarModal(false); setOtpSent(false) }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add Your Aadhaar
          </ModalHeader>
          <ModalBody>
            <Input type={'tel'} placeholder={'Your Aadhaar Number'} maxLength={12} value={newAadhaar} onChange={(e) => setNewAadhaar(e.target.value)} />
            <HStack justifyContent={'flex-end'} py={2}>
              <Button colorScheme={'twitter'} disabled={isAadhaarOtpDisabled} size={'xs'} onClick={sendAadhaarOtp}>Send OTP</Button>
            </HStack>

            <VStack display={otpSent ? "flex" : "none"}>
              <Text>Enter OTP</Text>
              <HStack py={2}>
                <PinInput otp onComplete={(value) => setOtp(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <Button colorScheme={'twitter'} onClick={verifyPhoneOtp}>Verify</Button>
            </VStack>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;
