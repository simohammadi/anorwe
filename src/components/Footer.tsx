import { Box, chakra, Container, Flex, HStack, Text } from "@chakra-ui/react"
import { brand, nav } from "@/content/site"
import { Lockup } from "@/components/Logo"

export function Footer() {
  return (
    <Box as="footer" position="relative" borderTop="1px solid" borderColor="border" py="12">
      <Container maxW="6xl" mx="auto" px={{ base: 5, md: 8 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap="6"
        >
          <Box>
            <Lockup fontSize="22px" />
            <Text fontSize="sm" color="fg.muted" mt="3">
              {brand.tagline}
            </Text>
          </Box>

          <HStack gap="6" flexWrap="wrap">
            {nav.map((link) => (
              <chakra.a key={link.href} href={link.href} fontSize="sm" color="fg.muted" _hover={{ color: "bone" }}>
                {link.label}
              </chakra.a>
            ))}
            <chakra.a href={`mailto:${brand.email}`} fontSize="sm" color="fg.muted" _hover={{ color: "bone" }}>
              {brand.email}
            </chakra.a>
          </HStack>
        </Flex>

        <Text fontFamily="mono" fontSize="xs" letterSpacing="0.08em" color="fg.subtle" mt="10">
          © {new Date().getFullYear()} {brand.name}. Anor is Sindarin for sun.
        </Text>
      </Container>
    </Box>
  )
}
