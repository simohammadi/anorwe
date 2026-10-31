import { Box, chakra, Flex, SimpleGrid, Text } from "@chakra-ui/react"
import { story } from "@/content/site"
import { Section, SectionHeader } from "@/components/Section"

export function Story() {
  return (
    <Section id="name">
      <SectionHeader eyebrow={story.eyebrow} heading={story.heading} />
      <Flex
        align="baseline"
        gap="1.5"
        my={{ base: 7, md: 9 }}
        fontFamily="heading"
        fontSize={{ base: "56px", md: "88px" }}
        lineHeight="1.1"
      >
        <chakra.span color="gold" borderBottom="2px solid" borderColor="gold" pb="1.5">
          Anor
        </chakra.span>
        <chakra.span color="sand" borderBottom="2px dashed" borderColor="sand" pb="1.5">
          wë
        </chakra.span>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 10 }} maxW="640px" fontSize="sm" color="fg.muted">
        {story.notes.map((note) => (
          <Box key={note.term}>
            <chakra.b color="bone" fontWeight="500">
              {note.term}
            </chakra.b>{" "}
            {note.text}
          </Box>
        ))}
      </SimpleGrid>
      <Text mt={{ base: 8, md: 10 }} maxW="640px" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" color="fg.muted">
        anorwe is <chakra.em color="bone">the one who carries the sun</chakra.em>. {story.body}
      </Text>
    </Section>
  )
}
