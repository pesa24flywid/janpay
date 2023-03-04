import React, { useState, useEffect, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { HiServerStack } from 'react-icons/hi2'
import { GiRotaryPhone, GiMoneyStack } from 'react-icons/gi'
import { GoMortarBoard } from 'react-icons/go'
import {
  BsCreditCardFill,
  BsLightningChargeFill,
  BsDropletFill,
  BsHouseDoorFill,
  BsEmojiSmileFill,
} from 'react-icons/bs'
import { AiFillFire } from 'react-icons/ai'
import { FiMonitor } from 'react-icons/fi'
import {
  FaMobile,
  FaSatelliteDish,
  FaMoneyBillAlt,
  FaUsers,
  FaHeart,
  FaCar,
  FaCity,
} from 'react-icons/fa'
import { BiRupee } from 'react-icons/bi'
import { useFormik } from 'formik'
import axios from '../../../../lib/axios'
import { FormAxios } from '../../../../lib/axios'
import Cookies from 'js-cookie'


const Bbps = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

  const [operators, setOperators] = useState()
  const [operatorListDisabled, setOperatorListDisabled] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState()

  const [operatorParams, setOperatorParams] = useState()

  const [fetchBillBtn, setFetchBillBtn] = useState(false)

  const formRef = useRef()


  const [latlong, setLatlong] = useState("")


  // Fetch all available categories
  useEffect(() => {
    axios.get("api/eko/bbps/operators/categories").then((res) => {
      setCategories(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  useEffect(()=>{
    setLatlong(Cookies.get("latlong"))
    console.log(latlong)
  })


  function fetchOperators(category_id) {
    setSelectedOperator(null)
    setOperatorParams()
    axios.get(`api/eko/bbps/operators/${category_id}`).then((res) => {
      setOperators(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  function fetchParams(operator_id) {
    axios.get(`api/eko/bbps/operators/fields/${operator_id}`).then((res) => {
      setSelectedOperator(operator_id)
      setOperatorParams(res.data.data)
      res.data.fetchBill == 1 ? setFetchBillBtn(true) : setFetchBillBtn(false)
    }).catch((err) => {
      console.log(err)
    })
  }

  function fetchBill() {
    let formData = new FormData(document.getElementById('bbpsForm'))
    FormAxios.post("api/eko/bbps/fetch-bill",
      formData
    )
  }

  return (
    <>
      <DashboardWrapper titleText={'BBPS Transaction'}>
        <Stack
          w={'full'} bg={'white'}
          boxShadow={'md'} mt={6}
          rounded={12}
          direction={['column', 'row']}
        >
          <VStack
            w={['full', 'xs']} h={['sm', 'xl']}
            overflowY={['scroll']}
            alignItems={['flex-start']}
            justifyContent={['flex-start']}
            spacing={0} borderRightColor={['unset', '#999']}
            borderBottomColor={['#999', 'unset']}
            borderRight={[0, '1px']} borderBottom={['1px', 0]}
          >
            <Text p={4} pb={2}>Select Category</Text>
            {
              categories.map((item, key) => {

                return (
                  item.status == "1" ?
                    <Stack w={['full']}
                      px={4} py={[3, 4]}
                      _hover={{ bg: "aqua" }}
                      direction={['row']}
                      spacing={2} key={key} alignItems={'center'}
                      cursor={'pointer'} onClick={() => fetchOperators(item.operator_category_id)}
                    >
                      {
                        item.operator_category_name.includes("Mobile")
                          ? <FaMobile /> :
                          item.operator_category_name.includes("Broadband")
                            ? <HiServerStack /> :
                            item.operator_category_name.includes("Gas") || item.operator_category_name.includes("LPG")
                              ? <AiFillFire /> :
                              item.operator_category_name.includes("DTH")
                                ? <FaSatelliteDish /> :
                                item.operator_category_name.includes("Card")
                                  ? <BsCreditCardFill /> :
                                  item.operator_category_name.includes("Electricity")
                                    ? <BsLightningChargeFill /> :
                                    item.operator_category_name.includes("Landline")
                                      ? <GiRotaryPhone /> :
                                      item.operator_category_name.includes("Water")
                                        ? <BsDropletFill /> :
                                        item.operator_category_name.includes("Housing") || item.operator_category_name.includes("Rental")
                                          ? <BsHouseDoorFill /> :
                                          item.operator_category_name.includes("Education")
                                            ? <GoMortarBoard /> :
                                            item.operator_category_name.includes("Tax")
                                              ? <BiRupee /> :
                                              item.operator_category_name.includes("Associations")
                                                ? <FaUsers /> :
                                                item.operator_category_name.includes("TV")
                                                  ? <FiMonitor /> :
                                                  item.operator_category_name.includes("Hospital") || item.operator_category_name.includes("Donation")
                                                    ? <FaHeart /> :
                                                    item.operator_category_name.includes("Insurance")
                                                      ? <BsEmojiSmileFill /> :
                                                      item.operator_category_name.includes("Loan")
                                                        ? <GiMoneyStack /> :
                                                        item.operator_category_name.includes("FASTag")
                                                          ? <FaCar /> :
                                                          item.operator_category_name.includes("Municipal Services")
                                                            ? <FaCity /> :
                                                            item.operator_category_name.includes("Subscription")
                                                              ? <FaMoneyBillAlt /> : null
                      }
                      <Text textTransform={'capitalize'}>{item.operator_category_name}</Text>
                    </Stack> : null
                )
              })
            }
          </VStack>
          <Box p={4}>

            {
              operators ?
                <FormControl id={'operator'}>
                  <FormLabel>Select Operator</FormLabel>
                  <Select
                    name={'operator'} w={['full', 'xs']}
                    value={selectedOperator}
                    onChange={(e) => fetchParams(e.target.value)}
                  >
                    {
                      operators.map((operator) => {
                        return (
                          <option value={operator.operator_id}>{operator.name}</option>
                        )
                      })
                    }
                  </Select>
                </FormControl> : null
            }


            {
              operatorParams ?
                <form action="" method='POST' ref={formRef} id={'bbpsForm'}>
                  <input type="hidden" name="operator_id" value={selectedOperator} />
                  <Stack
                    my={6}
                    direction={['column']}
                    spacing={6}
                  >
                    {
                      operatorParams.map((parameter, key) => {

                        {

                          if (parameter.param_type == "Numeric") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label}</FormLabel>
                                <Input type={'number'} pattern={parameter.regex} name={parameter.param_name} />
                              </FormControl>
                            )
                          }

                          if (parameter.param_type == "AlphaNumeric") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label}</FormLabel>
                                <Input type={'text'} pattern={parameter.regex} name={parameter.param_name} />
                              </FormControl>
                            )
                          }

                          if (parameter.param_type == "List") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label}</FormLabel>
                                <Select name={parameter.param_name}>
                                  <option value="1">Option 1</option>
                                  <option value="2">Option 2</option>
                                </Select>
                              </FormControl>
                            )
                          }

                        }

                      })
                    }

                    {
                      fetchBillBtn &&
                      <>
                        <FormControl id={'senderName'} w={['full', 'xs']} pb={6}>
                          <FormLabel>Sender Name</FormLabel>
                          <Input name='sender_name' />
                        </FormControl>
                        <FormControl id={'senderName'} w={['full', 'xs']} pb={6}>
                          <FormLabel>Confirmation Mobile Number</FormLabel>
                          <Input type={'tel'} maxLength={10} name='confirmation_mobile_no' />
                        </FormControl>
                        <input type="hidden" name='latlong' value={latlong} />
                      </>
                    }

                  </Stack>
                  {
                    fetchBillBtn ?
                      <Button colorScheme={'facebook'} onClick={() => fetchBill()}>Fetch Bill</Button> :
                      <Button colorScheme={'twitter'} type={'submit'}>Submit</Button>
                  }
                </form> : null
            }
          </Box>
        </Stack>
      </DashboardWrapper>
    </>
  )
}

export default Bbps