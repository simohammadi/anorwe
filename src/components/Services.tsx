import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { services, servicesIntro } from "@/content/site"
import { Section, SectionHeader } from "@/components/Section"

export function Services() {
  return (
    <Section id="services">
      <SectionHeader
        eyebrow={servicesIntro.eyebrow}
        heading={servicesIntro.heading}
        subheading={servicesIntro.subheading}
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 5 }} mt={{ base: 10, md: 14 }}>
        {services.map((service, i) => (
          <Stack
            key={service.title}
            gap="0"
            p={{ base: 6, md: 7 }}
            rounded="18px"
            border="1px solid"
            borderColor="border"
            bg="glass"
            transition="border-color 0.25s ease"
            _hover={{ borderColor: "rgba(246,167,48,0.35)" }}
          >
            <Text fontFamily="mono" fontSize="xs" fontWeight="500" color="gold">
              {String(i + 1).padStart(2, "0")}
            </Text>
            <Heading as="h3" fontSize="2xl" fontWeight="500" lineHeight="1.2" mt="3" mb="2.5">
              {service.title}
            </Heading>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.65">
              {service.description}
            </Text>
            <Stack as="ul" gap="1.5" mt="5" pt="5" borderTop="1px solid" borderColor="border" listStyle="none">
              {service.bullets.map((bullet) => (
                <Text as="li" key={bullet} fontSize="sm" color="sand" display="flex" gap="2.5">
                  <Box as="span" color="gold" aria-hidden="true">
                    +
                  </Box>
                  {bullet}
                </Text>
              ))}
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>
    </Section>
  )
}
