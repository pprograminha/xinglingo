import { textToSpeech } from '@/actions/ai/text-to-speech'
import { z } from 'zod'

export async function POST(req: Request) {
  // await withSubscription()
  const formData = await req.formData()

  try {
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
