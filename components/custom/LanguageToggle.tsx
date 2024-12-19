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
import { Language } from "@/app/dictionaries"

export function LanguageToggle({ className }: { className?: string }) {

    const { dictionary, language, updateLanguage } = useDictionary()
    const { english, portuguese } = dictionary.languageToggle

    const LANGUAGE_LABELS: Record<Language, string> = {
        en: english,
        pt: portuguese,
    }

    const languages: { label: string; value: Language }[] =
        Object.entries(LANGUAGE_LABELS).map(([value, label]) => ({
            label,
            value: value as Language
        }))

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
                {
                    languages.map(({ label, value }) =>
                        <DropdownMenuItem
                            onClick={() => updateLanguage(value)}
                            aria-selected={language == value}
                        >
                            {label}
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
