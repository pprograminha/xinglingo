import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { PartyPopperIcon, SparkleIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ProfileLinkSkeleton } from './skeleton'
import { getTranslations } from 'next-intl/server'

export const ProfileLinkContent = async () => {
  const { user } = await getAuth()
  const t = await getTranslations()
  const {
    green: { words },
    count: { wordsPerYear },
  } = await getWordsList()

  if (!user) return <ProfileLinkSkeleton />

  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          <AvatarImage src={user.image || undefined} />
        </Avatar>

        <div className="flex gap-2 items-center">
          <span>{user.fullName}</span>
          <SparkleIcon className="w-5 text-yellow-400" />
        </div>
      </div>
      <div className="text-xs mt-2">
        {words.length < wordsPerYear ? (
          <>
            <h1>
              {t('You are {value}% closer to becoming fluent', {
                value: ((words.length / wordsPerYear) * 100).toFixed(2),
              })}
            </h1>
            <div className="p-2 border border-yellow-200 inline-block rounded-md mt-2">
              <span className="text-yellow-400">{wordsPerYear}</span> /{' '}
              <span className="text-yellow-400">{words.length}</span>
            </div>
          </>
        ) : (
          <h1 className="flex gap-2 items-center">
            Você provavelmente já é fluente{' '}
            <PartyPopperIcon className="text-green-400" />
            <PartyPopperIcon className="text-orange-400" />
          </h1>
        )}
      </div>
    </>
  )
}
