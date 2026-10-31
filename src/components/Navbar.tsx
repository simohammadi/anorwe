import { Box, Button, chakra, Container, Flex, HStack } from "@chakra-ui/react"
import { nav, navCta } from "@/content/site"
import { staticMode } from "@/lib/sky"
import { Lockup } from "@/components/Logo"

export function Navbar() {
  return (
    <Box as="header" position="fixed" top="0" left="0" right="0" zIndex="4" py={{ base: 4, md: 6 }}>
      <Container maxW="6xl" mx="auto" px={{ base: 5, md: 8 }}>
        <Flex align="center" justify="space-between" gap="6">
          <chakra.a href="#top" aria-label="anorwe home" display="inline-flex">
            <Lockup markId="dock" lineOnly={!staticMode} fontSize={{ base: "22px", md: "26px" }} />
          </chakra.a>

          <HStack gap={{ base: 0, md: 9 }}>
            <HStack gap="8" display={{ base: "none", md: "flex" }}>
              {nav.map((link) => (
                <chakra.a
                  key={link.href}
                  href={link.href}
                  fontSize="sm"
                  color="fg.muted"
                  transition="color 0.2s"
                  _hover={{ color: "bone" }}
                >
                  {link.label}
                </chakra.a>
              ))}
            </HStack>
            <Button
              asChild
              size={{ base: "sm", md: "md" }}
              variant="outline"
              rounded="full"
              px={{ base: 4, md: 5 }}
              color="bone"
              borderColor="rgba(246,236,221,0.3)"
              fontWeight="500"
              _hover={{ borderColor: "gold", color: "flare", bg: "transparent" }}
            >
              <a href="#contact" data-intent="">
                {navCta}
              </a>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
