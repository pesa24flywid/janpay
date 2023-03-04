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
import { BsFileEarmarkBarGraph, BsBank } from "react-icons/bs";
import { GiReceiveMoney } from 'react-icons/gi'
import { HiUsers } from 'react-icons/hi'
import BankDetails from "./BankDetails";

export const ServicesAccordion = ({isProfileComplete}) => {
  const Router = useRouter()
  const { pageId } = Router.query

  useEffect(() => {
    const activePage = typeof window !== 'undefined' ? document.getElementById(pageId) : document.getElementById("dashboard")
    if (activePage) {
      activePage.style.background = "#3C79F5"
      activePage.style.color = "#FFF"
    }
  }, [])

  return (

    <Accordion defaultIndex={[0]} allowToggle w={'full'}>

      <AccordionItem isDisabled={isProfileComplete}>
        <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
          <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
            <BiRupee fontSize={'1.25rem'} />
            <Text>Services</Text>
          </HStack>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel px={0}>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'aeps'}
          >
            <Link href={'/dashboard/services/aeps?pageId=aeps'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>AePS Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'aadhaar-pay'}
          >
            <Link href={'/dashboard/services/aeps/pay?pageId=aadhaar-pay'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>Aadhaar Pay</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'dmt'}
          >
            <Link href={'/dashboard/services/dmt?pageId=dmt'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>DMT Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'payout'}
          >
            <Link href={'/dashboard/services/payout?pageId=payout'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>Payout</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'bbps'}
          >
            <Link href={'/dashboard/services/bbps?pageId=bbps'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>BBPS Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'recharge'}
          >
            <Link href={'/dashboard/services/recharge?pageId=recharge'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>Recharge Services</Text>
              
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'banking'}
          >
            <Link href={'/dashboard/services/banking?pageId=banking'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>Banking Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'pan'}
          >
            <Link href={'/dashboard/services/pan?pageId=pan'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>PAN Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'lic'}
          >
            <Link href={'/dashboard/services/lic?pageId=lic'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>LIC Services</Text>
            </Link>
          </VStack>

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2} rounded={'full'}
            overflow={'hidden'}
            id={'cms'}
          >
            <Link href={'/dashboard/services/cms?pageId=cms'} style={{ width: '100%' }}>
              <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>CMS Services</Text>
            </Link>
          </VStack>

        </AccordionPanel>

      </AccordionItem>

    </Accordion>
  )
}

const Sidebar = ({ isProfileComplete, userName, userType, userImage }) => {

  const Router = useRouter()
  
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
              <Text fontSize={"sm"} color={"darkslategray"}>{userType}</Text>
            </VStack>
          </Link>

          {/* Sidebar Menu Options */}
          <VStack pt={8} w={"full"} spacing={4}>
            <Link href={"/dashboard?pageId=dashboard"} style={{ width: "100%" }}>
              <HStack
                px={3}
                py={2}
                rounded={'full'}
                overflow={'hidden'}
                _hover={{ bg: 'aqua' }}
                id={'dashboard'}
              >
                <VscDashboard />
                <Text>Dashboard</Text>
              </HStack>
            </Link>

            <Link href={"/dashboard/profile?pageId=profile"} style={{ width: "100%" }}>
              <HStack
                spacing={2}
                w={"full"}
                borderRadius={"full"}
                px={3}
                py={2}
                color={"#333"}
                _hover={{ bg: "aqua" }}
                id={'profile'}
              >
                <BiUser />
                <Text>Profile</Text>
              </HStack>
            </Link>


            <ServicesAccordion />


            <Link href={"/dashboard/ledger?pageId=ledger"} style={{ width: "100%" }}>
              <HStack
                spacing={2}
                w={"full"}
                borderRadius={"full"}
                px={3}
                py={2}
                color={"#333"}
                _hover={{ bg: "aqua" }}
                id={'ledger'}
              >
                <BsFileEarmarkBarGraph />
                <Text>Ledger Reports</Text>
              </HStack>
            </Link>

            <Link href={"/dashboard/fund-request?pageId=fund-request"} style={{ width: "100%" }}>
              <HStack
                spacing={2}
                w={"full"}
                borderRadius={"full"}
                px={3}
                py={2}
                color={"#333"}
                _hover={{ bg: "aqua" }}
                id={'fund-request'}
              >
                <GiReceiveMoney />
                <Text>Fund Request</Text>
              </HStack>
            </Link>


            <Accordion defaultIndex={[0]} allowToggle w={'full'}>

              {/* Disable Accordion if profile is not completed */}
              <AccordionItem isDisabled={false}>
                <AccordionButton px={3} _expanded={{ bg: 'aqua' }}>
                  <HStack spacing={2} flex={1}>
                    <HiUsers fontSize={'1.125rem'} />
                    <Text>Members</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel px={0}>

                  <VStack
                    w={'full'}
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2} rounded={'full'}
                    overflow={'hidden'}
                    id={'create-user'}
                  >
                    <Link href={'/dashboard/distributor/create-user?pageId=create-user'} style={{ width: '100%' }}>
                      <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>Create User</Text>
                    </Link>
                  </VStack>

                  <VStack
                    w={'full'}
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2} rounded={'full'}
                    overflow={'hidden'}
                    id={'view-user'}
                  >
                    <Link href={'/dashboard/distributor/view-user?pageId=view-user'} style={{ width: '100%' }}>
                      <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>View User</Text>
                    </Link>
                  </VStack>

                  <VStack
                    w={'full'}
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2} rounded={'full'}
                    overflow={'hidden'}
                    id={'user-report'}
                  >
                    <Link href={'/dashboard/distributor/user-report?pageId=user-report'} style={{ width: '100%' }}>
                      <Text w={'full'} textAlign={'left'} px={3} py={2} _hover={{ bg: 'aqua' }}>User Report</Text>
                    </Link>
                  </VStack>

                </AccordionPanel>

              </AccordionItem>

            </Accordion>

            <Link href={"/dashboard/settlements?pageId=settlements"} style={{ width: "100%" }}>
              <HStack
                spacing={2}
                w={"full"}
                borderRadius={"full"}
                px={3}
                py={2}
                color={"#333"}
                _hover={{ bg: "aqua" }}
                id={'settlements'}
              >
                <BsBank />
                <Text>Fund Settlement</Text>
              </HStack>
            </Link>

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
