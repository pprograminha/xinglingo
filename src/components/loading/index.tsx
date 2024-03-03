export function Loading() {
  return (
    <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
      <div
        className="p-1 bg-gradient-to-tr animate-spin from-green-500 to-blue-500 via-purple-500 rounded-full"
        style={{
          boxShadow:
            '5px 5px 5px #22c55e, 5px -5px 5px #3b82f6, -5px 5px 5px #a855f7',
        }}
      >
        <div className="bg-white dark:bg-zinc-900 rounded-full">
          <div className="w-24 h-24 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
