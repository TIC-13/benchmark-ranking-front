'use client'

import React, { useState } from "react"

import { DataTable } from "@/components/custom/DataTable";
import { DisplayMode, getColumns } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import DefaultCard from "@/components/custom/DefaultCard";
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import useLLMRanking from "./hooks/useLLMRanking";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { Accordion } from "@/components/ui/accordion";
import DefaultAccordionItem from "@/components/custom/DefaultAccordionItem";
import { InfoIcon } from "lucide-react";
import useLLMModels from "./hooks/useLLMModels";
import { getSelectedValues, Selectable } from "@/components/custom/BadgePicker";
import AccordionBadgePicker, { useAccordionBadgePicker } from "@/components/custom/AccordionBadgePicker";
import phoneNames from "@/app/src/utils/phone_names.json"
import RadioButtonsGroup, { RadioItem } from "@/components/custom/RadioButtonsGroup";
import WrapSeparatorBottom from "@/components/custom/WrapSeparatorBottom";
import HelpAccordion from "@/components/custom/HelpAccordion";
import { RankingDescription } from "@/components/custom/RankingDescription";

export default function DataQueryLayer() {

    const { data: models, isError, isLoading } = useLLMModels()

    if (isError)
        return "Error loading the page"

    if (isLoading)
        return <LoadingFullScreen />

    return (
        <PageLayer
            modelsFetched={models ? models.map(x => ({
                value: x.name,
                isSelected: true
            })) : []}
        />
    )
}

type PageLayerProps = {
    modelsFetched: Selectable<string>[]
}

function PageLayer({ modelsFetched }: PageLayerProps) {

    const { dictionary } = useDictionary()
    const { llmRanking: dict } = dictionary

    const [showSamples, setShowSamples] = useState(false)
    const [mode, setMode] = useState<DisplayMode>("total")
    const [models, setModels] = useState(modelsFetched)
    const { items, setItems } = useAccordionBadgePicker([{ value: dict.filters.models.label, label: dict.filters.models.label }])

    const { total, prefill, decode, cpu, gpu, ram } = dict.filters.mode

    const radioOptions: RadioItem<DisplayMode>[] = [
        { value: "total", label: total },
        { value: "prefill", label: prefill },
        { value: "decode", label: decode },
        //{ value: "cpu", label: cpu },
        { value: "gpu", label: gpu },
        { value: "ram", label: ram }
    ]

    return (
        <MainContainer>
            <div className="flex flex-1 justify-between">
                <TypographyH2 text={dict.title} />
            </div>

            <RankingDescription
                description={dict.description}
                cardProps={{
                    title: dict.appCard.title,
                    text: dict.appCard.description,
                    imgSrc: "/blue_llama.png",
                    link: "https://luxai.cin.ufpe.br/benchmarks.html"
                }}
            />

            <HelpAccordion
                helpLabel={dict.help.label}
                helpContent={dict.help.content}
            />
            <DefaultCard
                title={dict.filters.title}
                contentClassName="flex flex-col gap-y-5"
            >
                <WrapSeparatorBottom>
                    <RadioButtonsGroup<DisplayMode>
                        items={radioOptions}
                        setPickedItem={setMode}
                    />
                </WrapSeparatorBottom>
                <WrapSeparatorBottom>
                    <SwitchWithLabel
                        label={dict.filters.toggles.conversationNumber}
                        checked={showSamples}
                        onCheckedChange={setShowSamples}
                    />
                </WrapSeparatorBottom>
                <Accordion type="multiple" value={items} onValueChange={setItems}>
                    <AccordionBadgePicker
                        data={models}
                        setData={setModels}
                        title={dict.filters.models.label}
                        getItemName={(item) => item.value}
                    />
                </Accordion>
            </DefaultCard>
            <span className="flex items-center gap-x-3 font-light"><InfoIcon />{dict.phoneAlert}</span>
            <Ranking
                models={getSelectedValues(models)}
                mode={mode}
                showSamples={showSamples}
            />
        </MainContainer>
    )

    type RankingLayerProps = {
        models: string[],
        mode: DisplayMode,
        showSamples: boolean,
    }

    function Ranking({ models, mode, showSamples }: RankingLayerProps) {

        const rankingQuery = useLLMRanking(models)

        let data = rankingQuery.data?.map(inference =>
        ({
            ...inference,
            result: { ...inference.result, showSamples },
            phone: { ...inference.phone, phone_model: ((phoneNames as any)[inference.phone.phone_model] ?? inference.phone.phone_model) }
        })
        ) ?? []

        return (
            <DataTable
                columns={getColumns(mode)}
                data={data}
                isLoading={rankingQuery.isLoading || rankingQuery.isRefetching}
            />
        )
    }
}
