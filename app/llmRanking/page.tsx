'use client'

import React, { useState } from "react"

import { DataTable } from "./data-table";
import { DisplayMode, getColumns, isDisplayMode } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import DefaultCard from "@/components/custom/DefaultCard";
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import { Separator } from "@/components/custom/Separator";
import useLLMRanking from "./hooks/useLLMRanking";
import { DropdownMenuRadio } from "@/components/custom/DropdownRadio";
import capitalize from "@/utils/capitalize";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function DataQueryLayer() {
    return (
        <PageLayer />
    )
}

function PageLayer() {

    const { dictionary } = useDictionary()
    const { llmRanking: dict } = dictionary

    const [showSamples, setShowSamples] = useState(false)
    const [showPowerAndEnergy, setShowPowerAndEnergy] = useState(false)

    const [mode, setMode] = useState<DisplayMode>("total")

    const [orderByEnergy, setOrderByEnergy] = useState(false)

    return (
        <MainContainer>
            <div className="flex flex-1 justify-between">
                <TypographyH2 text={dict.title} />
            </div>
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
            </DefaultCard>
            <Ranking
                showSamples={showSamples}
                showPowerAndEnergy={showPowerAndEnergy}
                orderByEnergy={showPowerAndEnergy && orderByEnergy}
            />
        </MainContainer>
    )

    type RankingLayerProps = {
        showSamples: boolean,
        showPowerAndEnergy: boolean,
        orderByEnergy?: boolean
    }

    function Ranking({ showSamples, showPowerAndEnergy, orderByEnergy}: RankingLayerProps) {

        const rankingQuery = useLLMRanking()

        if (rankingQuery.isLoading || rankingQuery.data === undefined)
            return <LoadingFullScreen />

        console.log(rankingQuery.data)

        let data = rankingQuery.data.map(inference =>
        ({
            ...inference,
            result: { ...inference.result, showSamples, showPowerAndEnergy },
        })
        )

        return (
            <DataTable
                columns={getColumns(mode, orderByEnergy)}
                data={data}
            />
        )
    }
}