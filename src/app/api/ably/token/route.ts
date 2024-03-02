import { env } from '@/env'
import * as Ably from 'ably/promises'

export async function POST(req: Request) {
  const clientId =
    ((await req.formData()).get('clientId') as string) || 'NO_CLIENT_ID'
  const client = new Ably.Rest(env.ABLY_API_KEY)

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId,
  })

  return Response.json(tokenRequestData)
}
