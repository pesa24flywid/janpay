import React, { useState } from "react";
import { Box, HStack, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Sidebar from "../../hocs/Sidebar";
import Topbar from "../../hocs/Topbar";
import ServiceCard from "../../hocs/ServiceCard";

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
        <title>Pesa24 - Services</title>
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
              {/*KYC Document cards*/}

              <Box
                display={"flex"}
                px="4"
                flexWrap="wrap"
                justifyContent={[
                  "space-around",
                  "space-around",
                  "space-around",
                ]}
              >
                <ServiceCard
                  imgUrl="https://thumbs.dreamstime.com/b/services-concept-flat-line-design-icons-elements-modern-services-concept-s-collection-services-concept-lettering-thin-68961333.jpg"
                  buttonText={"Click Here"}
                />
                <ServiceCard
                  imgUrl="https://thumbs.dreamstime.com/b/services-concept-flat-line-design-icons-elements-modern-services-concept-s-collection-services-concept-lettering-thin-68961333.jpg"
                  buttonText={"Join Now"}
                />
                <ServiceCard
                  imgUrl="https://thumbs.dreamstime.com/b/services-concept-flat-line-design-icons-elements-modern-services-concept-s-collection-services-concept-lettering-thin-68961333.jpg"
                  buttonText={"Click for More"}
                />
                <ServiceCard
                  imgUrl="https://thumbs.dreamstime.com/b/services-concept-flat-line-design-icons-elements-modern-services-concept-s-collection-services-concept-lettering-thin-68961333.jpg"
                  buttonText={"Click Here"}
                />
                <ServiceCard
                  imgUrl="https://thumbs.dreamstime.com/b/services-concept-flat-line-design-icons-elements-modern-services-concept-s-collection-services-concept-lettering-thin-68961333.jpg"
                  buttonText={"Click Here"}
                />
              </Box>
            </Stack>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default Profile;
