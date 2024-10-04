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
    content: string
}

function TextSection({ title, content }: TextSectionProps) {
    const formattedContent = content.split('\n').map((line, index) => {
        if (line.trim() === "") {
            return null;
        } else {
            return <TypographyP text={line}/>;
        }
    });

    return (
        <div>
            <TypographyH2 text={title} />
            {formattedContent}
        </div>
    );
}

