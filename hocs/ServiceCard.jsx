import React from "react";
import { Card, Button, CardBody, Image } from "@chakra-ui/react";

const ServiceCard = ({ imgUrl, buttonText }) => {
  return (
    <>
      <Card
        maxW={"xs"}
        variant={"outline"}
        w={["full", "md", "xl"]}
        rounded={12}
        bg={"white"}
        boxShadow={"md"}
        my="4"
      >
        <CardBody
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image src={imgUrl} alt={buttonText} borderRadius="lg" />
          <Button colorScheme="messenger" mt="8">
            Click Here
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceCard;
