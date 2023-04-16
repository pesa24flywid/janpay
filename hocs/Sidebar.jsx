import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Box,
  HStack,
  VStack,
  Image,
  Text,
  Hide,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { BiRupee, BiUser, BiPowerOff } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import { IoMdHelpBuoy } from "react-icons/io";
import BackendAxios from "../lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BsFileEarmarkBarGraph, BsBank, BsPeopleFill } from "react-icons/bs";
import { GiReceiveMoney } from 'react-icons/gi'
import { FaShare } from 'react-icons/fa'
import BankDetails from "./BankDetails";


export const SidebarOptions =
  [
    {
      type: 'accordion',
      title: 'profile',
      icon: <BiUser />,
      children: [
        {
          title: 'view profile',
          link: '/dashboard/profile?pageId=profile',
          id: "view-profile",
          soon: false,
        },
        {
          title: 'edit profile',
          link: '/dashboard/profile/edit?pageId=profile',
          id: "edit-profile",
          soon: false,
        },
        {
          title: 'reset MPIN',
          link: '/dashboard/profile/reset-mpin?pageId=profile',
          id: "reset-mpin",
          soon: false,
        },
        {
          title: 'reset password',
          link: '/dashboard/profile/reset-password?pageId=profile',
          id: "reset-password",
          soon: false,
        },
      ]
    },
    {
      type: 'link',
      title: 'dashboard',
      icon: <VscDashboard />,
      link: '/dashboard?pageId=dashboard',
    },
    {
      type: 'accordion',
      title: 'services',
      icon: <BiRupee />,
      children: [
        {
          title: 'Activate services',
          link: '/dashboard/services/activate?pageId=services',
          id: "activate",
          soon: false,
        },
        {
          title: 'AePS services',
          link: '/dashboard/services/aeps?pageId=services',
          id: "aeps",
          soon: true,
        },
        {
          title: 'DMT services',
          link: '/dashboard/services/dmt?pageId=services',
          id: "dmt",
          soon: false,
        },
        {
          title: 'BBPS services',
          link: '/dashboard/services/bbps?pageId=services',
          id: "bbps",
          soon: true,
        },
        {
          title: 'recharge',
          link: '/dashboard/services/recharge?pageId=services',
          id: "recharge",
          soon: false,
        },
        {
          title: 'payout',
          link: '/dashboard/services/payout?pageId=services',
          id: "payout",
          soon: false,
        },
        {
          title: 'axis account opening',
          link: '/dashboard/services/payout?pageId=services',
          id: "axis",
          soon: true,
        },
        {
          title: 'LIC services',
          link: '/dashboard/services/payout?pageId=services',
          id: "lic",
          soon: true,
        },
        {
          title: 'PAN services',
          link: '/dashboard/services/payout?pageId=services',
          id: "pan",
          soon: true,
        },
        {
          title: 'CMS services',
          link: '/dashboard/services/payout?pageId=services',
          id: "cms",
          soon: true,
        },
      ]
    },
    {
      type: 'link',
      title: 'fund request',
      id: 'request',
      icon: <GiReceiveMoney />,
      link: '/dashboard/fund-request?pageId=request',
    },
    {
      type: 'link',
      title: 'fund transfer',
      id: 'transfer',
      icon: <FaShare />,
      link: '/dashboard/fund-transfer?pageId=transfer',
    },
    {
      type: 'link',
      title: 'fund settlement',
      id: 'settlement',
      icon: <BsBank />,
      link: '/dashboard/fund-settlement?pageId=settlement',
    },
    {
      type: 'accordion',
      title: 'reports',
      id: 'reports',
      icon: <BsFileEarmarkBarGraph />,
      children: [
        {
          title: 'AePS reports',
          link: '/dashboard/reports/aeps?pageId=reports',
          id: "aepsReports",
          soon: true,
        },
        {
          title: 'BBPS reports',
          link: '/dashboard/reports/bbps?pageId=reports',
          id: "bbpsReports",
          soon: true,
        },
        {
          title: 'recharge reports',
          link: '/dashboard/reports/recharge?pageId=reports',
          id: "rechargeReports",
          soon: false,
        },
        {
          title: 'DMT reports',
          link: '/dashboard/reports/dmt?pageId=reports',
          id: "dmtReports",
          soon: false,
        },
        {
          title: 'payout reports',
          link: '/dashboard/reports/payout?pageId=reports',
          id: "payoutReports",
          soon: false,
        },
        {
          title: 'LIC reports',
          link: '/dashboard/reports/lic?pageId=reports',
          id: "licReports",
          soon: true,
        },
        {
          title: 'PAN reports',
          link: '/dashboard/reports/pan?pageId=reports',
          id: "panReports",
          soon: true,
        },
        {
          title: 'CMS reports',
          link: '/dashboard/reports/pan?pageId=reports',
          id: "cmsReports",
          soon: true,
        },
        {
          title: 'axis accounts',
          link: '/dashboard/reports/axis?pageId=reports',
          id: "axisReports",
          soon: true,
        },
        {
          title: 'Transaction Ledger',
          link: '/dashboard/reports/transactions/ledger?pageId=reports',
          id: "axisReports",
          soon: false,
        },
        {
          title: 'Daily Sales',
          link: '/dashboard/reports/axis?pageId=reports',
          id: "axisReports",
          soon: false,
        },
      ]
    },
    {
      type: 'link',
      title: 'support tickets',
      id: 'support',
      icon: <IoMdHelpBuoy />,
      link: '/dashboard/support-tickets?pageId=support',
    },
  ]

const Sidebar = ({ isProfileComplete, userName, userImage, availablePages }) => {
  const [activeServices, setActiveServices] = useState([])
  const Router = useRouter()
  const { pageId } = Router.query
  const [userType, setUserType] = useState("")

  useEffect(() => {
    const activePage = typeof window !== 'undefined' ? document.getElementById(pageId) : document.getElementById("dashboard")
    if (activePage) {
      activePage.style.background = "#3C79F5"
      activePage.style.color = "#FFF"
    }

    setUserType(localStorage.getItem("userType"))
  }, [])

  async function signout() {
    await BackendAxios.post("/logout").then(() => {
      Cookies.remove("verified")
    })
    Router.push("/auth/login")
  }


  useMemo(() => {
    BackendAxios.get('/api/user/services').then((res) => {
      setActiveServices(res.data.map((item) => item.type))
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <>
      <Hide below={"md"}>
        <VStack
          className={"sidebar"}
          w={"64"}
          boxShadow={"md"}
          h={"100vh"}
          bg={"white"}
          p={4}
          rounded={"12"}
          border={"1px"}
          borderColor={"gray.300"}
          overflowY={"scroll"}
        >
          {/* Sidebar Profile */}

          <Link href={"/dashboard/profile?pageId=profile"}>
            <VStack spacing={2}>
              <Image
                src={userImage}
                w={"24"}
                rounded={"full"}
                mx={"auto"}
                p={1}
                border={"2px"}
                borderColor={"gray.200"}
              />
              <Text fontSize={"xl"}>{userName}</Text>
              <Text
                fontSize={"sm"}
                color={"darkslategray"}
                textTransform={'capitalize'}
              >{userType.replace("_", " ")}</Text>
            </VStack>
          </Link>

          {/* Sidebar Menu Options */}
          <VStack pt={8} w={"full"} spacing={4}>
            {
              SidebarOptions.map((option, key) => {
                if (option.type == 'link') {
                  return (
                    <Link href={option.link} key={key} style={{ width: "100%" }}>
                      <HStack
                        px={3}
                        py={2}
                        rounded={'full'}
                        overflow={'hidden'}
                        _hover={{ bg: 'aqua' }}
                        id={option.id || option.title}
                      >
                        {option.icon}
                        <Text textTransform={'capitalize'}>{option.title}</Text>
                      </HStack>
                    </Link>
                  )
                }

                if (option.type == 'accordion') {
                  return (
                    <Accordion allowToggle w={'full'}>

                      <AccordionItem>
                        <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                          <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                            {option.icon}
                            <Text textTransform={'capitalize'}>{option.title}</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel px={0}>


                          <VStack
                            w={'full'}
                            alignItems={'flex-start'}
                            justifyContent={'flex-start'}
                            spacing={2}
                            overflow={'hidden'}
                            id={'payout'}
                          >

                            {option.children.map((item, key) => {
                              if (availablePages.includes(item.id) != null) {
                                return (
                                  <Box
                                  px={3} py={2} w={'full'}
                                  _hover={{ bg: 'aqua' }}
                                  >
                                    <Link key={key} href={item.soon ? "#" : item.link}
                                      style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        gap: '4px'
                                      }}>
                                      <Text
                                        textAlign={'left'}
                                        textTransform={'capitalize'}
                                      >{item.title}</Text>
                                      {
                                        item.soon &&
                                        <Text fontSize={8} p={1} bg={'yellow.100'} color={'yellow.900'}>Coming Soon</Text>
                                      }
                                    </Link>
                                  </Box>
                                )
                              }
                              else {
                                return (
                                  <Link key={key} href={item.link} style={{ width: '100%' }}>
                                    <Text
                                      w={'full'} textAlign={'left'}
                                      px={3} py={2} _hover={{ bg: 'aqua' }}
                                      textTransform={'capitalize'}
                                    >{item.title}</Text>
                                  </Link>
                                )
                              }
                            })}
                          </VStack>

                        </AccordionPanel>

                      </AccordionItem>

                    </Accordion>
                  )

                }
              })
            }

            {
              userType != "retailer" &&

              <Accordion allowToggle w={'full'}>

                <AccordionItem>
                  <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                    <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                      <BsPeopleFill />
                      <Text textTransform={'capitalize'}>Manage Users</Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel px={0}>


                    <VStack
                      w={'full'}
                      alignItems={'flex-start'}
                      justifyContent={'flex-start'}
                      spacing={2}
                      overflow={'hidden'}
                      id={'users'}
                    >
                      <Link href={"/dashboard/users/create-user?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >Create User</Text>
                      </Link>

                      <Link href={"/dashboard/users/users-list?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >View User</Text>
                      </Link>

                      <Link href={"/dashboard/users/users-report?pageId=users"} style={{ width: '100%' }}>
                        <Text
                          w={'full'} textAlign={'left'}
                          px={3} py={2} _hover={{ bg: 'aqua' }}
                          textTransform={'capitalize'}
                        >Users Report</Text>
                      </Link>

                    </VStack>

                  </AccordionPanel>

                </AccordionItem>

              </Accordion>
            }


            <HStack
              spacing={2}
              w={"full"}
              borderRadius={"full"}
              px={3}
              py={2}
              bg={'red.400'}
              color={"white"}
              onClick={signout}
              cursor={'pointer'}
            >
              <BiPowerOff />
              <Text>Sign Out</Text>
            </HStack>

            <BankDetails />
          </VStack>
        </VStack>
      </Hide>
    </>
  );
};

export default Sidebar;
