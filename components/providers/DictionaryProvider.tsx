'use client'

import React, { useState } from "react"
import { getDictionary, isLanguage, Language } from "@/app/dictionaries"

const LANGUAGE_KEY = "language"

function getStoredLanguage() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LANGUAGE_KEY)
  }
  return null
}

function storeLanguage(newLang: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY, newLang)
  }
}

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

type DictionaryContextValue = {
  dictionary: Dictionary,
  language: Language,
  updateLanguage: (lang: Language) => void
}

const DictionaryContext = React.createContext<DictionaryContextValue | null>(null)

export default function DictionaryProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const savedLanguage = getStoredLanguage()

  const [language, setLanguage] = useState<Language>(isLanguage(savedLanguage) ? savedLanguage : "pt")
  const dictionary = getDictionary(language)

  const updateLanguage = (newLang: Language) => {
    storeLanguage(newLang)
    setLanguage(newLang)
  }

  const value = {
    dictionary, language, updateLanguage
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