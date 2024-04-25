'use client'

import React, { useState } from "react"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TypographyH3 } from "@/components/typography/Typography";
import useSimpleRanking from "./hooks/useSimpleRanking";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import useModels from "./hooks/useModels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import useQuantizations from "./hooks/useQuantizations";

type Selectable = {
    name: string,
    isSelected: boolean
}

export default function DataQueryLayer() {
    const modelsQuery = useModels()
    const quantizationsQuery = useQuantizations()

    if (modelsQuery.isLoading || quantizationsQuery.isLoading ||
        modelsQuery.data === undefined || quantizationsQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <PageLayer
            modelsList={modelsQuery.data.map((x: string) => {
                return { name: x, isSelected: true }
            })}
            quantizationsList={quantizationsQuery.data.map((x: string) => {
                return { name: x, isSelected: true }
            })}
        />
    )
}

type PageLayerProps = {
    modelsList: Selectable[],
    quantizationsList: Selectable[],
}

function PageLayer({ modelsList, quantizationsList }: PageLayerProps) {

    const [models, setModels] = useState(modelsList)
    const [quantizations, setQuantizations] = useState(quantizationsList)

    const [modelsToFetch, setModelsToFetch] = useState(modelsList)
    const [quantizationsToFetch, setQuantizationsToFetch] = useState(quantizationsList)

    const refreshPending =
        !arraysOfSelectableEquals(models, modelsToFetch) ||
        !arraysOfSelectableEquals(quantizations, quantizationsToFetch)

    const onRefetch = () => {
        setModelsToFetch(models)
        setQuantizationsToFetch(quantizations)
    }

    return (
        <MainContainer>
            <TypographyH3 text="Ranking de aparelhos" />
            <Accordion type="multiple" className="max-w-l">
                <SelectionAccordionItem
                    data={models}
                    setData={setModels}
                    title="Selecionar modelos"
                />
                <SelectionAccordionItem
                    data={quantizations}
                    setData={setQuantizations}
                    title="Selecionar quantizações"
                />
            </Accordion>
            <div className="flex flex-row gap-x-5">
                <Button
                    onClick={onRefetch}
                    className="max-w-xs"
                    variant="default"
                >
                    Aplicar filtros
                </Button>
                {
                    refreshPending &&
                    <Badge variant="destructive">
                        Mudanças não salvas
                    </Badge>
                }
            </div>
            <Ranking models={modelsToFetch} quantizations={quantizationsToFetch} />
        </MainContainer>
    )
}

type RankingLayerProps = {
    models: Selectable[],
    quantizations: Selectable[]
}

function Ranking({ models, quantizations }: RankingLayerProps) {

    const rankingQuery = useSimpleRanking(
        models.filter(x => x.isSelected)
            .map(x => x.name),
        quantizations.filter(x => x.isSelected)
            .map(x => x.name),
    )

    if (rankingQuery.isLoading || rankingQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <DataTable columns={columns} data={rankingQuery.data} />
    )

}

type SelectionProps = {
    data: Selectable[],
    setData: React.Dispatch<React.SetStateAction<Selectable[]>>,
    title: string
}

function SelectionAccordionItem({ data, setData, title }: SelectionProps) {
    return (
        <AccordionItem value={title}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent className="flex flex-row gap-x-3 gap-y-3 flex-wrap">
                {
                    data.map((x, idx) =>
                        <Badge
                            variant={x.isSelected ? "default" : "outline"}
                            onClick={() =>
                                setData((prev) => {
                                    const arr = [...prev]
                                    arr[idx] = { name: x.name, isSelected: !prev[idx].isSelected }
                                    return arr
                                })
                            }
                        >
                            {x.name}
                        </Badge>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    );
}

function arraysOfSelectableEquals(a: Selectable[], b: Selectable[]) {

    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].name !== b[i].name || a[i].isSelected !== b[i].isSelected) return false;
    }

    return true;
}





