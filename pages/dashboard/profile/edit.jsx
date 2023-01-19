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
} from "@chakra-ui/react";
import Head from "next/head";
import Sidebar from "../../../hocs/Sidebar";
import Topbar from "../../../hocs/Topbar";
import { useFormik } from "formik";
import DashboardWrapper from "../../../hocs/DashboardLayout";
import axios from "axios";

const EditProfile = () => {
  const [newNotification, setNewNotification] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      title: "Under Maintainence",
      content:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque pariatur aut eos quae quisquam eveniet incidunt ad odio magni at.",
    },
  ]);

  // Form Data handling
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactNo: "",
      email: "",
      dob: "",
      aadharNo: "",
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

  useEffect(()=>{
    if (parseInt(formik.values.pincode) > 100000 && parseInt(formik.values.pincode) < 999999) {
      axios.get(`https://api.postalpincode.in/pincode/${formik.values.pincode}`).then((res) => {
        if(res.data[0].PostOffice[0].State) formik.setFieldValue("state", res.data[0].PostOffice[0].State)
        if(!res.data[0].PostOffice[0].State) formik.setFieldValue("state", "Wrong Pincode")
      })
    }
  }, [formik])


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
              <FormControl id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl id="lastName" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl id="Email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.email}
                  disabled
                />
              </FormControl>
              <FormControl id="contactNo" isRequired>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  placeholder="Phone number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.contactNo}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl id="dob" isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  placeholder="dd/mm/yyyy"
                  _placeholder={{ color: "gray.500" }}
                  type="date"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl id="companyName" isRequired>
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
              <FormControl id="aadharNo" isRequired>
                <FormLabel>Aadhar Number</FormLabel>
                <Input
                  placeholder="Aadhar number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.aadharNo}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl id="pan" isRequired>
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
                <FormControl id="line" isRequired>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.line}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl id="city" isRequired>
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
                <FormControl id="pincode" isRequired>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl id="state" isRequired>
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
              <FormControl id="profilePicture" isRequired>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  value={formik.values.profilePicture}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl id="eAadharFront" isRequired>
                <FormLabel>eAadhar (Front)</FormLabel>
                <Input
                  type="file"
                  value={formik.values.eAadharFront}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl id="eAadharBack" isRequired>
                <FormLabel>eAadhar (Back)</FormLabel>
                <Input
                  type="file"
                  value={formik.values.eAadharBack}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl id="panCard" isRequired>
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
    </>
  );
};

export default EditProfile;
