"use client"

import Link from "next/link"
import { DarkModeToggle } from "./DarkModeToggle"
import { Aperture, Moon, Sun, MenuIcon } from "lucide-react"
import { useDictionary } from "../providers/DictionaryProvider"
import { LanguageToggle } from "./LanguageToggle"
import useWindowWidth from "@/app/src/hooks/useWindowWidth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const LARGE_SCREEN_THRESHOLD = 600

export default function NavBar() {

  const { dictionary } = useDictionary()
  const { header: dict } = dictionary

  const router = useRouter()

  const width = useWindowWidth()

  const isIframe = window.self !== window.top;

  return (
    <nav className="sticky inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950 w-fill">
      <div className="px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {
            width <= LARGE_SCREEN_THRESHOLD &&
            <LinksSmallScreen />
          }
            <a
              href="https://luxai.cin.ufpe.br/index.html"
              className="mr-auto flex items-center gap-2 text-lg font-semibold"
              target={isIframe ? 'parent' : '_self'}
            >
              <Aperture className="w-5 h-5" />
              <span>LuxAI</span>
            </a>
          <nav className="ml-5 flex items-center space-x-4">
            {
              width > LARGE_SCREEN_THRESHOLD &&
              <LinksLargeScreen />
            }
            <DarkModeToggle />
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </nav>
  )

  function LinksLargeScreen() {
    return (
      <>
        <PageLink
          href="/simpleRanking"
          text={dict.links.visionRanking}
        />
        <PageLink
          href="/llmRanking"
          text={dict.links.llmRanking}
        />
        <PageLink
          href="/info"
          text={dict.links.about}
        />
      </>
    )
  }

  function LinksSmallScreen() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="mx-2" asChild>
          <Button variant="outline" size="icon">
            <MenuIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MenuIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => router.push("/simpleRanking")}>
            {dict.links.visionRanking}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/llmRanking")}>
            {dict.links.llmRanking}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/info")}>
            {dict.links.about}
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}


function PageLink({ href, text }: { href: string, text: string }) {
  return (
    <Link
      href={href}
      className="font-medium text-sm border-b-2 border-transparent transition-colors hover:text-gray-900 hover:border-gray-100 dark:hover:text-gray-50 dark:hover:border-gray-800"
      prefetch={false}
    >
      {text}
    </Link>
  )
}
