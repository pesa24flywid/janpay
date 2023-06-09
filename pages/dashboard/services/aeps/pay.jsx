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
  ModalOverlay,
  Image
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Cookies from 'js-cookie'
import { BsCheck2Circle, BsClock, BsDownload, BsXCircle, BsEye } from 'react-icons/bs'
import Pdf from 'react-to-pdf'
import { toBlob } from 'html-to-image'

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
      if (!res.data[0].aeps_status) {
        window.location.href('/dashboard/not-available')
      }
    }).catch(err => {
      console.log(err)
    })

    ClientAxios.get(`/api/organisation`).then(res => {
      if (!res.data.aeps_status) {
        window.location.href('/dashboard/not-available')
      }
    }).catch(err => {
      console.log(err)
    })


  }, [])

  const [rdserviceFound, setRdserviceFound] = useState(false)
  const [rdservicePort, setRdservicePort] = useState(11101)

  let MethodInfo
  function getMantra(port) {
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
      url: primaryUrl + 11101,
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
      var XML = '<' + '?' + 'xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
      var finalUrl = "http://" + GetCustomDomName + ":" + port;
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

  function searchMantra(port) {

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
      url: primaryUrl + port,
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
          setRdserviceFound(true)
          setRdservicePort(port)
        }
        else {
          MantraFound = 0;
        }
      },
    })

    if (MantraFound != 1) {
      console.log('Mantra NOT Found at PORT ' + port)
    }
  }

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

  useEffect(() => {
    if (!rdserviceFound) {
      setRdservicePort(Number(rdservicePort) + 1)
      searchMantra(Number(rdservicePort))
    }
  }, [rdserviceFound])
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [biometricDevice, setBiometricDevice] = useState("")
  const [banksList, setBanksList] = useState([])
  const Toast = useToast({ position: 'top-right' })
  const formik = useFormik({
    initialValues: {
      aadhaarNo: "",
      customerId: "",
      bankCode: "",
      bankName: "",
      bankAccountNo: "",
      ifsc: "",
      serviceCode: "aadhaar-pay",         // Services Code as per service provider
      pid: "",
      amount: "",
      serviceId: "20", // Services ID as per Pesa24 Portal
      latlong: Cookies.get("latlong")
    },
    onSubmit: async (values) => {
      setIsBtnLoading(true)
      if (aepsProvider == "paysprint") {
        await BackendAxios.post(`/api/${aepsProvider}/aeps/${values.serviceCode}/${values.serviceId}`, values).then((res) => {
          setIsBtnLoading(false)
          // Toast({
          //   description: res.data[0].message,
          //   position: 'top-right'
          // })
          setReceipt({
            show: true,
            status: res.data.metadata.status,
            data: res.data.metadata
          })
          console.log(res.data)
        }).catch((err) => {
          setIsBtnLoading(false)
          Toast({
            status: 'warning',
            title: 'Transaction Failed',
            description: err.response.data.message || err.response.data || err.message,
            position: 'top-right',
          })
        })
      }
      setIsBtnLoading(false)
      fetchTransactions()
    }
  })


  useEffect(() => {
    formik.values.serviceCode != "2" ? formik.setFieldValue("amount", "0") : null
    formik.values.serviceCode == "2" ? formik.setFieldValue("serviceId", "20") : null
  }, [formik.values.serviceCode])

  useEffect(() => {
    if (aepsProvider == "paysprint") {
      BackendAxios.get(`/api/paysprint/aeps/fetch-bank/${serviceCode}`).then(res => {
        setBanksList(res.data.banklist.data)
      }).catch(err => {
        Toast({
          status: 'error',
          description: err.response?.data?.message || err.response?.data || err.message
        })
      })
    }
  }, [aepsProvider])

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
      hide: true
    },
    {
      headerName: "Receipt",
      field: "receipt",
      pinned: 'right',
      cellRenderer: 'receiptCellRenderer',
      width: 80
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
    function showReceipt(willShow) {
      if (!params.data.metadata) {
        Toast({
          description: 'No Receipt Available'
        })
        return
      }
      setReceipt({
        status: JSON.parse(params.data.metadata).status,
        show: willShow,
        data: JSON.parse(params.data.metadata)
      })
    }
    return (
      <HStack height={'full'} w={'full'} gap={4}>
        <Button rounded={'full'} colorScheme='twitter' size={'xs'} onClick={() => showReceipt(true)}><BsEye /></Button>
      </HStack>
    )
  }

  function handleBankSelection(params) {
    formik.setFieldValue("bankCode", params.split("_")[0])
    formik.setFieldValue("bankName", params.split("_")[1])
  }

  return (
    <>
      <DashboardWrapper titleText={'AePS Transaction'}>
        <Stack
          direction={['column', 'column', 'row']}
          gap={[16, 4]} alignItems={'flex-start'}
        >
          <Box w={['full', 'full', '2xl']} p={6} boxShadow={'md'} bg={'white'}>
            <FormControl w={'xs'} pb={8}>
              <FormLabel>Select Service</FormLabel>
              <Select name='serviceCode' value={formik.values.serviceCode} onChange={formik.handleChange}>
                <option value={'aadhaar-pay'}>Aadhaar Pay</option>
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

            {/* Aadhaar Pay Form */}
            <FormControl w={'full'} pb={6}>
              <FormLabel>Select Bank</FormLabel>
              <Select name='bankCode'
                value={`${formik.values.bankCode}_${formik.values.bankName}`}
                onChange={e => handleBankSelection(e.target.value)} w={'xs'}
              >
                {
                  aepsProvider == "eko" &&
                  banksList.map((bank, key) => (
                    <option key={key} value={`${bank.value}_${bank.label}`}>{bank.label}</option>
                  ))
                }
                {
                  aepsProvider == "paysprint" &&
                  banksList.map((bank, key) => (
                    <option key={key} value={`${bank.iinno}_${bank.bankName}`}>{bank.bankName}</option>
                  ))
                }
              </Select>
              {/* <HStack spacing={2} py={2}>

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

            </HStack> */}
            </FormControl>
            <Stack direction={['column', 'row']} spacing={6} pb={6}>
              <FormControl w={'full'}>
                <FormLabel>Aadhaar Number</FormLabel>
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

            <Button colorScheme={'twitter'} onClick={() => getMantra(rdservicePort)} isLoading={isBtnLoading}>Submit</Button>
          </Box>

          <Box w={['full', 'full', 'sm']}>
            <Text fontWeight={'medium'} pb={4}>Recent Transactions</Text>
            <Box className='ag-theme-alpine ag-theme-pesa24-blue' rounded={16} overflow={'hidden'} w={'full'} h={['sm', 'xs']}>
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
        </Stack>
      </DashboardWrapper>


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
                <Text color={'#FFF'} textTransform={'uppercase'}>Transaction {receipt.status ? "success" : "failed"}</Text>
              </VStack>
            </ModalHeader>
            <ModalBody p={0} bg={'azure'}>
              <VStack w={'full'} spacing={0} p={4} bg={'#FFF'}>
                {
                  receipt.data ?
                    Object.entries(receipt.data).map((item, key) => {
                      //if (aepsProvider == 'eko')
                      if (
                        item[0].toLowerCase() != "status" &&
                        item[0].toLowerCase() != "customer_balance" &&
                        item[0].toLowerCase() != "user_name" &&
                        item[0].toLowerCase() != "user_id" &&
                        item[0].toLowerCase() != "amount" &&
                        item[0].toLowerCase() != "ministatement" &&
                        item[0].toLowerCase() != "user_phone"
                      ) {
                        return (
                          <HStack
                            justifyContent={'space-between'}
                            gap={8} pb={1} w={'full'} key={key}
                            p={2} borderWidth={'1px'}
                          >
                            <Text fontSize={'xs'}
                              fontWeight={'medium'}
                              textTransform={'capitalize'}
                            >{item[0].replace(/_/g, " ")}</Text>
                            <Text fontSize={'xs'} >{`${item[1]}`}</Text>
                          </HStack>
                        )
                      }
                    }) : null
                }
                <VStack pt={8} w={'full'} spacing={0}>
                  <HStack borderWidth={'1px'} pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user_name}</Text>
                  </HStack>
                  <HStack borderWidth={'1px'} pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant ID:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user_id}</Text>
                  </HStack>
                  <HStack borderWidth={'1px'} pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant Mobile:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user_phone}</Text>
                  </HStack>
                  <Image pt={4} src='/logo_long.png' w={'20'} />
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

export default Aeps