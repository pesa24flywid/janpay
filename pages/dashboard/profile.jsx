import React, { useState } from "react";
import { Box, HStack, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Sidebar from "../../hocs/Sidebar";
import Topbar from "../../hocs/Topbar";

import ProfileInfoCard from "../../hocs/ProfileInfoCard";
import KycDocsCard from "../../hocs/KycDocsCard";

const Profile = () => {
  const [newNotification, setNewNotification] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      title: "Under Maintainence",
      content:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque pariatur aut eos quae quisquam eveniet incidunt ad odio magni at.",
    },
  ]);

  return (
    <>
      <Head>
        <title>Pesa24 - Profile</title>
      </Head>

      <Box bg={"aliceblue"} p={[0, 4]} w={"full"} minH={"100vh"}>
        <HStack spacing={8} alignItems={"flex-start"}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Dashboard Container */}
          <Box
            display={"flex"}
            flexDir={"column"}
            flex={["unset", 7]}
            w={"full"}
          >
            <Topbar
              title={"Profile"}
              aeps={8000}
              dmt={6400}
              prepaid={2600}
              notification={true}
            />
            <Stack
              direction={["column", "row"]}
              justifyContent={["flex-start", "space-between"]}
              mt="2"
            >
              {/*Profile info cards*/}

              <ProfileInfoCard
                fullName="Tom Bilyu"
                contactNo="934820472"
                dob="25-05-2002"
                aadharNo="843xxxx324"
                merchantId="CHX238245"
                companyName={"Kupdeep Telecom"}
                address="54, Church Street, Bengaluru Urban, Karnataka, 100001"
              />
              {/*KYC Document cards*/}
              <Stack>
                <Box
                  display={"flex"}
                  px="4"
                  flexWrap="wrap"
                  justifyContent={[
                    "space-around",
                    "space-around",
                    "space-between",
                  ]}
                >
                  <KycDocsCard
                    docType="Profile Picture"
                    docUrl="https://i.pinimg.com/600x315/1f/a0/ae/1fa0ae7b636c487a91f39f61953a3c76.jpg"
                  />
                  <KycDocsCard
                    docType="E-Aadhar (Front)"
                    docUrl="https://i.pinimg.com/600x315/1f/a0/ae/1fa0ae7b636c487a91f39f61953a3c76.jpg"
                  />
                  <KycDocsCard
                    docType="E-Aadhar(Back)"
                    docUrl="https://i.pinimg.com/600x315/1f/a0/ae/1fa0ae7b636c487a91f39f61953a3c76.jpg"
                  />
                  <KycDocsCard
                    docType="Pan Card"
                    docUrl="https://i.pinimg.com/600x315/1f/a0/ae/1fa0ae7b636c487a91f39f61953a3c76.jpg"
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default Profile;
