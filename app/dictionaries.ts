import en from "@/dictionaries/en.json"
import pt from "@/dictionaries/pt.json"

const dictionaries = {
  en, 
  pt
}

export type Language = keyof typeof dictionaries

const languages: Language[] = Object.keys(dictionaries) as Language[]

export function isLanguage(lang: any): lang is Language {
  return languages.includes(lang)
}

export const getDictionary = (lang: Language = "en") => dictionaries[lang]