import { Box, Button, chakra, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { hero } from "@/content/site"
import { staticMode } from "@/lib/sky"
import { Eyebrow } from "@/components/Section"
import { Mark } from "@/components/Logo"

export function Hero() {
  return (
    <Flex
      as="section"
      id="top"
      position="relative"
      direction="column"
      minH={{ base: "100svh", md: "max(100svh, 640px)" }}
      pt={{ base: "120px", md: "24svh" }}
      pb={{ base: "8vw", md: 0 }}
      className="hero"
    >
      <Container className="hero-copy" maxW="6xl" mx="auto" px={{ base: 5, md: 8 }} position="relative" zIndex="1">
        <Stack gap="0" maxW={{ base: "full", md: "620px" }}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Heading
            as="h1"
            mt={{ base: 4, md: 5 }}
            fontSize={{ base: "clamp(44px, 12.5vw, 60px)", md: "clamp(56px, 7vw, 104px)" }}
            fontWeight="500"
            lineHeight="1.04"
            letterSpacing="-0.015em"
          >
            {hero.title}{" "}
            <chakra.em fontStyle="italic" fontWeight="300" color="flare">
              {hero.titleAccent}
            </chakra.em>
          </Heading>
          <Text
            mt={{ base: 5, md: 7 }}
            maxW="440px"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.6"
            color="rgba(246,236,221,0.82)"
          >
            {hero.subtitle}
          </Text>
          <Flex mt={{ base: 7, md: 9 }} align="center" gap={{ base: 5, md: 7 }} wrap="wrap">
            <Button
              asChild
              size="lg"
              rounded="full"
              px="6"
              bg="bone"
              color="char"
              fontWeight="500"
              _hover={{ bg: "flare" }}
            >
              <a href="#contact" data-intent="">
                {hero.primaryCta}
              </a>
            </Button>
            <chakra.a
              href="#process"
              fontWeight="500"
              color="fg.muted"
              transition="color 0.2s"
              _hover={{ color: "bone" }}
            >
              {hero.secondaryCta}
            </chakra.a>
          </Flex>
        </Stack>
      </Container>

      {/* Where the sun rests before you scroll; the live sun reads its box, static mode shows the logo in it. */}
      <Box id="sun-anchor" className="sun-anchor" aria-hidden="true">
        {staticMode && <Mark className="static-mark" />}
      </Box>

      <Box
        className="scroll-hint"
        display={{ base: "none", md: "block" }}
        position="absolute"
        bottom="8"
        left="0"
        right="0"
      >
        <Container maxW="6xl" mx="auto" px="8">
          <Text fontFamily="mono" fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" color="fg.muted">
            {hero.scrollHint}
          </Text>
        </Container>
      </Box>
    </Flex>
  )
}
