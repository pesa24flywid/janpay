import React, { useState, useEffect, useMemo } from "react";
import {
  BsWallet,
  BsBell,
  BsPeopleFill,
  BsFillFileEarmarkBarGraphFill,
  BsFileEarmarkBarGraphFill,
  BsHouseDoorFill,
  BsPlusCircleFill,
} from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { BiRupee, BiUser, BiPowerOff } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import {
  HStack,
  Text,
  Box,
  VStack,
  Spacer,
  Show,
  useDisclosure,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";
import Sidebar, { ServicesAccordion, SidebarOptions } from "./Sidebar";
import BankDetails from "./BankDetails";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import BackendAxios, { ClientAxios } from "../lib/axios";
import Topbar from "./Topbar";
import SimpleAccordion from "./SimpleAccordion";
import { FaUserAlt } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { Image } from "@chakra-ui/react";
import Maintenance from "./Maintenance";
import Pusher from "pusher-js";
import { useToast } from "@chakra-ui/react";
import { VisuallyHidden } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
let bcrypt = require("bcryptjs");

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const DashboardWrapper = (props) => {
  const [availablePages, setAvailablePages] = useState([]);
  const Toast = useToast({ position: "top-right" });
  useEffect(() => {
    let authentic = bcrypt.compareSync(
      `${localStorage.getItem("userId") + localStorage.getItem("userName")}`,
      Cookies.get("verified")
    );
    if (authentic != true) {
      BackendAxios.post("/logout")
        .then(() => {
          Cookies.remove("verified");
          Cookies.remove("access_token");
          Cookies.remove("XSRF-TOKEN");
          Cookies.remove("laravel_session");
          localStorage.clear();
        })
        .catch((err) => {
          console.log(err);
        });
      setTimeout(() => Router.push("/auth/login"), 500);
    }
    if (authentic) {
      setIsProfileComplete(
        localStorage.getItem("isProfileComplete") === "true"
      );
      setUserName(localStorage.getItem("userName"));
      setUserType(localStorage.getItem("userType"));
      setProfilePic(localStorage.getItem("profilePic"));
      Cookies.set("verified", Cookies.get("verified"));
    }
  }, []);

  const sound = new Audio("/notification.mp3")

  const [openNotification, setOpenNotification] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [organisationNotifications, setOrganisationNotifications] = useState(
    []
  );
  const [userNotifications, setUserNotifications] = useState([]);

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userName, setUserName] = useState("No Name");
  const [userType, setUserType] = useState("Undefined");
  const [profilePic, setProfilePic] = useState("/avatar.png");
  const [wallet, setWallet] = useState("0");

  const [paysprintId, setPaysprintId] = useState("");
  const [ekoId, setEkoId] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  var sessionExpiry = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
  const Router = useRouter();

  useEffect(() => {
    // Fetch all notifications
    ClientAxios.post(
      "/api/user/fetch",
      {
        user_id: localStorage.getItem("userId"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setAvailablePages(res.data[0].allowed_pages);
        // setUserNotifications(res.data[0].notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("notifications")) return;
    setUserNotifications(JSON.parse(sessionStorage.getItem("notifications")));
  }, []);

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe(process.env.NEXT_PUBLIC_PUSHER_CHANNEL);
    
    channel.bind("payout-updated", (data) => {
      if (parseInt(data?.user_id) != parseInt(localStorage.getItem("userId")))
        return;
      if (!userNotifications || userNotifications?.length == 0) {
        setUserNotifications([data]);
        sessionStorage.setItem("notifications", JSON.stringify([data]));
      } else {
        setUserNotifications([...userNotifications, data]);
        sessionStorage.setItem(
          "notifications",
          JSON.stringify([...userNotifications, data])
        );
      }
      sound.play()
      Toast({
        title: data?.title || "New notification",
        description: data?.content || "Payout updated",
      });
    });

    return () => {
      channel.unbind("payout-updated");
      pusher.unsubscribe(process.env.NEXT_PUBLIC_PUSHER_CHANNEL);
    };
  }, [userNotifications]);

  function fetchWallet() {
    BackendAxios.post(
      "/api/user/wallet",
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("access-token")}`,
        },
      }
    )
      .then((res) => {
        setWallet(res.data[0].wallet);
      })
      .catch((err) => {
        if (err.response.status == 401) {
          signout();
          return;
        }
        setWallet("0");
        console.log(err);
      });
  }

  useEffect(() => {
    setEkoId(localStorage.getItem("ekoId"));
    setPaysprintId(localStorage.getItem("paysprintId"));
  }, []);

  useEffect(() => {
    // Check for new notifications
    if (
      globalNotifications.length != 0 ||
      organisationNotifications?.length != 0 ||
      userNotifications?.length != 0
    ) {
      setNewNotification(true);
    }
  }, [globalNotifications, organisationNotifications, userNotifications]);

  function signout() {
    BackendAxios.post("/logout")
      .then(() => {
        Cookies.remove("verified");
        Router.push("/auth/login");
      })
      .catch(() => {
        Cookies.remove("verified");
        Router.push("/auth/login");
      })
      .finally(() => {
        Router.push("/auth/login");
      });
  }

  return (
    <>
      <Head>
        <title>{`Janpay - ${props.titleText || props.pageTitle}`}</title>
      </Head>

      {/* <Maintenance /> */}
      <Box bg={"aliceblue"} w={"full"}>
        <HStack spacing={8} alignItems={"flex-start"}>
          <Sidebar
            isProfileComplete={isProfileComplete}
            userName={userName}
            userType={userType?.toUpperCase()}
            userImage={profilePic}
          />

          <Box
            display={"flex"}
            flexDir={"column"}
            flex={[1, 8]}
            w={"full"}
            h={["100vh", "100vh"]}
            overflowY={"scroll"}
          >
            <Show above="md">
              <Topbar />
            </Show>

            <HStack
              py={[4, 0]}
              pb={[4, 2]}
              px={[4, 2]}
              bgImage={["/mobileBg.svg", "unset"]}
              color={["#FFF", "#222"]}
            >
              <Show below={"md"}>
                <Box fontSize={"2xl"} onClick={onOpen}>
                  <FiMenu color="#FFF" />
                </Box>
              </Show>
              <Show above="md">
                <Text
                  fontSize={"xl"}
                  fontWeight={"500"}
                  color={["#FFF", "#222"]}
                >
                  {props.titleText || props.pageTitle}
                </Text>
                <Spacer />
              </Show>
              <Show below="md">
                <Text
                  fontSize={"lg"}
                  fontWeight={"500"}
                  color={["#FFF", "#222"]}
                >
                  Hi {userName?.split(" ")[0]}
                </Text>
                <Spacer />
              </Show>
              <HStack spacing={4} w={"auto"} display={["none", "flex"]}>
                <HStack
                  boxShadow={"md"}
                  p={1}
                  px={3}
                  w={"auto"}
                  spacing={2}
                  rounded={"full"}
                  bg={"white"}
                  justifyContent={"flex-start"}
                  onClick={fetchWallet}
                  cursor={"pointer"}
                >
                  <Box
                    boxSize={"8"}
                    bg={"#FFB100"}
                    color={"white"}
                    rounded={"full"}
                    display={"grid"}
                    placeContent={"center"}
                  >
                    <BsWallet />
                  </Box>
                  <VStack
                    w={"auto"}
                    spacing={0}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                  >
                    <Text fontSize={"xs"} color={"#888"} mb={0}>
                      Wallet
                    </Text>
                    <h2>₹ {wallet}</h2>
                  </VStack>
                </HStack>
                <Spacer w={8} />
                <Box
                  pos={"relative"}
                  boxSize={"10"}
                  p={2}
                  cursor={"pointer"}
                  color={"gray.600"}
                  boxShadow={"md"}
                  rounded={"full"}
                  bg={"white"}
                  display={"grid"}
                  placeContent={"center"}
                  onClick={() => setOpenNotification(true)}
                >
                  <BsBell fontSize={"20"} />
                  {newNotification ? (
                    <Box
                      boxSize={"2"}
                      rounded={"full"}
                      bg={"red"}
                      position={"absolute"}
                      top={"3"}
                      right={"3"}
                    ></Box>
                  ) : null}
                </Box>
              </HStack>
              <Show below="md">
                <Link href={"/dashboard/profile?pageId=prfile"}>
                  <HStack p={2} rounded={"full"} bgColor={"orange.500"}>
                    <Text fontSize={"md"} fontWeight={"semibold"}>
                      ₹ {wallet}
                    </Text>
                    <BsPlusCircleFill size={20} />
                  </HStack>
                </Link>
              </Show>
            </HStack>

            <Box p={[4, 0]} pr={[4, 4]}>
              {props.children}
            </Box>

            <Show below="md">
              <Box w={"full"} py={10}></Box>
            </Show>
          </Box>
        </HStack>
      </Box>

      {/* Mobile bottom nav */}
      <Show below="md">
        <HStack
          pos={"fixed"}
          bottom={0}
          width={"100%"}
          zIndex={999}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HStack
            width={"100%"}
            padding={3}
            boxShadow={"lg"}
            bg={"#FFF"}
            justifyContent={"space-between"}
            paddingX={8}
            border={"1px"}
            borderColor={"#FAFAFA"}
          >
            <Link href={"/dashboard/home?pageId=home"}>
              <VStack h={"100%"} justifyContent={"space-between"}>
                <BsHouseDoorFill fontSize={"20"} />
                <Text fontSize={"xs"} textAlign={"center"}>
                  Home
                </Text>
              </VStack>
            </Link>

            <Link href={"/dashboard/mobile/reports?pageId=reports"}>
              <VStack h={"100%"} justifyContent={"space-between"}>
                <BsFileEarmarkBarGraphFill fontSize={"20"} />
                <Text fontSize={"xs"} textAlign={"center"}>
                  Reports
                </Text>
              </VStack>
            </Link>

            <Link href={"/dashboard/support-tickets"}>
              <VStack h={"100%"} justifyContent={"space-between"}>
                <MdContactSupport fontSize={"22"} />
                <Text fontSize={"xs"} textAlign={"center"}>
                  Support
                </Text>
              </VStack>
            </Link>

            <Link href={"/dashboard/profile"}>
              <VStack h={"100%"} justifyContent={"space-between"}>
                <FaUserAlt fontSize={"18"} />
                <Text fontSize={"xs"} textAlign={"center"}>
                  Profile
                </Text>
              </VStack>
            </Link>
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Sidebar */}
      <Show below={"md"}>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Image src="/logo_long.png" w={"24"} objectFit={"contain"} />
              <HStack mt={4}>
                <Avatar size={"sm"} name={userName} src={profilePic} />
                <Box>
                  <Text fontSize={"xs"}>
                    <span style={{ fontWeight: "bold" }}>EKO ID: </span> {ekoId}
                  </Text>
                  <Text fontSize={"xs"}>
                    <span style={{ fontWeight: "bold" }}>PAYSPRINT ID: </span>{" "}
                    {paysprintId}
                  </Text>
                </Box>
              </HStack>
            </DrawerHeader>

            <DrawerBody mt={2}>
              <VStack spacing={2}>
                {SidebarOptions.map((option, key) => {
                  if (option.type == "link") {
                    return (
                      <Link
                        href={option.link}
                        key={key}
                        style={{ width: "100%" }}
                      >
                        <HStack
                          px={3}
                          py={2}
                          rounded={"full"}
                          overflow={"hidden"}
                          _hover={{ bg: "aqua" }}
                          id={option.id || option.title}
                        >
                          {option.icon}
                          <Text textTransform={"capitalize"} fontSize={"md"}>
                            {option.title}
                          </Text>
                        </HStack>
                      </Link>
                    );
                  }

                  if (option.type == "accordion") {
                    return (
                      <Accordion allowToggle w={"full"}>
                        <AccordionItem border={"none"}>
                          <AccordionButton
                            px={[3, 3]}
                            _expanded={{ bg: "aqua" }}
                            border={"none"}
                          >
                            <HStack
                              spacing={1}
                              flex={1}
                              fontSize={"md"}
                              alignItems={"center"}
                            >
                              {option.icon}
                              <Text textTransform={"capitalize"}>
                                {option.title}
                              </Text>
                            </HStack>
                            <AccordionIcon />
                          </AccordionButton>

                          <AccordionPanel px={0}>
                            <VStack
                              w={"full"}
                              alignItems={"flex-start"}
                              justifyContent={"flex-start"}
                              spacing={2}
                              overflow={"hidden"}
                              id={"payout"}
                            >
                              {option.children.map((item, key) => {
                                return (
                                  <Link
                                    key={key}
                                    href={item.link}
                                    style={{ width: "100%" }}
                                  >
                                    <Text
                                      w={"full"}
                                      textAlign={"left"}
                                      px={3}
                                      py={2}
                                      _hover={{ bg: "aqua" }}
                                      textTransform={"capitalize"}
                                    >
                                      {item.title}
                                    </Text>
                                  </Link>
                                );
                              })}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                })}

                {userType != "retailer" && (
                  <Accordion allowToggle w={"full"}>
                    <AccordionItem>
                      <AccordionButton px={[0, 3]} _expanded={{ bg: "aqua" }}>
                        <HStack
                          spacing={1}
                          flex={1}
                          fontSize={["1.2rem", "md"]}
                          alignItems={"center"}
                        >
                          <BsPeopleFill />
                          <Text textTransform={"capitalize"}>Manage Users</Text>
                        </HStack>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel px={0}>
                        <VStack
                          w={"full"}
                          alignItems={"flex-start"}
                          justifyContent={"flex-start"}
                          spacing={2}
                          overflow={"hidden"}
                        >
                          {availablePages.includes(
                            "userManagementCreateUser"
                          ) ? (
                            <Link
                              href={"/dashboard/users/create-user?pageId=users"}
                              style={{ width: "100%" }}
                            >
                              <Text
                                w={"full"}
                                textAlign={"left"}
                                px={3}
                                py={2}
                                _hover={{ bg: "aqua" }}
                                textTransform={"capitalize"}
                              >
                                Create User
                              </Text>
                            </Link>
                          ) : null}

                          {availablePages.includes(
                            "userManagementUsersList"
                          ) ? (
                            <Link
                              href={"/dashboard/users/view-users?pageId=users"}
                              style={{ width: "100%" }}
                            >
                              <Text
                                w={"full"}
                                textAlign={"left"}
                                px={3}
                                py={2}
                                _hover={{ bg: "aqua" }}
                                textTransform={"capitalize"}
                              >
                                View Users
                              </Text>
                            </Link>
                          ) : null}

                          {availablePages.includes(
                            "userManagementUserLedger"
                          ) ? (
                            <Link
                              href={"/dashboard/users/user-ledger?pageId=users"}
                              style={{ width: "100%" }}
                            >
                              <Text
                                w={"full"}
                                textAlign={"left"}
                                px={3}
                                py={2}
                                _hover={{ bg: "aqua" }}
                                textTransform={"capitalize"}
                              >
                                User Ledger
                              </Text>
                            </Link>
                          ) : null}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </VStack>

              <BankDetails color={"#000"} />
            </DrawerBody>

            <DrawerFooter justifyContent={"center"}>
              <VStack w={"full"} spacing={8}>
                <HStack spacing={2} color={"red"} onClick={() => signout()}>
                  <BiPowerOff fontSize={"1.5rem"} />
                  <Text fontSize={"lg"}>Sign Out</Text>
                </HStack>
              </VStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Show>

      {/* Notifications Drawer */}
      <Drawer
        isOpen={openNotification}
        onClose={() => setOpenNotification(false)}
        placement={"right"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Notifications</DrawerHeader>
          <DrawerBody>
            {globalNotifications?.map((notification, key) => {
              return (
                <SimpleAccordion
                  key={key}
                  title={notification.title}
                  content={notification.content}
                />
              );
            })}
            {organisationNotifications?.map((notification, key) => {
              return (
                <SimpleAccordion
                  key={key}
                  title={notification.title}
                  content={notification.content}
                />
              );
            })}
            {userNotifications
              ?.map((notification, key) => {
                return (
                  <SimpleAccordion
                    key={key}
                    title={notification?.title}
                    content={notification?.content}
                  />
                );
              })
              .reverse()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>



      <VisuallyHidden>
        <audio id="notification" src="/notification.mp3"></audio>
      </VisuallyHidden>
    </>
  );
};

export default DashboardWrapper;
