import React from "react";
import Link from "next/link";
import { Box, HStack, VStack, Image, Text, Hide, Show } from "@chakra-ui/react";
import { BiRupee, BiUser, BiPowerOff } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import axios from "../lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
      <Show above={"md"}>
        <Box
          w={"xs"}
          h={"auto"}
          position={"relative"}
          flex={2}>
          <VStack
            className={"sidebar"}
            position={"fixed"}
            w={"64"}
            boxShadow={"md"}
            h={"95vh"}
            bg={"white"}
            p={4}
            rounded={"12"}
            border={"1px"}
            borderColor={"gray.300"}
            overflowY={"scroll"}
            overflowX={"hidden"}
          >
            {/* Sidebar Profile */}
            <Link href={"/dashboard/profile"}>
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
              <Link href={"/dashboard"} style={{ width: "100%" }}>
                <HStack
                  borderRadius={"full"}
                  px={3}
                  py={2}
                  color={"white"}
                  bg={"#3C79F5"}
                >
                  <VscDashboard />
                  <Text>Dashboard</Text>
                </HStack>
              </Link>

              <Link href={"/dashboard/profile"} style={{ width: "100%" }}>
                <HStack
                  spacing={2}
                  w={"full"}
                  borderRadius={"full"}
                  px={3}
                  py={2}
                  color={"#333"}
                  _hover={{ bg: "aqua" }}
                >
                  <BiUser />
                  <Text>Profile</Text>
                </HStack>
              </Link>

              <Link href={isProfileComplete ? "/dashboard/services" : "#"} style={{ width: "100%" }}>
                <HStack
                  spacing={2}
                  w={"full"}
                  borderRadius={"full"}
                  px={3}
                  py={2}
                  color={"#333"}
                  bg={isProfileComplete ? "transparent" : "aqua"}
                  _hover={{ bg: "aqua" }}

                >
                  <BiRupee />
                  <Text>Services</Text>
                </HStack>
              </Link>

              <HStack
                spacing={2}
                w={"full"}
                borderRadius={"full"}
                px={3}
                py={2}
                color={"#333"}
                _hover={{ bg: "aqua" }}
                onClick={signout}
                cursor={'pointer'}
              >
                <BiPowerOff />
                <Text>Sign Out</Text>
              </HStack>

            </VStack>
          </VStack>
        </Box>
      </Show>
    </>
  );
};

export default Sidebar;
