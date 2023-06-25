import React from "react";
import {
  Box,
  Stack,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import DashboardWrapper from "../../../hocs/DashboardLayout";
import BackendAxios from "../../../lib/axios";
import { Modal } from "@chakra-ui/react";
import { ModalOverlay } from "@chakra-ui/react";
import { ModalContent } from "@chakra-ui/react";
import { ModalHeader } from "@chakra-ui/react";
import { ModalBody } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { PinInput } from "@chakra-ui/react";
import { PinInputField } from "@chakra-ui/react";
import { ModalFooter } from "@chakra-ui/react";

const ResetPassword = () => {
  const Toast = useToast({
    position: "top-right",
  });
  const { isOpen, onToggle } = useDisclosure();

  const PasswordFormik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
      otp: "",
    },
  });

  function handlePasswordReset() {
    BackendAxios.post(
      "/api/user/new-password",
      JSON.stringify({
        old_password: PasswordFormik.values.old_password,
        new_password: PasswordFormik.values.new_password,
        new_password_confirmation:
          PasswordFormik.values.new_password_confirmation,
        otp: PasswordFormik.values.otp,
      })
    )
      .then((res) => {
        Toast({
          status: "success",
          title: "Success",
          description: "Your password was changed succesfully.",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error Occured",
          description:
            err.response.data.message || err.response.data || err.message,
        });
      });
  }

  function sendOtp() {
    BackendAxios.post("/password/send-otp")
      .then((res) => {
        onToggle();
        Toast({
          status: "success",
          description: "OTP Sent To Your Phone",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <DashboardWrapper titleText={"Reset Password"}>
        <Box
          bg={"white"}
          boxShadow={"md"}
          p={6}
          w={["full", "md"]}
          rounded={16}
          mx={"auto"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={"lg"} mb={12}>
            Reset Your Password
          </Text>
          <VStack spacing={8}>
            <FormControl>
              <FormLabel textAlign={"center"}>Enter Old Passwod</FormLabel>
              <Input
                name={"old_password"}
                onChange={PasswordFormik.handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel textAlign={"center"}>Enter New Password</FormLabel>
              <Input
                name={"new_password"}
                type={"password"}
                onChange={PasswordFormik.handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel textAlign={"center"}>Confirm New Password</FormLabel>
              <Input
                name={"new_password_confirmation"}
                onChange={PasswordFormik.handleChange}
              />
            </FormControl>
            <Button colorScheme={"orange"} onClick={sendOtp}>
              Done
            </Button>
          </VStack>
        </Box>
      </DashboardWrapper>

      <Modal isOpen={isOpen} onClose={onToggle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            Enter OTP Sent To Your Phone
          </ModalHeader>
          <ModalBody>
            <HStack justifyContent={"center"}>
              <PinInput
                otp
                onComplete={(value) => PasswordFormik.setFieldValue("otp", value)}
              >
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button colorScheme="twitter" onClick={handlePasswordReset}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetPassword;
