import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Stack,
  Text,
  useToast,
  Button,
  Flex
} from "@chakra-ui/react";
import Head from "next/head";

import ProfileInfoCard from "../../../hocs/ProfileInfoCard";
import KycDocsCard from "../../../hocs/KycDocsCard";
import DashboardWrapper from "../../../hocs/DashboardLayout";
import BackendAxios from "../../../lib/axios";

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
    profilePic: "",
    panCard: "",
    aadhaarFront: "",
    aadhaarBack: "",
  })


  async function fetchProfile() {
    await BackendAxios.post("api/user/info").then((res) => {
      localStorage.setItem("kycStatus", res.data.data.kyc)

      localStorage.setItem("firstName", res.data.data.first_name || "")

      localStorage.setItem("lastName", res.data.data.last_name || "")

      localStorage.setItem("phone", res.data.data.phone_number || "")

      localStorage.setItem("userEmail", res.data.data.email || "")

      localStorage.setItem("dob", res.data.data.dob || "")

      localStorage.setItem("aadhaar", res.data.data.aadhaar || "")

      localStorage.setItem("pan", res.data.data.pan_number || "")

      localStorage.setItem("merchantId", res.data.data.user_code || "")

      localStorage.setItem("companyName", (res.data.data.company_name || "") + " " + (res.data.data.firm_type || ""))


      localStorage.setItem("line", res.data.data.line || "")

      localStorage.setItem("city", res.data.data.city || "")

      localStorage.setItem("state", res.data.data.state || "")

      localStorage.setItem("pincode", res.data.data.pincode || "")

      localStorage.setItem("modelName", res.data.data.model_name || "")

      localStorage.setItem("deviceNumber", res.data.data.device_number || "")

      localStorage.setItem("kycStatus", res.data.data.profile === 1)

      setProfile({
        ...profile,
        fullName: res.data?.data?.name,
        phone: res.data?.data?.phone_number,
        dob: res.data?.data?.dob,
        aadhaarNumber: res.data?.data?.aadhaar,
        pan: res.data?.data?.pan_number,
        merchantId: res.data?.data?.id,
        companyName: res.data?.data?.company_name + " " + res.data?.data?.firm_type,
        address: res.data?.data?.line + " " + res.data?.data?.city + " " + res.data?.data?.state + " " + res.data?.data?.pincode,
        kycStatus: Number(res.data?.data?.kyc) === 1,
        aadhaarBack: res.data.data.aadhar_back,
        aadhaarFront: res.data.data.aadhar_front,
        panCard: res.data.data.pan_photo,
      })
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message
      })
      console.log(err)
    })
  }

  useEffect(() => {
    fetchProfile()
    setProfile({
      ...profile,
      profilePic: localStorage.getItem("profilePic"),
    })
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

          <Flex
            px={[0, 4]}
            flexWrap="wrap"
            gap={8} h={['auto', 'lg']}
          >
            <KycDocsCard
              docType="Profile Picture"
              docUrl={profile.profilePic}
            />
            <Box
              w={["full", "md", "56"]} padding={4} bg={'#FFF'}
              boxShadow={'lg'} rounded={12} h={28} my={4}
            >
              <Text fontWeight={'semibold'}>PAN Card</Text>
              <Button
                variant={'outline'} mt={4}
                colorScheme={profile.panCard ? "green" : "red"}
              >
                {profile.panCard ? "Uploaded" : "Not Uploaded"}
              </Button>
            </Box>
            <Box
              w={["full", "md", "56"]} padding={4} bg={'#FFF'}
              boxShadow={'lg'} rounded={12} h={28} my={4}
            >
              <Text fontWeight={'semibold'}>Aadhaar Card Front</Text>
              <Button
                variant={'outline'} mt={4}
                colorScheme={profile.aadhaarFront ? "green" : "red"}
              >
                {profile.panCard ? "Uploaded" : "Not Uploaded"}
              </Button>
            </Box>
            <Box
              w={["full", "md", "56"]} padding={4} bg={'#FFF'}
              boxShadow={'lg'} rounded={12} h={28} my={4}
            >
              <Text fontWeight={'semibold'}>Aadhaar Card Back</Text>
              <Button
                variant={'outline'} mt={4}
                colorScheme={profile.aadhaarBack ? "green" : "red"}
              >
                {profile.panCard ? "Uploaded" : "Not Uploaded"}
              </Button>
            </Box>
          </Flex>
        </Stack>
      </DashboardWrapper>
    </>
  );
};

export default Profile;
