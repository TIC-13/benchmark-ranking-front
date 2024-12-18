'use client'

import React, { useState } from "react"

import { DataTable } from "@/components/custom/DataTable";
import { DisplayMode, getColumns, isDisplayMode } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import DefaultCard from "@/components/custom/DefaultCard";
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import useLLMRanking from "./hooks/useLLMRanking";
import { DropdownMenuRadio } from "@/components/custom/DropdownRadio";
import capitalize from "@/utils/capitalize";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { Accordion } from "@/components/ui/accordion";
import DefaultAccordionItem from "@/components/custom/DefaultAccordionItem";
import { InfoIcon } from "lucide-react";
import useLLMModels from "./hooks/useLLMModels";
import { Selectable } from "@/components/custom/BadgePicker";
import AccordionBadgePicker, { useAccordionBadgePicker } from "@/components/custom/AccordionBadgePicker";
import phoneNames from "@/app/src/utils/phone_names.json"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
        { value: "cpu", label: cpu },
        { value: "gpu", label: gpu },
        { value: "ram", label: ram }
    ]

    return (
        <MainContainer>
            <div className="flex flex-1 justify-between">
                <TypographyH2 text={dict.title} />
            </div>
            <p className="max-w-2xl">{dict.description}</p>
            <Accordion type="multiple">
                <DefaultAccordionItem
                    value="help"
                    triggerLabel={dict.help.label}
                >
                    {
                        dict.help.content.map(({ value, label, content }) =>
                            <DefaultAccordionItem
                                value={value}
                                triggerLabel={label}
                            >
                                <p>{content}</p>
                            </DefaultAccordionItem>

                        )
                    }
                </DefaultAccordionItem>
            </Accordion>
            <DefaultCard
                title={dict.filters.title}
                subtitle=""
                contentClassName="flex flex-col gap-y-10"
            >
                <CustomRadioGroup<DisplayMode>
                    items={radioOptions}
                    setPickedItem={setMode}
                />
                <SwitchWithLabel
                    label={dict.filters.toggles.conversationNumber}
                    checked={showSamples}
                    onCheckedChange={setShowSamples}
                />
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
                models={models.filter(x => x.isSelected).map(x => x.value)}
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


type RadioItem<T extends string> = {
    value: T,
    label: string
}

type RadioGroupProps<T extends string> = {
    items: RadioItem<T>[],
    setPickedItem: (value: T) => void
}

function CustomRadioGroup<T extends string>({ items, setPickedItem }: RadioGroupProps<T>) {
    return (
        <RadioGroup
            defaultValue={items[0].value}
            onValueChange={(val) => setPickedItem(val as T)}
            className="flex flex-1 flex-row justify-between items-center flex-wrap gap-y-5"
        >
            {
                items.map(({ value, label }) =>
                    <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value} className="w-20">{label}</Label>
                    </div>
                )
            }
        </RadioGroup>
    )
}