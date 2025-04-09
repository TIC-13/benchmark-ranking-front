"use client"

import MainContainer from "@/components/custom/MainContainer";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { TypographyH2, TypographyP } from "@/components/typography/Typography";

export default function InfoPage() {

    const { dictionary: dict } = useDictionary()

    const { title, content } = dict.about.aboutLuxAI

    return (
        <MainContainer>
            <TextSection title={title} content = {content}/>
        </MainContainer>
    )
}

type TextSectionProps = {
    title: string,
    content: JSX.Element
}

function TextSection({ title, content }: TextSectionProps) {

    return (
        <div>
            <TypographyH2 text={title} />
            <br/>
            {content}
        </div>
    );
}

