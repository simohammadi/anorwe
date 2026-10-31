import { useState } from "react"
import { Box, Collapsible, Flex, Stack, Text } from "@chakra-ui/react"
import { faqIntro, faqs } from "@/content/site"
import { Section, SectionHeader } from "@/components/Section"

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" maxW="4xl">
      <SectionHeader eyebrow={faqIntro.eyebrow} heading={faqIntro.heading} />
      <Stack gap="0" mt={{ base: 8, md: 12 }}>
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <Box
              key={faq.question}
              borderTop="1px solid"
              borderColor="border"
              borderBottom={i === faqs.length - 1 ? "1px solid" : undefined}
              borderBottomColor="border"
            >
              <Collapsible.Root open={isOpen} onOpenChange={() => setOpen(isOpen ? null : i)}>
                <Collapsible.Trigger
                  width="full"
                  cursor="pointer"
                  textAlign="left"
                  py="5"
                  bg="transparent"
                  border="none"
                  color="bone"
                >
                  <Flex justify="space-between" align="center" gap="6">
                    <Text fontFamily="heading" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.3">
                      {faq.question}
                    </Text>
                    <Box
                      as="span"
                      color="gold"
                      fontSize="2xl"
                      lineHeight="1"
                      transform={isOpen ? "rotate(45deg)" : "rotate(0deg)"}
                      transition="transform 0.2s ease"
                      flexShrink="0"
                      aria-hidden="true"
                    >
                      +
                    </Box>
                  </Flex>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <Text fontSize={{ base: "sm", md: "md" }} color="fg.muted" lineHeight="1.7" pb="6" pr={{ base: 0, md: 12 }}>
                    {faq.answer}
                  </Text>
                </Collapsible.Content>
              </Collapsible.Root>
            </Box>
          )
        })}
      </Stack>
    </Section>
  )
}
