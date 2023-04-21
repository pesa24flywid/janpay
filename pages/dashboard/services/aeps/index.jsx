import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import $ from 'jquery'
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  HStack,
  useToast,
  Radio,
  RadioGroup,
  Checkbox,
  VStack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  ModalOverlay
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Cookies from 'js-cookie'
import { BsCheck2Circle, BsClock, BsDownload, BsXCircle, BsEye } from 'react-icons/bs'
import Pdf from 'react-to-pdf'

const Aeps = () => {
  const [aepsProvider, setAepsProvider] = useState("paysprint")
  const transactionKeyword = "aeps"
  const serviceCode = "20"
  useEffect(() => {
    ClientAxios.post('/api/user/fetch', {
      user_id: localStorage.getItem('userId')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.data[0].allowed_pages.includes('aepsTransaction') == false) {
        window.location.assign('/dashboard/not-allowed')
      }
    }).catch((err) => {
      console.log(err)
    })

    ClientAxios.get(`/api/global`).then(res => {
      setAepsProvider(res.data[0].aeps_provider)
      if (!res.data[0].aeps_status) {
        window.location.href('/dashboard/not-available')
      }
    }).catch(err => {
      Toast({
        title: 'Try again later',
        description: 'We are facing some issues.'
      })
    })

  }, [])

  let MethodInfo
  function getMantra() {
    var GetCustomDomName = "127.0.0.1";
    var SuccessFlag = 0;
    var primaryUrl = "http://" + GetCustomDomName + ":";
    var url = "";
    var SuccessFlag = 0;

    var verb = "RDSERVICE";
    var err = "";

    var MethodCapture = "/rd/capture"
    var MethodCapture = "/rd/info"

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    var data = new Object();
    var obj = new Object();

    $.ajax({
      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + 11100,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,
      success: function (data) {
        var $doc = $.parseXML(data);
        var CmbData1 = $($doc).find('RDService').attr('status');
        var CmbData2 = $($doc).find('RDService').attr('info');
        if (CmbData1 == "READY") {
          SuccessFlag = 1;
          if (RegExp('\\b' + 'Mantra' + '\\b').test(CmbData2) == true) {
            if ($($doc).find('Interface').eq(0).attr('path') == "/rd/capture") {
              MethodCapture = $($doc).find('Interface').eq(0).attr('path');
            }
            if ($($doc).find('Interface').eq(1).attr('path') == "/rd/capture") {
              MethodCapture = $($doc).find('Interface').eq(1).attr('path');
            }
            if ($($doc).find('Interface').eq(0).attr('path') == "/rd/info") {
              MethodInfo = $($doc).find('Interface').eq(0).attr('path');
            }
            if ($($doc).find('Interface').eq(1).attr('path') == "/rd/info") {
              MethodInfo = $($doc).find('Interface').eq(1).attr('path');
            }
          }
        }
        else {
          SuccessFlag = 0;
        }
      },
    });

    if (SuccessFlag == 1) {
      //alert("RDSERVICE Discover Successfully");
      var XML = '<' + '?' + 'xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
      var finalUrl = "http://" + GetCustomDomName + ":" + 11100;
      var verb = "CAPTURE";
      var err = "";
      var res;
      $.support.cors = true;
      var httpStaus = false;
      var jsonstr = "";

      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: finalUrl + MethodCapture,
        data: XML,
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: async function (data) {
          var $doc = $.parseXML(data);
          var Message = $($doc).find('Resp').attr('errInfo');
          var errCode = $($doc).find('Resp').attr('errCode');
          var srno = $($doc).find('Param').attr('value');
          var Skey = ($doc.getElementsByTagName("Skey")[0].childNodes[0]).nodeValue;
          var PidData = ($doc.getElementsByTagName("Data")[0].childNodes[0]).nodeValue;
          var PidDatatype = $($doc).find('Data').attr('type');
          var hmac = ($doc.getElementsByTagName("Hmac")[0].childNodes[0]).nodeValue;
          var sessionKey = ($doc.getElementsByTagName("Skey")[0].childNodes[0]).nodeValue;

          var ci = $($doc).find('Skey').attr('ci');
          var mc = $($doc).find('DeviceInfo').attr('mc');
          var mi = $($doc).find('DeviceInfo').attr('mi');
          var dc = $($doc).find('DeviceInfo').attr('dc');
          var rdsVer = $($doc).find('DeviceInfo').attr('rdsVer');
          var rdsID = $($doc).find('DeviceInfo').attr('rdsId');
          var dpID = $($doc).find('DeviceInfo').attr('dpId');
          var qScore = $($doc).find('Resp').attr('qScore');
          var nmPoints = $($doc).find('Resp').attr('nmPoints');
          var pType = 0;
          var pCount = 0;
          var iType = 0;
          var iCount = 0;
          var fType = $($doc).find('Resp').attr('fType');
          var fCount = $($doc).find('Resp').attr('fCount');
          var errInfo = $($doc).find('Resp').attr('errInfo');
          var errCode = $($doc).find('Resp').attr('errCode');

          if (errCode == "0") {
            Toast({
              status: "success",
              title: "Fingerprint Captured",
              position: "top-right"
            })
            formik.setFieldValue("pid", data).then(() => {
              formik.handleSubmit()
            })
          }
          else {
            alert("Error : " + Message);
          }

        }
      });
    }
    else {
      Toast({
        status: "error",
        title: "Biometric Device Not Found",
        description: "Please connect your device and refresh this page.",
        position: "top-right"
      })
      setIsBtnLoading(false)
    }
  }

  function searchMantra() {

    var GetCustomDomName = "127.0.0.1";
    var primaryUrl = "http://" + GetCustomDomName + ":";
    var url = "";
    var MantraFound = 0;

    var verb = "RDSERVICE";
    var err = "";

    var MethodCapture = "/rd/capture"
    var MethodCapture = "/rd/info"

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    var data = new Object();
    var obj = new Object();

    $.ajax({
      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + 11100,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,
      crossDomain: true,
      success: function (data) {
        var $doc = $.parseXML(data);
        var CmbData1 = $($doc).find('RDService').attr('status');
        var CmbData2 = $($doc).find('RDService').attr('info');
        if (CmbData1 == "READY") {
          MantraFound = 1;
          setBiometricDevice("mantra")
        }
        else {
          MantraFound = 0;
        }
      },
    })

    if (MantraFound != 1) {
      Toast({
        status: "error",
        title: "Biometric Device Not Found",
        description: "Please connect your device and refresh this page.",
        position: "top-right"
      })
    }
  }

  useEffect(() => {
    searchMantra()
  }, [])
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [biometricDevice, setBiometricDevice] = useState("")
  const [banksList, setBanksList] = useState([])
  const Toast = useToast({ position: 'top-right' })
  const formik = useFormik({
    initialValues: {
      aadhaarNo: "",
      customerId: "",
      bankCode: "",
      bankAccountNo: "",
      ifsc: "",
      serviceCode: "mini-statement",         // Services Code as per service provider
      pid: "",
      amount: "",
      serviceId: "20", // Services ID as per Pesa24 Portal
      latlong: Cookies.get("latlong")
    },
    onSubmit: async (values) => {
      setIsBtnLoading(true)
      await BackendAxios.post(`/api/${aepsProvider}/aeps/${values.serviceCode}/${values.serviceId}`, values).then((res) => {
        setReceipt({
          show: true,
          status: res.data.metadata.status,
          data: res.data.metadata
        })
      }).catch((err) => {
        Toast({
          title: 'Transaction Failed',
          description: err.message,
          position: 'top-right',
        })
      })
      setIsBtnLoading(false)
    }
  })


  useEffect(() => {
    formik.values.serviceCode != "2" ? formik.setFieldValue("amount", "0") : null
    formik.values.serviceCode == "2" ? formik.setFieldValue("serviceId", "20") : null
  }, [formik.values.serviceCode])


  useEffect(() => {
    if (aepsProvider == "paysprint") {
      BackendAxios.get(`/api/${aepsProvider}/aeps/fetch-bank/${serviceCode}`).then(res => {
        setBanksList(res.data.banklist.data)
      }).catch(err => {
        Toast({
          status: 'error',
          description: err.message
        })
      })
    }
  }, [])
  const [pagination, setPagination] = useState({
    current_page: "1",
    total_pages: "1",
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: "",
  })
  const [rowData, setRowData] = useState([

  ])
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Trnxn ID",
      field: 'transaction_id'
    },
    {
      headerName: "Debit Amount",
      field: 'debit_amount'
    },
    {
      headerName: "Credit Amount",
      field: 'credit_amount'
    },
    {
      headerName: "Opening Balance",
      field: 'opening_balance'
    },
    {
      headerName: "Closing Balance",
      field: 'closing_balance'
    },
    {
      headerName: "Transaction Type",
      field: 'service_type'
    },
    {
      headerName: "Created Timestamp",
      field: 'created_at'
    },
    {
      headerName: "Updated Timestamp",
      field: 'updated_at'
    },
    {
      headerName: "Additional Info",
      field: 'metadata',
      defaultMinWidth: 300
    },
    {
      headerName: "Receipt",
      field: "receipt",
      pinned: 'right',
      cellRenderer: 'receiptCellRenderer'
    }
  ])

  function fetchTransactions(pageLink) {
    BackendAxios.get(pageLink || `/api/user/ledger/${transactionKeyword}?page=1`).then((res) => {
      setPagination({
        current_page: res.data.current_page,
        total_pages: parseInt(res.data.last_page),
        first_page_url: res.data.first_page_url,
        last_page_url: res.data.last_page_url,
        next_page_url: res.data.next_page_url,
        prev_page_url: res.data.prev_page_url,
      })
      setRowData(res.data.data)
    }).catch((err) => {
      console.log(err)
      Toast({
        status: 'error',
        description: err.response.data.message || err.response.data || err.message
      })
    })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])


  const pdfRef = React.createRef()
  const [receipt, setReceipt] = useState({
    show: false,
    status: "success",
    data: {}
  })
  const receiptCellRenderer = (params) => {
    function showReceipt() {
      if (!params.data.metadata) {
        Toast({
          description: 'No Receipt Available'
        })
        return
      }
      setReceipt({
        status: JSON.parse(params.data.metadata).status,
        show: true,
        data: JSON.parse(params.data.metadata)
      })
    }
    return (
      <HStack height={'full'} w={'full'} gap={4}>
        <Button rounded={'full'} colorScheme='twitter' size={'xs'} onClick={() => showReceipt()}><BsEye /></Button>
      </HStack>
    )
  }

  return (
    <>
      <DashboardWrapper titleText={'AePS Transaction'}>
        <Box my={4} w={['full', 'md', 'full']} p={6} boxShadow={'md'} bg={'white'}>
          <FormControl w={'xs'} pb={8}>
            <FormLabel>Select Service</FormLabel>
            <Select name='serviceCode' value={formik.values.serviceCode} onChange={formik.handleChange}>
              <option value={'money-transfer'}>Cash Withdrawal</option>
              <option value={'balance-enquiry'}>Balance Inquiry</option>
              <option value={'mini-statement'}>Mini Statement</option>
            </Select>
          </FormControl>

          <FormControl pb={6}>
            <FormLabel>Choose Device</FormLabel>
            <RadioGroup name={'rdDevice'} value={biometricDevice} onChange={(value) => setBiometricDevice(value)}>
              <Stack direction={['column', 'row']} spacing={4}>
                <Radio value='mantra'>Mantra</Radio>
                <Radio value='morpho'>Morpho</Radio>
                <Radio value='secugen'>Secugen</Radio>
                <Radio value='startek'>Startek</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Cash Withdrawal Form */}
          {
            formik.values.serviceCode == "money-transfer" ? <>
              <FormControl w={'full'} pb={6}>
                <FormLabel>Select Bank</FormLabel>
                <Select name='bankCode'
                  value={formik.values.bankCode}
                  onChange={formik.handleChange} w={'xs'}
                >
                  {
                    aepsProvider == "eko" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.id}>{bank.bankName}</option>
                    ))
                  }
                  {
                    aepsProvider == "paysprint" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.iinno}>{bank.bankName}</option>
                    ))
                  }
                </Select>
                <HStack spacing={2} py={2}>

                  <Button
                    fontSize={'xs'}
                    value={"SBIN"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >State Bank of India</Button>

                  <Button
                    fontSize={'xs'}
                    value={"pnb"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >Punjab National Bank</Button>

                  <Button
                    fontSize={'xs'}
                    value={"yb"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >Yes Bank</Button>

                </HStack>
              </FormControl>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number / VID</FormLabel>
                  <Input name='aadhaarNo' placeholder='Aadhaar Number or VID' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                  <HStack py={2}>
                    <Checkbox name={'isVID'}>It is a VID</Checkbox>
                  </HStack>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={"₹"} />
                    <Input name='amount' placeholder='Enter Amount' value={formik.values.amount} onChange={formik.handleChange} />
                  </InputGroup>
                  <HStack spacing={2} py={2}>

                    <Button
                      fontSize={'xs'}
                      value={1000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >1000</Button>

                    <Button
                      fontSize={'xs'}
                      value={2000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >2000</Button>

                    <Button
                      fontSize={'xs'}
                      value={5000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >5000</Button>

                  </HStack>
                </FormControl>
              </Stack>
            </> : null
          }

          {/* Balance Enquiry Form */}
          {
            formik.values.serviceCode == "balance-enquiry" ? <>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <Input name='aadhaarNo' placeholder='Customer Aadhaar Number' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Select Bank</FormLabel>
                  <Select name='bankCode' value={formik.values.bankCode} onChange={formik.handleChange}>

                  {
                    aepsProvider == "eko" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.id}>{bank.bankName}</option>
                    ))
                  }
                  {
                    aepsProvider == "paysprint" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.iinno}>{bank.bankName}</option>
                    ))
                  }
                  </Select>
                </FormControl>
              </Stack>
            </> : null
          }

          {/* Mini Statement Form */}
          {
            formik.values.serviceCode == "mini-statement" ? <>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <Input name='aadhaarNo' placeholder='Customer Aadhaar Number' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Select Bank</FormLabel>
                  <Select name='bankCode' value={formik.values.bankCode} onChange={formik.handleChange}>

                  {
                    aepsProvider == "eko" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.id}>{bank.bankName}</option>
                    ))
                  }
                  {
                    aepsProvider == "paysprint" &&
                    banksList.map((bank, key) => (
                      aepsProvider == "paysprint" &&
                      <option key={key} value={bank.iinno}>{bank.bankName}</option>
                    ))
                  }
                  </Select>
                </FormControl>
              </Stack>
            </> : null
          }

          <Button colorScheme={'twitter'} onClick={() => getMantra()} isLoading={isBtnLoading}>Submit</Button>
        </Box>

        <Text my={8}>Your Recent Transactions</Text>
        <Box py={6}>
          <Text fontWeight={'medium'} pb={4}>Recent Transfers</Text>
          <Box className='ag-theme-alpine' w={'full'} h={['sm', 'xs']}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              components={{
                'receiptCellRenderer': receiptCellRenderer
              }}
            >

            </AgGridReact>
          </Box>
        </Box>
      </DashboardWrapper>

      {/* Receipt */}
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
                <Text color={'#FFF'} textTransform={'capitalize'}>Transaction {receipt.status ? "success" : "failed"}</Text>
              </VStack>
            </ModalHeader>
            <ModalBody p={0} bg={'azure'}>
              <VStack w={'full'} p={4} bg={'#FFF'}>
                {
                  receipt.data ?
                    Object.entries(receipt.data).map((item, key) => (
                      <HStack
                        justifyContent={'space-between'}
                        gap={8} pb={4} w={'full'} key={key}
                      >
                        <Text fontSize={14}
                          fontWeight={'medium'}
                          textTransform={'capitalize'}
                        >{item[0]}</Text>
                        <Text fontSize={14} >{`${item[1]}`}</Text>
                      </HStack>
                    )) : null
                }
              </VStack>
            </ModalBody>
          </Box>
          <ModalFooter>
            <HStack justifyContent={'center'} gap={8}>

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

export default Aeps