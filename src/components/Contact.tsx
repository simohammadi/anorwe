import { useState } from "react"
import {
  Box,
  Button,
  chakra,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import { submitLead } from "@/lib/web3forms"
import { burst } from "@/lib/sky"
import { brand, contact } from "@/content/site"
import { Eyebrow, Section } from "@/components/Section"
import { Mark } from "@/components/Logo"

interface FormState {
  name: string
  email: string
  company: string
  message: string
  botcheck: string
}

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  botcheck: "",
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 16px text keeps iOS from zooming into the field on focus.
const fieldStyle = {
  fontSize: "16px",
  px: "4",
  rounded: "xl",
  bg: "bg.panel",
  border: "1px solid",
  borderColor: "border",
  color: "bone",
  _placeholder: { color: "fg.subtle" },
  _focusVisible: { borderColor: "rgba(246,167,48,0.6)", outline: "none", boxShadow: "none" },
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      if (sent) setSent(false)
    }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Please enter your name."
    if (!form.email.trim()) next.email = "Please enter your email."
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email."
    if (!form.message.trim()) next.message = "Tell us a little about your project."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const result = await submitLead(form)
    setSubmitting(false)

    if (result.ok) {
      burst()
      setSent(true)
      setForm(EMPTY)
      setErrors({})
    } else {
      toaster.create({
        title: "Couldn't send your message",
        description: result.error,
        type: "error",
      })
    }
  }

  return (
    <Section id="contact" maxW="3xl">
      <Stack gap="0" align="center" textAlign="center">
        <Mark width={{ base: "140px", md: "200px" }} mb={{ base: 8, md: 10 }} />
        <Eyebrow>{contact.eyebrow}</Eyebrow>
        <Heading
          as="h2"
          mt="4"
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="500"
          lineHeight="1.1"
          letterSpacing="-0.01em"
        >
          {contact.heading}{" "}
          <chakra.em fontStyle="italic" fontWeight="300" color="flare">
            {contact.headingAccent}
          </chakra.em>
        </Heading>
        <Text mt="4" maxW="lg" fontSize={{ base: "md", md: "lg" }} color="fg.muted">
          {contact.subheading}
        </Text>
      </Stack>

      <chakra.form
        onSubmit={onSubmit}
        noValidate
        mt={{ base: 10, md: 12 }}
        p={{ base: 5, md: 9 }}
        rounded="18px"
        border="1px solid"
        borderColor="border"
        bg="glass"
        backdropFilter="blur(16px)"
      >
        <Stack gap="5">
          <Flex direction={{ base: "column", md: "row" }} gap="5">
            <Field.Root invalid={!!errors.name} flex="1">
              <Field.Label color="bone">Name</Field.Label>
              <Input {...fieldStyle} h="12" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.email} flex="1">
              <Field.Label color="bone">Email</Field.Label>
              <Input
                {...fieldStyle}
                h="12"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder="jane@company.com"
              />
              <Field.ErrorText>{errors.email}</Field.ErrorText>
            </Field.Root>
          </Flex>

          <Field.Root>
            <Field.Label color="bone">
              Company
              <Text as="span" color="fg.subtle" fontWeight="400" ms="1.5">
                Optional
              </Text>
            </Field.Label>
            <Input {...fieldStyle} h="12" autoComplete="organization" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
          </Field.Root>

          <Field.Root invalid={!!errors.message}>
            <Field.Label color="bone">What are you building?</Field.Label>
            <Textarea
              {...fieldStyle}
              py="3"
              rows={4}
              value={form.message}
              onChange={set("message")}
              placeholder="A few lines on your goal, timeline and stack"
            />
            <Field.ErrorText>{errors.message}</Field.ErrorText>
          </Field.Root>

          {/* Honeypot: hidden from humans, catches bots */}
          <Box position="absolute" left="-9999px" w="1px" h="1px" overflow="hidden" aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" value={form.botcheck} onChange={set("botcheck")} />
          </Box>

          <Button
            type="submit"
            data-intent=""
            loading={submitting}
            loadingText="Sending"
            disabled={sent}
            size="lg"
            h="12"
            px="8"
            rounded="full"
            bg="bone"
            color="char"
            fontWeight="500"
            _hover={{ bg: "flare" }}
            _disabled={{ opacity: 1, bg: "flare", cursor: "default" }}
          >
            {sent ? contact.sentLabel : contact.buttonLabel}
          </Button>

          <Text fontSize="sm" color="fg.subtle" textAlign="center">
            Prefer email? Reach us at{" "}
            <chakra.a href={`mailto:${brand.email}`} color="sand" textDecoration="underline" textUnderlineOffset="3px">
              {brand.email}
            </chakra.a>
          </Text>
        </Stack>
      </chakra.form>
    </Section>
  )
}
