import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { processIntro, processSteps } from "@/content/site"
import { Section, SectionHeader } from "@/components/Section"

export function Process() {
  return (
    <Section id="process">
      <SectionHeader
        eyebrow={processIntro.eyebrow}
        heading={processIntro.heading}
        subheading={processIntro.subheading}
      />
      <SimpleGrid
        as="ol"
        listStyle="none"
        columns={{ base: 1, sm: 2, lg: 4 }}
        mt={{ base: 10, md: 12 }}
        rounded="18px"
        overflow="hidden"
        border="1px solid"
        borderColor="border"
        className="glass"
      >
        {processSteps.map((step) => (
          <Box as="li" key={step.title} bg={step.tint} px="6" pt={{ base: 7, md: 9 }} pb={{ base: 8, md: 10 }} minH={{ lg: "260px" }}>
            <Heading as="h3" fontSize={{ base: "3xl", md: "34px" }} fontWeight="500" lineHeight="1.1" mb="4">
              {step.title}
            </Heading>
            <Text fontSize="15px" lineHeight="1.6" opacity="0.88" maxW={{ base: "420px", lg: "240px" }}>
              {step.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Section>
  )
}
