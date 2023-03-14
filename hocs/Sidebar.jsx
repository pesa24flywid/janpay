import React, { useEffect, useState } from "react";
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
import axios from "../lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { BsFileEarmarkBarGraph, BsBank, BsPeopleFill } from "react-icons/bs";
import { GiReceiveMoney } from 'react-icons/gi'
import { HiUsers } from 'react-icons/hi'
import BankDetails from "./BankDetails";


export const SidebarOptions = [
  {
    type: 'accordion',
    title: 'profile',
    icon: <BiUser />,
    children: [
      {
        title: 'view profile',
        link: '/dashboard/profile?pageId=profile',
      },
      {
        title: 'reset MPIN',
        link: '/dashboard/profile/reset-mpin?pageId=profile',
      },
      {
        title: 'reset password',
        link: '/dashboard/profile/reset-password?pageId=profile',
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
        soon: false,
      },
      {
        title: 'AePS services',
        link: '/dashboard/services/aeps?pageId=services',
        soon: false,
      },
      {
        title: 'DMT services',
        link: '/dashboard/services/dmt?pageId=services',
        soon: false,
      },
      {
        title: 'BBPS services',
        link: '/dashboard/services/bbps?pageId=services',
        soon: false,
      },
      {
        title: 'recharge',
        link: '/dashboard/services/recharge?pageId=services',
        soon: false,
      },
      {
        title: 'payout',
        link: '/dashboard/services/payout?pageId=services',
        soon: false,
      },
      {
        title: 'axis account opening',
        link: '/dashboard/services/payout?pageId=services',
        soon: true,
      },
      {
        title: 'LIC services',
        link: '/dashboard/services/payout?pageId=services',
        soon: true,
      },
      {
        title: 'PAN services',
        link: '/dashboard/services/payout?pageId=services',
        soon: true,
      },
      {
        title: 'CMS services',
        link: '/dashboard/services/payout?pageId=services',
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
    title: 'fund settlement',
    id: 'request',
    icon: <BsBank />,
    link: '/dashboard/fund-request?pageId=request',
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
        soon: false,
      },
      {
        title: 'BBPS reports',
        link: '/dashboard/reports/bbps?pageId=reports',
        soon: false,
      },
      {
        title: 'recharge reports',
        link: '/dashboard/reports/recharge?pageId=reports',
        soon: false,
      },
      {
        title: 'DMT reports',
        link: '/dashboard/reports/dmt?pageId=reports',
        soon: false,
      },
      {
        title: 'payout reports',
        link: '/dashboard/reports/payout?pageId=reports',
        soon: false,
      },
      {
        title: 'LIC reports',
        link: '/dashboard/reports/lic?pageId=reports',
        soon: true,
      },
      {
        title: 'PAN reports',
        link: '/dashboard/reports/pan?pageId=reports',
        soon: true,
      },
      {
        title: 'CMS reports',
        link: '/dashboard/reports/pan?pageId=reports',
        soon: true,
      },
      {
        title: 'axis accounts',
        link: '/dashboard/reports/axis?pageId=reports',
        soon: true,
      },
    ]
  },
]

const Sidebar = ({ isProfileComplete, userName, userImage }) => {

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
    await axios.post("/logout").then(() => {
      Cookies.remove("verified")
    })
    Router.push("/auth/login")
  }
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
                              return (
                                <Link key={key} href={item.link} style={{ width: '100%' }}>
                                  <Text
                                    w={'full'} textAlign={'left'}
                                    px={3} py={2} _hover={{ bg: 'aqua' }}
                                    textTransform={'capitalize'}
                                  >{item.title}</Text>
                                </Link>
                              )
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
