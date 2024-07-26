"use client"

import * as React from "react"
import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDictionary } from "../providers/DictionaryProvider"

export function LanguageToggle({ className }: { className?: string }) {

    const { dictionary, language, setLanguage } = useDictionary()
    const { english, portuguese } = dictionary.languageToggle

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={className}>
                    <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Languages className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} aria-selected={language == "en"}>
                    {english}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("pt")} aria-selected={language == "pt"}>
                    {portuguese}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
