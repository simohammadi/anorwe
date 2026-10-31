import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { about } from "@/content/site"
import { Section, SectionHeader } from "@/components/Section"

export function About() {
  return (
    <Section id="about">
      <SectionHeader eyebrow={about.eyebrow} heading={about.heading} subheading={about.body} />
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 8, md: 10 }} mt={{ base: 10, md: 14 }}>
        {about.principles.map((principle) => (
          <Box key={principle.title} pt="5" borderTop="1px solid" borderColor="border">
            <Heading as="h3" fontSize="2xl" fontWeight="500" lineHeight="1.2">
              {principle.title}
            </Heading>
            <Text mt="2.5" color="fg.muted" lineHeight="1.65">
              {principle.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Section>
  )
}
