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

} from "@chakra-ui/react";
import Head from "next/head";
import { useFormik } from "formik";
import DashboardWrapper from "../../../hocs/DashboardLayout";
// import axios from "axios";
import axios from "../../../lib/axios";
import Cookies from "js-cookie";

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
      contactNo: "",
      email: "",
      dob: "",
      verifiedAadhaar: "",
      pan: "",
      companyName: "",
      line: "",
      city: "",
      state: "",
      pincode: "",
      profilePicture: "",
      eAadharFront: "",
      eAadharBack: "",
      panCard: "",
    },
    onSubmit: async (values) => {
      // Handle submit
    },
  });

  useEffect(() => {
    if (parseInt(formik.values.pincode) > 100000 && parseInt(formik.values.pincode) < 999999) {
      fetch(`https://api.postalpincode.in/pincode/${formik.values.pincode}`).then((res) => {
        if (res.data[0].PostOffice[0].State) formik.setFieldValue("state", res.data[0].PostOffice[0].State)
        if (!res.data[0].PostOffice[0].State) formik.setFieldValue("state", "Wrong Pincode")
      })
    }
  }, [formik])

  useEffect(() => {
    axios.get(`/api/users/${localStorage.getItem("userId")}`).then((res) => {
      formik.setFieldValue("firstName", res.data.data.first_name)
      formik.setFieldValue("lastName", res.data.data.last_name)
      formik.setFieldValue("email", res.data.data.email)
    })
  }, [])

  useEffect(() => {
    setIsPhoneOtpDisabled(true)
    setIsAadhaarOtpDisabled(true)
    setIsPanOtpDisabled(true)
    if (parseInt(newPhone) > 4000000000 && parseInt(newPhone) < 9999999999) setIsPhoneOtpDisabled(false)
    if (parseInt(newAadhaar) > 100000000000 && parseInt(newAadhaar) < 999999999999) setIsAadhaarOtpDisabled(false)
    
  }, [newPhone, newAadhaar, newPan])


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
        formik.setFieldValue("contactNo", newPhone)
      }
    }).catch((err)=>{
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message
      })
    })
    setOtpSent(false)
  }

  function sendAadhaarOtp(){
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

        <Flex minH={"100vh"} align={"center"} justify={"center"}>
          <Stack
            spacing={4}
            w={"3xl"}
            maxW={"3xl"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            rounded={"xl"}
            p={8}
            my={12}
            px={"10"}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              Edit Info
            </Heading>
            {/* Edit info Form */}
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
              <FormControl py={2} id="contactNo" isRequired>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  placeholder="Phone number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.contactNo}
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
                  type="number" readOnly
                  value={formik.values.verifiedAadhaar}
                  onClick={() => setAadhaarModal(true)}
                />
              </FormControl>
              <FormControl py={2} id="pan" isRequired>
                <FormLabel>Your PAN</FormLabel>
                <Input
                  placeholder="Peresonal Account Number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.pan}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>

            <VStack alignItems={'flex-start'} py={8}>
              <Text pb={2}>Address Details</Text>
              <Stack direction={['column', 'row']} spacing={8}>
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
              </Stack>
              <Stack direction={['column', 'row']} spacing={8}>
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
                  <Input
                    placeholder="Enter pincode first"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.state}
                    readOnly
                  />
                </FormControl>
              </Stack>
            </VStack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="profilePicture" isRequired>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  value={formik.values.profilePicture}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl py={2} id="eAadharFront" isRequired>
                <FormLabel>eAadhar (Front)</FormLabel>
                <Input
                  type="file"
                  value={formik.values.eAadharFront}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="eAadharBack" isRequired>
                <FormLabel>eAadhar (Back)</FormLabel>
                <Input
                  type="file"
                  value={formik.values.eAadharBack}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl py={2} id="panCard" isRequired>
                <FormLabel>Pan Card</FormLabel>
                <Input
                  type="file"
                  value={formik.values.panCard}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>

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
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </DashboardWrapper>

      {/* Phone Number Addition */}
      <Modal isOpen={phoneModal} onClose={() => {setPhoneModal(false);setOtpSent(false)}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add New Phone Number
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputLeftAddon children={"+91"} />
              <Input type={'tel'} placeholder={'Your Phone Number'} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
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
      <Modal isOpen={aadhaarModal} onClose={() => {setAadhaarModal(false);setOtpSent(false)}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add Your Aadhaar
          </ModalHeader>
          <ModalBody>
            <Input type={'tel'} placeholder={'Your Aadhaar Number'} value={newAadhaar} onChange={(e) => setNewAadhaar(e.target.value)} />
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
