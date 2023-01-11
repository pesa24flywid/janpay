import React from "react";
import { Card, Button, CardBody, Image } from "@chakra-ui/react";

const ServiceCard = ({ imgUrl, buttonText }) => {
  return (
    <>
      <Card
        variant={"outline"}
        w={["full", "md", "56"]}
        rounded={12}
        bg={"white"}
        boxShadow={"md"}
        m={[2, 3]}
      >
        <CardBody
          p={4}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image src={imgUrl} alt={buttonText} borderRadius="lg" w={'full'} h={'32'} objectFit={'contain'} />
          <Button colorScheme="messenger" mt="4">
            Click Here
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceCard;
