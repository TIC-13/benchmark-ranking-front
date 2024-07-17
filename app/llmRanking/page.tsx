'use client'

import React, { useState } from "react"

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import DefaultCard from "@/components/custom/DefaultCard";
import { DarkModeToggle } from "@/components/custom/DarkModeToggle";
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import { Separator } from "@/components/custom/Separator";
import useLLMRanking from "./hooks/useLLMRanking";
import { DropdownMenuRadio } from "@/components/custom/DropdownRadio";
import capitalize from "@/utils/capitalize";

export default function DataQueryLayer() {
    return (
        <PageLayer />
    )
}

function PageLayer() {

    const [showSamples, setShowSamples] = useState(false)
    const [showPowerAndEnergy, setShowPowerAndEnergy] = useState(false)

    const [mode, setMode] = useState<"prefill" | "decode">("decode")

    const [orderByEnergy, setOrderByEnergy] = useState(false)

    return (
        <MainContainer>
            <div className="flex flex-1 justify-between">
                <TypographyH2 text="Ranking de LLMs" />
                <DarkModeToggle />
            </div>
            <DefaultCard
                title="Meus filtros"
                subtitle=""
                contentClassName="flex flex-col gap-y-5"
            >
                <div className="w-56">
                    <DropdownMenuRadio
                        outerLabel={capitalize(mode ?? "")}
                        innerLabel="Modos"
                        value={mode}
                        setValue={(value: string) => (value == "prefill" || value == "decode") && setMode(value)}
                        options={[
                            { value: "prefill", label: "Prefill" }, 
                            { value: "decode", label: "Decode" }
                        ]}
                    />
                </div>

                <SwitchWithLabel
                    label="Mostrar número de conversas"
                    checked={showSamples}
                    onCheckedChange={setShowSamples}
                />
                <Separator />
                <div className="flex flex-row flex-wrap gap-x-10 gap-y-5">
                    <SwitchWithLabel
                        label="Mostrar potência e energia consumida"
                        checked={showPowerAndEnergy}
                        onCheckedChange={setShowPowerAndEnergy}
                    />
                    {
                        showPowerAndEnergy &&
                        <SwitchWithLabel
                            label="Ordenar por energia consumida"
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