import React, { useState } from "react";
import { Box, HStack, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Sidebar from "../../hocs/Sidebar";
import Topbar from "../../hocs/Topbar";
import ServiceCard from "../../hocs/ServiceCard";
import DashboardWrapper from "../../hocs/DashboardLayout";

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

      <DashboardWrapper titleText="Services">
        <Stack
          direction={["column", "row"]}
          justifyContent={["flex-start", "space-between"]}
          mt="2"
        >

          <Box
            display={"flex"}
            flexWrap="wrap"
            justifyContent={[
              "space-around",
              "flex-start",
              "flex-start",
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
      </DashboardWrapper>
    </>
  );
};

export default Profile;
