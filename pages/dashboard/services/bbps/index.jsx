import React, { useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import { useRouter } from 'next/router'
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
import { FaMobile } from 'react-icons/fa'
import { useFormik } from 'formik'


const Bbps = () => {
  const Router = useRouter()
  const [service, setService] = useState({
    name: "",
    id: "",
  })

  const formik = useFormik({
    initialValues: {
      category: "",
      operator: "",
    }
  })

  const services = [
    {
      title: "Broadband Postpaid",
      icon: <HiServerStack />,
      id: "1"
    },
    {
      title: "Mobile Prepaid",
      icon: <FaMobile />,
      id: "2"
    }
  ]
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
            w={['full', 'xs']}
            alignItems={['flex-start']}
            justifyContent={['flex-start']}
            spacing={0} borderRightColor={['unset','#999']} 
            borderBottomColor={['#999','unset']}
            borderRight={[0, '1px']} borderBottom={['1px', 0]}
          >
            <Text p={4} pb={2}>Select Category</Text>
            {
              services.map((item, key) => {
                return (
                  <Stack w={['full']}
                    p={4} _hover={{ bg: "aqua" }}
                    direction={['column', 'row']}
                    spacing={2} key={key} alignItems={'center'}
                    cursor={'pointer'} onClick={()=>formik.setFieldValue("category", item.id)}
                  >
                    {item.icon}
                    <Text>{item.title}</Text>
                  </Stack>
                )
              })
            }
          </VStack>
          <Box p={4}>
            <FormControl id={'operator'}>
              <FormLabel>Select Operator</FormLabel>
              <Select 
              name={'operator'} w={['full', 'xs']}
              value={formik.values.operator} 
              onChange={formik.handleChange}
              >
                <option value="airtel">Airtel</option>
                <option value="vi">Vodafone Idea</option>
                <option value="jio">Jio</option>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </DashboardWrapper>
    </>
  )
}

export default Bbps