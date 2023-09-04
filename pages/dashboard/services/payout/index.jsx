import React, { useState, useEffect } from "react";
import DashboardWrapper from "../../../../hocs/DashboardLayout";
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
  useToast,
  Image,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import BackendAxios, { ClientAxios } from "../../../../lib/axios";
import Pdf from "react-to-pdf";
import {
  BsCheck2Circle,
  BsClockFill,
  BsClockHistory,
  BsDownload,
  BsExclamationCircleFill,
  BsXCircle,
} from "react-icons/bs";
import Cookies from "js-cookie";
import { FiRefreshCcw } from "react-icons/fi";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { RadioGroup } from "@chakra-ui/react";
import { Radio } from "@chakra-ui/react";
import axios from "axios";

const Payout = () => {
  const [serviceId, setServiceId] = useState("25");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const Toast = useToast({ position: "top-right" });
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(true);

  const [otpModal, setOtpModal] = useState(false);

  const handleShare = async () => {
    const myFile = await toBlob(pdfRef.current, { quality: 0.95 });
    const data = {
      files: [
        new File([myFile], "receipt.jpeg", {
          type: myFile.type,
        }),
      ],
      title: "Receipt",
      text: "Receipt",
    };
    try {
      await navigator.share(data);
    } catch (error) {
      console.error("Error sharing:", error?.toString());
      Toast({
        status: "warning",
        description: error?.toString(),
      });
    }
  };

  useEffect(() => {
    fetchServiceStatus();
  }, []);

  async function fetchServiceStatus() {
    await ClientAxios.get(`/api/organisation`)
      .then((res) => {
        // if (!res.data.payout_status) {
        //   window.location.href("/dashboard/not-available");
        // }
        setServiceStatus(res.data.payout_status);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const Formik = useFormik({
    initialValues: {
      beneficiaryName: "",
      account: "",
      ifsc: "",
      amount: "",
      mpin: "",
      otp: "",
      bankName: "",
      mode: "IMPS",
    },
  });

  const pdfRef = React.createRef();
  const [receipt, setReceipt] = useState({
    show: false,
    status: "success",
    data: {},
  });

  function fetchBankDetails() {
    axios
      .get(`https://ifsc.razorpay.com/${Formik.values.ifsc}`)
      .then((res) => {
        Formik.setFieldValue("bankName", res.data["BANK"]);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching bank details",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function triggerOtp() {
    setIsLoading(true);
    await BackendAxios.post(`/api/send-otp/payout`)
      .then((res) => {
        setIsLoading(false);
        Toast({
          position: "top-right",
          description: "OTP sent to senior",
        });
        setOtpModal(true);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.status == 401) {
          Cookies.remove("verified");
          window.location.reload();
          return;
        }
        Toast({
          status: "error",
          title: "Transaction Failed",
          description:
            err.response.data.message || err.response.data || err.message,
          position: "top-right",
        });
      });
  }

  async function makePayout() {
    if (isNaN(Formik.values.amount)) {
      Toast({
        status: "warning",
        title: "Invalid amount",
        description: `Please enter a valid amount`,
      });
      return;
    }
    const today = new Date();
    setIsLoading(true);
    if (!serviceStatus) {
      Toast({
        status: "warning",
        description: "Service unavailable!",
      });
      setIsLoading(false);
      return;
    }
    await BackendAxios.post(
      `/api/razorpay/payout/new-payout/${serviceId}`,
      JSON.stringify({
        beneficiaryName: Formik.values.beneficiaryName,
        account: Formik.values.account,
        ifsc: Formik.values.ifsc,
        mpin: Formik.values.mpin,
        amount: Formik.values.amount,
        otp: Formik.values.otp,
        mode: Formik.values.mode,
        bankName: Formik.values.bankName,
      })
    )
      .then((res) => {
        setIsLoading(false);
        onClose();
        Formik.setFieldValue("mpin", "");
        fetchPayouts();
        setReceipt({
          status: res.data.metadata.status,
          show: true,
          data: res.data.metadata,
        });
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("verified");
          window.location.reload();
          return;
        }
        // Toast({
        //   status: "error",
        //   title: "Transaction Failed",
        //   description:
        //     err.response.data.message || err.response.data || err.message,
        //   position: "top-right",
        // });
        setReceipt({
          status: "failed",
          show: true,
          data: {
            message:
              err.response.data.message || err.response.data || err.message,
            error_code: "501",
            amount: Formik.values.amount,
            timestamp: today.toLocaleString(),
          },
        });
        setIsLoading(false);
        onClose();
      });
  }

  const [rowdata, setRowdata] = useState([]);
  useEffect(() => {
    // ClientAxios.post(
    //   "/api/user/fetch",
    //   {
    //     user_id: localStorage.getItem("userId"),
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    //   .then((res) => {
    //     if (res.data[0].allowed_pages.includes("payoutTransaction") == false) {
    //       window.location.assign("/dashboard/not-allowed");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    fetchPayouts();
  }, []);

  function fetchPayouts() {
    setBtnLoading(true);
    BackendAxios.get(`/api/razorpay/fetch-payout/${serviceId}`)
      .then((res) => {
        setBtnLoading(false);
        setRowdata(res.data);
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
      });
  }

  function showReceipt(data) {
    if (!data) {
      Toast({
        description: "No receipt for this transaction",
      });
      return;
    }
    setReceipt({
      status: data.status,
      show: true,
      data: data,
    });
  }

  return (
    <>
      <DashboardWrapper titleText={"Payout"}>
        <Stack
          direction={["column", "row"]}
          pt={6}
          spacing={8}
          alignItems={"flex-start"}
        >
          <Box p={6} bg={"white"} boxShadow={"md"} rounded={12} w={"full"}>
            <Stack direction={["column"]} p={4} spacing={6}>
              <FormControl>
                <FormLabel>Enter Recipient Name</FormLabel>
                <Input
                  name={"beneficiaryName"}
                  onChange={Formik.handleChange}
                  placeholder={"Enter Beneficiary Name"}
                  value={Formik.values.beneficiaryName}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Enter Account Number</FormLabel>
                <Input
                  name={"account"}
                  onChange={Formik.handleChange}
                  placeholder={"Enter Account Number"}
                  value={Formik.values.account}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Enter IFSC Code</FormLabel>
                <Input
                  name={"ifsc"}
                  onChange={Formik.handleChange}
                  placeholder={"Enter IFSC Code"}
                  value={Formik.values.ifsc}
                />
              </FormControl>
              <FormControl>
                <HStack w={"full"} justifyContent={"space-between"}>
                  <FormLabel>Bank Name (optional)</FormLabel>
                  <Text
                    fontSize={"xs"}
                    color={"twitter.500"}
                    fontWeight={"semibold"}
                    onClick={fetchBankDetails}
                  >
                    Fetch Automatically
                  </Text>
                </HStack>
                <Input
                  name={"bankName"}
                  onChange={Formik.handleChange}
                  placeholder={"Enter Bank Name"}
                  value={Formik.values.bankName}
                  isDisabled={isLoading}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Enter Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={"₹"} />
                  <Input
                    name={"amount"}
                    onChange={Formik.handleChange}
                    placeholder={"Enter Amount"}
                    value={Formik.values.amount}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Transaction Mode</FormLabel>
                <RadioGroup
                  name="mode"
                  w={"full"}
                  display={"flex"}
                  flexDir={"row"}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  gap={8}
                  onChange={Formik.handleChange}
                  defaultValue={"IMPS"}
                >
                  <Radio value="IMPS">IMPS</Radio>
                  <Radio value="NEFT">NEFT</Radio>
                </RadioGroup>
              </FormControl>
              <Button
                colorScheme={"orange"}
                onClick={() => {
                  if (Number(Formik.values.amount) >= 149999) triggerOtp();
                  else onOpen();
                }}
              >
                Done
              </Button>
            </Stack>
          </Box>

          <Box
            p={4}
            bg={"white"}
            boxShadow={"md"}
            rounded={12}
            w={["full", "lg"]}
            h={"auto"}
          >
            <HStack pb={4} w={"full"} justifyContent={"space-between"}>
              <Text>Recent Payouts</Text>
              <Button
                colorScheme="blue"
                variant={"ghost"}
                onClick={() => fetchPayouts()}
                leftIcon={<FiRefreshCcw />}
                isLoading={btnLoading}
                size={"sm"}
              >
                Click To Reload Data
              </Button>
            </HStack>
            <TableContainer h={"full"}>
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
                <Tbody textTransform={"uppercase"}>
                  {rowdata.slice(0, 10).map((item, key) => {
                    return (
                      <Tr key={key}>
                        <Td>{key + 1}</Td>
                        <Td>
                          <Button
                            size={"xs"}
                            colorScheme="orange"
                            rounded={"full"}
                            onClick={() =>
                              showReceipt({
                                status: item.status,
                                amount: item?.amount,
                                beneficiary_name: item?.beneficiary_name,
                                account_number: item?.account_number,
                                ifsc: item?.ifsc,
                                UTR: item?.utr || " ",
                                created_at: item?.created_at,
                                reference_id: item?.reference_id,
                              })
                            }
                          >
                            Receipt
                          </Button>
                        </Td>
                        <Td>{item.beneficiary_name || "No name"}</Td>
                        <Td>{item.account_number || "0"}</Td>
                        <Td>{item.amount || "0"}</Td>
                        <Td>{item.created_at || "Non-Format"}</Td>
                        <Td>
                          {
                            // <Text color={"green"}>PROCESSING</Text> :
                            item.status == "processing" ||
                            item.status == "processed" ? (
                              <Text color={"green"}>SUCCESS</Text>
                            ) : (
                              <Text textTransform={"capitalize"}>
                                {item.status}
                              </Text>
                            )
                          }
                        </Td>
                      </Tr>
                    );
                  })}
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
            as={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            textAlign={"center"}
          >
            Are you sure you want to send ₹ <b>{Formik.values.amount}</b> to{" "}
            <b>{Formik.values.beneficiaryName}</b>
            <br />
            <br />
            Enter your MPIN to confirm.
            <br />
            <HStack
              w={"full"}
              alignItems={"center"}
              justifyContent={"center"}
              pt={2}
              pb={6}
            >
              <PinInput
                otp
                onComplete={(value) => Formik.setFieldValue("mpin", value)}
              >
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isLoading}
              onClick={() => makePayout()}
            >
              Confirm and Pay
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* OTP Confirmation Modal */}
      <Modal isOpen={otpModal} onClose={() => setOtpModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter OTP Sent To Senior</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            textAlign={"center"}
          >
            This transaction requires senior authorisation. Please enter the OTP
            to continue.
            <br />
            <br />
            <HStack
              w={"full"}
              alignItems={"center"}
              justifyContent={"center"}
              pt={2}
              pb={6}
            >
              <PinInput
                otp
                onComplete={(value) => Formik.setFieldValue("otp", value)}
              >
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
                <PinInputField bg={"aqua"} />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isLoading}
              onClick={() => {
                onOpen();
                setOtpModal(false);
              }}
            >
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => triggerOtp()}>
              Resend OTP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={receipt.show}
        onClose={() => setReceipt({ ...receipt, show: false })}
      >
        <ModalOverlay />
        <ModalContent width={"xs"}>
          <Box ref={pdfRef} style={{ border: "1px solid #999" }}>
            <ModalHeader p={0}>
              <VStack
                w={"full"}
                p={8}
                bg={
                  receipt?.status == true ||
                  receipt?.status?.toLowerCase() == "processed" ||
                  receipt?.status?.toLowerCase() == "success" ||
                  receipt?.status?.toLowerCase() == "processing" ||
                  receipt?.status?.toLowerCase() == "queued"
                    ? "#FFF"
                    : "#FFF"
                }
              >
                <Text
                  // color={"#FFF"}
                  textTransform={"capitalize"}
                >
                  ₹ {receipt.data.amount || 0}
                </Text>
                {receipt?.status == true ||
                receipt?.status?.toLowerCase() == "processed" ||
                receipt?.status?.toLowerCase() == "success" ||
                receipt?.status?.toLowerCase() == "processing" ||
                receipt?.status?.toLowerCase() == "queued" ? (
                  <BiSolidBadgeCheck color="#25D366" fontSize={72} />
                ) : (
                  <BsExclamationCircleFill color="red" fontSize={72} />
                )}
                {/* <Text color={"#FFF"} textTransform={"capitalize"}>
                  ₹ {receipt.data.amount || 0}
                </Text> */}
                <Text
                  // color={"#FFF"}
                  fontSize={"sm"}
                  textTransform={"uppercase"}
                >
                  TRANSACTION{" "}
                  {receipt?.status?.toLowerCase() == "processing" ||
                  receipt?.status?.toLowerCase() == "queued" ||
                  receipt?.status?.toLowerCase() == "processed" ||
                  receipt?.status?.toLowerCase() == "success" ||
                  receipt?.status == true
                    ? "SUCCESSFUL"
                    : "FAILED"}
                </Text>
              </VStack>
            </ModalHeader>
            <ModalBody p={0} bg={"azure"}>
              <VStack w={"full"} spacing={0} p={4} bg={"#FFF"}>
                {receipt.data
                  ? Object.entries(receipt.data).map((item, key) => {
                      if (
                        item[0].toLowerCase() != "status" &&
                        item[0].toLowerCase() != "user" &&
                        item[0].toLowerCase() != "user_id" &&
                        item[0].toLowerCase() != "user_phone" &&
                        item[0].toLowerCase() != "created_at" &&
                        item[0].toLowerCase() != "amount"
                      )
                        return (
                          <HStack
                            justifyContent={"space-between"}
                            gap={8}
                            pb={1}
                            w={"full"}
                            key={key}
                            borderWidth={"0.75px"}
                            p={2}
                          >
                            <Text
                              fontSize={"xs"}
                              fontWeight={"medium"}
                              textTransform={"capitalize"}
                            >
                              {item[0].replace(/_/g, " ")}
                            </Text>
                            <Text
                              fontSize={"xs"}
                              maxW={"full"}
                            >{`${item[1]}`}</Text>
                          </HStack>
                        );
                    })
                  : null}
                <VStack pt={8} spacing={0} w={"full"}>
                  <Text fontSize={"xs"}>
                    {receipt?.data?.created_at}
                  </Text>
                </VStack>
                {/* <VStack pt={8} spacing={0} w={"full"}>
                  <Image src="/logo_long.png" w={"20"} pt={4} />
                  <Text fontSize={"xs"}>
                    {process.env.NEXT_PUBLIC_ORGANISATION_NAME}
                  </Text>
                </VStack> */}
              </VStack>
            </ModalBody>
          </Box>
          <ModalFooter>
            <HStack justifyContent={"center"} gap={4}>
              {/* <Button
                colorScheme="yellow"
                size={"sm"}
                rounded={"full"}
                onClick={handleShare}
              >
                Share
              </Button> */}
              <Pdf targetRef={pdfRef} filename="Receipt.pdf">
                {({ toPdf }) => (
                  <Button
                    // rounded={"full"}
                    size={"sm"}
                    colorScheme={"orange"}
                    leftIcon={<BsDownload />}
                    onClick={toPdf}
                  >
                    Download
                  </Button>
                )}
              </Pdf>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Payout;
