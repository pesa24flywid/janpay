import React, { useEffect, useState } from "react";
import { Box, HStack, Stack, useToast } from "@chakra-ui/react";
import Head from "next/head";

import ProfileInfoCard from "../../../hocs/ProfileInfoCard";
import KycDocsCard from "../../../hocs/KycDocsCard";
import DashboardWrapper from "../../../hocs/DashboardLayout";
import axios from "../../../lib/axios";

const Profile = () => {
  const Toast = useToast()
  const [profile, setProfile] = useState({
    kycStatus: false,
    fullName: "",
    phone: "NA",
    dob: "NA",
    aadhaarNumber: "NA",
    pan: "NA",
    merchantId: "NA",
    companyName: "NA",
    address: "NA",
  })

  function fetchProfile() {
    axios.post("api/user/info").then((res) => {
      localStorage.setItem("kycStatus", false)
      localStorage.setItem("firstName", res.data.data.first_name)
      localStorage.setItem("lastName", res.data.data.last_name)
      localStorage.setItem("phone", res.data.data.phone_number)
      localStorage.setItem("userEmail", res.data.data.email)
      localStorage.setItem("dob", res.data.data.dob)
      localStorage.setItem("aadhaar", res.data.data.aadhaar)
      localStorage.setItem("pan", res.data.data.pan_number)
      localStorage.setItem("merchantId", res.data.data.user_code)
      localStorage.setItem("companyName", res.data.data.company_name + " " + res.data.data.firm_type)
      localStorage.setItem("line", res.data.data.line)
      localStorage.setItem("city", res.data.data.city)
      localStorage.setItem("state", res.data.data.state)
      localStorage.setItem("pincode", res.data.data.pincode)
    }).catch((err)=>{
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message
      })
      console.log(err)
    })
    setProfile({
      ...profile,
      fullName: localStorage.getItem("userName"),
      kycStatus: localStorage.getItem("kycStatus"),
      phone: localStorage.getItem("phone"),
      dob: localStorage.getItem("dob"),
      aadhaarNumber: localStorage.getItem("aadhaar"),
      pan: localStorage.getItem("pan"),
      merchantId: localStorage.getItem("merchantId"),
      companyName: localStorage.getItem("companyName"),
      address: localStorage.getItem("line") + " " + localStorage.getItem("city") + " " + localStorage.getItem("state") + " " + localStorage.getItem("pincode"),
    })
  }


  // Fetching profile details
  useEffect(() => {
    fetchProfile()
  }, [])



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
            kycStatus={profile.kycStatus}
            fullName={profile.fullName}
            contactNo={profile.phone}
            dob={profile.dob}
            aadharNo={profile.aadhaarNumber}
            merchantId={profile.merchantId}
            companyName={profile.companyName}
            address={profile.address}
          />
          {/*KYC Document cards*/}
          <Stack>
            <Box
              display={"flex"}
              px={[0, 4]}
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
