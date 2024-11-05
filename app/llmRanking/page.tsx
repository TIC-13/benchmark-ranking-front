'use client'

import React, { useState } from "react"

import { DataTable } from "./data-table";
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
import { LoadingSpinner } from "@/components/custom/LoadingSpinner";
import { Selectable } from "@/components/custom/BadgePicker";
import AccordionBadgePicker, { useAccordionBadgePicker } from "@/components/custom/AccordionBadgePicker";

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
    const [showPowerAndEnergy, setShowPowerAndEnergy] = useState(false)

    const [mode, setMode] = useState<DisplayMode>("total")

    const [orderByEnergy, setOrderByEnergy] = useState(false)

    const [models, setModels] = useState(modelsFetched)

    const {items, setItems} = useAccordionBadgePicker([{value: dict.filters.models.label, label: dict.filters.models.label}])

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
                contentClassName="flex flex-col gap-y-5"
            >
                <div className="w-56">
                    <DropdownMenuRadio
                        outerLabel={capitalize(mode ?? "")}
                        innerLabel="Modos"
                        value={mode}
                        setValue={(value: string) => isDisplayMode(value) && setMode(value)}
                        options={[
                            { value: "total", label: dict.filters.mode.total },
                            { value: "prefill", label: dict.filters.mode.prefill },
                            { value: "decode", label: dict.filters.mode.decode }
                        ]}
                    />
                </div>
                <SwitchWithLabel
                    label={dict.filters.toggles.conversationNumber}
                    checked={showSamples}
                    onCheckedChange={setShowSamples}
                />
                <Accordion type = "multiple" value={items} onValueChange={setItems}>
                    <AccordionBadgePicker
                        data={models}
                        setData={setModels}
                        title={dict.filters.models.label}
                        getItemName={(item) => item.value}
                    />
                </Accordion>

                {/*
                <Separator />
                <div className="flex flex-row flex-wrap gap-x-10 gap-y-5">
                    <SwitchWithLabel
                        label={dict.filters.toggles.showPowerAndEnergy}
                        checked={showPowerAndEnergy}
                        onCheckedChange={setShowPowerAndEnergy}
                    />
                    {
                        showPowerAndEnergy &&
                        <SwitchWithLabel
                            label={dict.filters.toggles.orderByPowerAndEnergy}
                            checked={orderByEnergy}
                            onCheckedChange={setOrderByEnergy}
                        />
                    }
                </div>
                */}
            </DefaultCard>
            <span className="flex items-center gap-x-3 font-light"><InfoIcon />{dict.phoneAlert}</span>
            <Ranking
                models={models.filter(x => x.isSelected).map(x => x.value)}
                showSamples={showSamples}
                showPowerAndEnergy={showPowerAndEnergy}
                orderByEnergy={showPowerAndEnergy && orderByEnergy}
            />
        </MainContainer>
    )

    type RankingLayerProps = {
        models: string[],
        showSamples: boolean,
        showPowerAndEnergy: boolean,
        orderByEnergy?: boolean
    }

    function Ranking({ models, showSamples, showPowerAndEnergy, orderByEnergy }: RankingLayerProps) {

        const rankingQuery = useLLMRanking(models)

        let data = rankingQuery.data?.map(inference =>
        ({
            ...inference,
            result: { ...inference.result, showSamples, showPowerAndEnergy },
        })
        ) ?? []

        return (
            <DataTable
                columns={getColumns(mode, orderByEnergy)}
                data={data}
                isLoading={rankingQuery.isLoading || rankingQuery.isRefetching}
            />
        )
    }
}