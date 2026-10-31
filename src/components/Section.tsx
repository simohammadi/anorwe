import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface SectionProps {
  id?: string
  children: ReactNode
  maxW?: string
}

export function Section({ id, children, maxW = "6xl" }: SectionProps) {
  return (
    <Box
      as="section"
      id={id}
      scrollMarginTop={{ base: "64px", md: "88px" }}
      py={{ base: 20, md: 32 }}
      position="relative"
    >
      <Container maxW={maxW} mx="auto" px={{ base: 5, md: 8 }}>
        {children}
      </Container>
    </Box>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text
      fontFamily="mono"
      fontSize="xs"
      fontWeight="500"
      lineHeight="1"
      letterSpacing="0.14em"
      textTransform="uppercase"
      color="gold"
    >
      {children}
    </Text>
  )
}

interface SectionHeaderProps {
  eyebrow: string
  heading: ReactNode
  subheading?: string
}

export function SectionHeader({ eyebrow, heading, subheading }: SectionHeaderProps) {
  return (
    <Stack gap="0" maxW="2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading
        as="h2"
        fontSize={{ base: "4xl", md: "5xl" }}
        fontWeight="500"
        lineHeight="1.12"
        letterSpacing="-0.01em"
        mt="4"
        mb={subheading ? "4" : "0"}
      >
        {heading}
      </Heading>
      {subheading && (
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" lineHeight="1.6">
          {subheading}
        </Text>
      )}
    </Stack>
  )
}
