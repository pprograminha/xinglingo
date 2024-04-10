import { NextIntlClientProvider, useMessages } from 'next-intl'

export const NextIntlProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const messages = useMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
