import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react'
import axios from '../../../../lib/axios'
import { ServiceCard } from '../../../../hocs/DataCard'

const Aeps = () => {
  const Toast = useToast()
  const [operatorCategories, setOperatorCategories] = useState([])

  // Getting operator categories from the backend
  useEffect(() => {
    setOperatorCategories([
      'Broadband Postpaid',
      'Mobile Postpaid',
      'Mobile Prepaid',
      'Electricity',
      'Clubs and Associations',
    ])
  }, [])

  return (
    <>
      <DashboardWrapper titleText={'BBPS Transaction'}>
        <Text py={4}>Choose any one</Text>
        <Stack direction={'row'} flexWrap={'wrap'} alignItems={'flex-start'} justifyContent={['flex-start', 'center']}>
          {
            operatorCategories.map((item, key) => {
              return (
                <ServiceCard
                  text={item}
                  key={key}
                  url={`/dashboard/services/bbps/pay?pageId=bbps&serviceId=${key}&serviceName=${item}`}
                />
              )
            })
          }
        </Stack>

      </DashboardWrapper>
    </>
  )
}

export default Aeps