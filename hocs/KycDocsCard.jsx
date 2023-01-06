import React from "react";
import { Card, CardHeader, CardBody, Heading, Image } from "@chakra-ui/react";

const KycDocsCard = ({ docType, docUrl }) => {
  return (
    <>
      <Card
        maxW={"xs"}
        variant={"outline"}
        w={["full", "md", "xl"]}
        p={4}
        rounded={12}
        bg={"white"}
        boxShadow={"md"}
        my="4"
      >
        <CardHeader padding={"0"} pt={2}>
          <Heading size="sm" textAlign="center">
            {docType}
          </Heading>
        </CardHeader>

        <CardBody>
          <Image src={docUrl} alt={docType} borderRadius="lg" />
        </CardBody>
      </Card>
    </>
  );
};

export default KycDocsCard;
