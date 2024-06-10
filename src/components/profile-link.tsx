import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { Link } from '@/navigation'
import { PartyPopperIcon, SparkleIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

type ProfileLinkProps = {
  className?: string
}

export const ProfileLink = async ({
  className,
  ...props
}: ProfileLinkProps) => {
  const { user } = await getAuth()
  const {
    green: { words },
    count: { wordsPerYear },
  } = await getWordsList()

  if (!user) return null

  return (
    <Link
      href="/profile"
      className={cn('cursor-pointer bg-zinc-800 rounded-xl', className)}
      {...props}
    >
      <div className="bg-gradient-to-tr from-zinc-800 via-zinc-800 to-yellow-200/10 rounded-xl  p-4">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
            {user.image && <AvatarImage src={user.image} />}
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
                Você está {((words.length / wordsPerYear) * 100).toFixed(2)}%
                mais próximo de se tornar fluente
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
      </div>
    </Link>
  )
}
