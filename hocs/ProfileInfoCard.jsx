import React from "react";
import {
  Text,
  HStack,
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
import { MdVerifiedUser, MdEdit, MdError } from "react-icons/md";
import Link from "next/link";

const ProfileInfoCard = ({
  fullName,
  contactNo,
  dob,
  aadharNo,
  merchantId,
  address,
  companyName,
  kycStatus,
}) => {
  return (
    <>
        <Card
          variant={"outline"}
          w={["full", "md", "2xl"]}
          p={[0,4]} my={4}
          rounded={12} mx={[0,2]}
          bg={"white"}
          boxShadow={"md"}
        >
          <CardHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading size="md">Personal Info</Heading>
            <Link href={"/dashboard/profile/edit?pageId=profile"}>
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
                <HStack pt={2}>
                  <Icon
                    as={ kycStatus ? MdVerifiedUser : MdError}
                    color={kycStatus ? "green.500" : "red.500"}
                  />
                  <Text ml="1" textColor={kycStatus ? "green.500" : "red.500"}>
                    {kycStatus ? "Verified" : "Not Verified"}
                  </Text>
                </HStack>
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
    </>
  );
};

export default ProfileInfoCard;
