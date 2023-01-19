import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Stack,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useToast,
} from '@chakra-ui/react'
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {
  Line
} from 'react-chartjs-2'
import { GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { FaMobile, FaMoneyBillAlt } from 'react-icons/fa'
import DataCard from '../../hocs/DataCard'
import SimpleAccordion from '../../hocs/SimpleAccordion'
import DashboardWrapper from '../../hocs/DashboardLayout'
import axios from '../../lib/axios'
import Link from 'next/link'

const Dashboard = () => {
  const [newNotification, setNewNotification] = useState(true)
  const [notifications, setNotifications] = useState([
    {
      title: "Under Maintainence",
      content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque pariatur aut eos quae quisquam eveniet incidunt ad odio magni at."
    }
  ])
  let isProfileComplete
  const [profileAlert, setProfileAlert] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    isProfileComplete = (localStorage.getItem("isProfileComplete")==="true")
    if (!isProfileComplete) {
      setProfileAlert(true)
      console.log("Profile InComplete")
    }

    // Check for new notifications


  }, [])

  // ChartJS Configuration
  ChartJs.register(LineElement, Tooltip, Legend, Filler, PointElement, CategoryScale, LinearScale)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May'];

  // Sample Data for AePS Transactions
  const aepsData = [
    1200,
    2500,
    1100,
    800,
    1500,
  ]


  // Sample Data for DMT Transactions
  const dmtData = [
    3200,
    1500,
    8100,
    1200,
    1300,
  ]


  // Sample Data for Mobile Recharge
  const rechargeData = [
    867,
    1300,
    1800,
    912,
    1678,
  ]

  const chartData = {
    labels,
    datasets: [
      {
        label: "AePS",
        data: aepsData,
        borderColor: '#FF7B54',
        backgroundColor: '#FF7B54',
      },
      {
        label: "DMT",
        data: dmtData,
        borderColor: '#6C00FF',
        backgroundColor: '#6C00FF',
      },
      {
        label: "Mob. Recharge",
        data: rechargeData,
        borderColor: '#FFB100',
        backgroundColor: '#FFB100',
      },
    ]
  }


  return (
    <>
      <DashboardWrapper titleText='Dashboard'>
        <Stack direction={['row']}
          w={'full'} py={8} spacing={[0, 4]}
          justifyContent={'space-between'}
          flexWrap={'wrap'} alignItems={['flex-start']}
        >
          <DataCard
            title={'AePS Transactions'}
            data={5600}
            icon={<GiReceiveMoney color='white' size={'32'} />}
            color={'#FF7B54'}
          />
          <DataCard
            title={'DMT Transactions'}
            data={5200}
            icon={<FaMoneyBillAlt color='white' size={'32'} />}
            color={'#6C00FF'}
          />
          <DataCard
            title={'Mobile Recharge'}
            data={4800}
            icon={<FaMobile color='white' size={'32'} />}
            color={'#FFB100'}
          />
          <DataCard
            title={'Your Earnings'}
            data={1800}
            icon={<GiTakeMyMoney color='white' size={'32'} />}
            color={'#88A47C'}
          />
        </Stack>


        <Stack
          direction={['column-reverse', 'row']}
          justifyContent={['flex-start', 'space-between']}
        >
          <Box
            w={['full', 'md', 'xl']}
            p={4} rounded={12}
            bg={'white'}
            boxShadow={'md'}
          >
            <Text mb={2}>Recent Transactions</Text>
            <Line
              width={'inherit'}
              data={chartData}
              options={options}
            />
          </Box>
          <Box
            w={['full', 'md']}
            p={4} rounded={12}
            bg={'white'}
            boxShadow={'md'}
          >
            <Text mb={4}>New Notifications</Text>
            {newNotification ? (
              notifications.map((notification, key) =>
                <SimpleAccordion
                  key={key}
                  title={notification.title}
                  content={notification.content}
                />
              )
            ) : <Box display={'grid'} placeContent={'center'}>No new notifications</Box>}
          </Box>
        </Stack>

        {/* Profile Incompletion Alert */}
        <Modal isOpen={profileAlert} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Incomplete Profile</ModalHeader>
            <ModalBody>
              Your profile is incomplete. Please complete your profile to start using our services.
            </ModalBody>

            <ModalFooter>
              <Link href={'/dashboard/profile/edit'}>
                <Button colorScheme='blue' mr={3}>
                  Complete Now
                </Button>
              </Link>
              <Button variant='ghost' onClick={() => setProfileAlert(false)}>Finish Later</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardWrapper>
    </>
  )
}

export default Dashboard