import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Image from 'next/image'
import { Link } from '../components/link'
import { RadioGroup } from './radio-group'
import { Title } from './title'
import { Progress } from '../components/progress'

export default function LangLevelStep() {
  return (
    <div className="h-full flex">
      <div className="w-1/2  hidden md:block bg-gradient-to-tr from-zinc-950 to-zinc-900">
        <Button size="icon" variant="secondary" className="mt-4 ml-4" asChild>
          <Link step={1} href="/get-started/2">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex flex-col items-center px-4 justify-center h-full">
          <Progress />
          <Image
            src="/assets/imgs/panda.png"
            width={400}
            height={267}
            alt="panda"
            className=" mb-3 rounded-md "
          />
          <Title />
        </div>
      </div>

      <RadioGroup />
    </div>
  )
}
