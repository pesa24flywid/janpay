import React from "react";
import {
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  StackDivider,
  Stack,
  Icon,
  Box,
} from "@chakra-ui/react";
import { MdVerifiedUser, MdEdit } from "react-icons/md";
import Link from "next/link";

const ProfileInfoCard = ({
  fullName,
  contactNo,
  dob,
  aadharNo,
  merchantId,
  address,
  companyName,
  kycStatus = true,
}) => {
  return (
    <>
      <Box w={["full", "md", "xl"]} rounded={12} my="4" mx="2">
        <Card
          maxW={"md"}
          variant={"outline"}
          w={["full", "md", "xl"]}
          p={4}
          rounded={12}
          bg={"white"}
          boxShadow={"md"}
        >
          <CardHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading size="md">Personal Info</Heading>
            <Link href={"/dashboard/profile/editprofile"}>
              <Button colorScheme="red" variant="solid">
                <Icon as={MdEdit} color={"white"} mr={"2"} />
                Edit Info
              </Button>
            </Link>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  KYC Status
                </Heading>
                <Text pt="2" fontSize="sm" display={"flex"} alignItems="center">
                  <Icon
                    as={MdVerifiedUser}
                    color={kycStatus ? "green.500" : "red.500"}
                  />
                  <Text ml="1" textColor={kycStatus ? "green.500" : "red.500"}>
                    {kycStatus ? "Verified" : "Not Verified"}
                  </Text>
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Full Name
                </Heading>
                <Text pt="2" fontSize="sm">
                  {fullName}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Contact Number
                </Heading>
                <Text pt="2" fontSize="sm">
                  {contactNo}{" "}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Date of Birth
                </Heading>
                <Text pt="2" fontSize="sm">
                  {dob}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Aadhar Number
                </Heading>
                <Text pt="2" fontSize="sm">
                  {aadharNo}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Merchant ID
                </Heading>
                <Text pt="2" fontSize="sm">
                  {merchantId}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Company Name
                </Heading>
                <Text pt="2" fontSize="sm">
                  {companyName}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Address
                </Heading>
                <Text pt="2" fontSize="sm">
                  {address}
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default ProfileInfoCard;
