import Image from 'next/image'

export function Loading() {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center  bg-zinc-950">
      <Image
        src="/assets/loading.gif"
        width="200"
        height="200"
        alt="Thank you"
      />
    </div>
  )
}
