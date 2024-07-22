import Link from "next/link"
import { DarkModeToggle } from "./DarkModeToggle"
import { Aperture } from "lucide-react"

export default function NavBar() {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950">
      <div className="px-4 md:px-6">
        <div className="flex h-14 items-center">
          <Link href="#" className="mr-auto flex items-center gap-2 text-lg font-semibold" prefetch={false}>
            <Aperture className="w-5 h-5" />
            <span>LuxAI</span>
          </Link>
          <nav className="ml-10 flex items-center space-x-4">
            <Link
              href="/simpleRanking"
              className="font-medium text-sm border-b-2 border-transparent transition-colors hover:text-gray-900 hover:border-gray-100 dark:hover:text-gray-50 dark:hover:border-gray-800"
              prefetch={false}
            >
              Ranking de visão 
            </Link>
            <Link
              href="/llmRanking"
              className="font-medium text-sm border-b-2 border-transparent transition-colors hover:text-gray-900 hover:border-gray-100 dark:hover:text-gray-50 dark:hover:border-gray-800"
              prefetch={false}
            >
              Ranking de LLMs
            </Link>
            <DarkModeToggle/>
          </nav>
        </div>
      </div>
    </nav>
  )
}
