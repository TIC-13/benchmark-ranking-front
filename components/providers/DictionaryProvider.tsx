'use client'

import React, { useState } from "react"
import { getDictionary, Language } from "@/app/dictionaries"

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

type DictionaryContextValue = {
  dictionary: Dictionary,
  language: Language,
  setLanguage: (lang: Language) => void
}

const DictionaryContext = React.createContext<DictionaryContextValue | null>(null)

export default function DictionaryProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [language, setLanguage] = useState<Language>("pt")
  const dictionary = getDictionary(language)

  const value = {
    dictionary, language, setLanguage
  }

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  )

}

export function useDictionary() {
  const dictionary = React.useContext(DictionaryContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}