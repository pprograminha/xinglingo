import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { cn } from '@/lib/utils'
import { AudioWaveformIcon } from 'lucide-react'
import { Link } from '@/navigation'
import { HtmlHTMLAttributes } from 'react'

type LogoProps = HtmlHTMLAttributes<HTMLDivElement>

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn('py-1', className)} {...props}>
      <Link href="/" className="flex items-center justify-center gap-2">
        <AudioWaveformIcon />
        <h1 className={`${pixelatedFont()}`}>Xinglingo</h1>
      </Link>
    </div>
  )
}
