import { textToSpeech } from '@/actions/ai/text-to-speech'
import { getAuth } from '@/lib/auth/get-auth'
import { z } from 'zod'

export async function POST(req: Request) {
  const formData = await req.formData()

  try {
    const { user } = await getAuth()

    if (!user) {
      throw new Error('UserError')
    }

    const conversationId = formData.get('conversationId')

    const safeParse = z
      .object({
        conversationId: z.string().uuid(),
      })
      .safeParse({
        conversationId,
      })

    if (safeParse.success === false) {
      throw new Error('ZodValidationError')
    }

    await textToSpeech({
      conversationId: safeParse.data.conversationId,
      voice: 'nova',
    })

    return Response.json({
      ok: 1,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        message: (error as Error)?.message,
      },
      {
        status: 400,
      },
    )
  }
}
