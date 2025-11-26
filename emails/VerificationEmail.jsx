import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

export default function VerificationEmail({ username, otp }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>🔐 Your verification code is: {otp}</Preview>

      <Section className="bg-gray-100 py-10 text-center">
        <Container className="bg-white max-w-lg mx-auto p-8 rounded-lg shadow-lg">
          <Heading as="h2" className="text-2xl font-bold text-gray-800 mb-4">
            Hello @{username}, 👋
          </Heading>

          <Text className="text-gray-600 text-lg mb-4">
            Thank you for signing up! Use the verification code below to
            complete your registration:
          </Text>

          <Text className="text-2xl font-bold bg-yellow-300 px-6 py-3 rounded-md inline-block text-gray-800 tracking-widest mb-6">
            {otp}
          </Text>

          <Button
            href={`${process.env.NEXTAUTH_URL}/verify/${encodeURIComponent(username)}?otp=${encodeURIComponent(otp)}`}
            className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-green-600 transition-all duration-300"
          >
            Verify Your Email
          </Button>

          <Text className="text-sm text-gray-500 mt-6">
            If you did not request this code, please ignore this email.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
