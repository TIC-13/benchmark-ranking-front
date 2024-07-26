import en from "@/dictionaries/en.json"
import pt from "@/dictionaries/pt.json"

const dictionaries = {
  en, pt
}
 
export type Language = keyof typeof dictionaries

export const getDictionary = (lang: Language = "en") => dictionaries[lang]