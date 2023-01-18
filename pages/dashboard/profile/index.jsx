import React, { useState } from "react";
import { Box, HStack, Stack } from "@chakra-ui/react";
import Head from "next/head";

import ProfileInfoCard from "../../../hocs/ProfileInfoCard";
import KycDocsCard from "../../../hocs/KycDocsCard";
import DashboardWrapper from "../../../hocs/DashboardLayout";

const Profile = () => {

  return (
    <>
      <Head>
        <title>Pesa24 - Profile</title>
      </Head>

      <DashboardWrapper titleText='Your Profile'>
        <Stack
          direction={["column", "row"]}
          justifyContent={["flex-start"]}
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
              px={[0,4]}
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
      </DashboardWrapper>
    </>
  );
};

export default Profile;
