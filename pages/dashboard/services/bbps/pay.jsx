import React from 'react'
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

const Pay = () => {
    const Router = useRouter()
    const { serviceName, serviceId } = Router.query
  return (
    <>
        <DashboardWrapper titleText={'BBPS Transaction'}>
            <Box 
            w={'full'} bg={'white'} 
            boxShadow={'md'} mt={6}
            p={6} rounded={12}
            >
                <Text fontSize={'lg'}>BBPS <span style={{textTransform: 'capitalize'}}>{serviceName}</span></Text>
                <FormControl id={'operator'}>
                  <FormLabel>Select Operator</FormLabel>
                  <Select>
                    
                  </Select>
                </FormControl>
            </Box>
        </DashboardWrapper>
    </>
  )
}

export default Pay