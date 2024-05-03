'use client'

import React, { useEffect, useState } from "react"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
import useSimpleRanking from "./hooks/useSimpleRanking";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import useModels, { Model } from "./hooks/useModels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Accordion,
} from "@/components/ui/accordion"
import useQuantizations from "./hooks/useQuantizations";
import AccordionInCard from "@/components/custom/AccordionInCard";
import DefaultCard from "@/components/custom/DefaultCard";
import AccordionItemWithSwitch, { Selectable } from "@/components/custom/AccordionItemWithSwitch";
import DefaultAccordionItem from "@/components/custom/DefaultAccordionItem";

export default function DataQueryLayer() {
    const modelsQuery = useModels()
    const quantizationsQuery = useQuantizations()

    if (modelsQuery.isLoading || quantizationsQuery.isLoading ||
        modelsQuery.data === undefined || quantizationsQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <PageLayer
            modelsList={modelsQuery.data.map(x => {
                return { value: x, isSelected: true }
            })}
            quantizationsList={quantizationsQuery.data.map(x => {
                return { value: x, isSelected: true }
            })}
        />
    )
}

type PageLayerProps = {
    modelsList: Selectable<Model>[],
    quantizationsList: Selectable<string>[],
}

type Category = {
    value: string,
    label: string
}

const CATEGORIES: Category[] = [
    { value: "CLASSIFICATION", label: "Classificação" },
    { value: "DETECTION", label: "Detecção" },
    { value: "SEGMENTATION", label: "Segmentação" },
    { value: "LANGUAGE", label: "Linguagem" }
]

function PageLayer({ modelsList, quantizationsList }: PageLayerProps) {

    const [models, setModels] = useState(modelsList)
    const [quantizations, setQuantizations] = useState(quantizationsList)

    const [modelsToFetch, setModelsToFetch] = useState(modelsList)
    const [quantizationsToFetch, setQuantizationsToFetch] = useState(quantizationsList)

    const [invalidModelsQuantizations, setInvalidModelsQuantizations] = useState(getInvalidModelsQuantizations())

    const refreshPending =
        !arraysOfSelectableEquals(models, modelsToFetch) ||
        !arraysOfSelectableEquals(quantizations, quantizationsToFetch)

    const onRefetch = () => {
        setModelsToFetch(models)
        setQuantizationsToFetch(quantizations)
    }

    useEffect(() => {
        setInvalidModelsQuantizations(getInvalidModelsQuantizations())
    }, [modelsToFetch, quantizationsToFetch])

    return (
        <MainContainer>
            <TypographyH2 text="Ranking de aparelhos" />
            <DefaultCard
                title="Meus filtros"
                subtitle="Selecione modelos e quantizações que serão usados para calcular os resultados"
                contentClassName="flex flex-col gap-y-5"
            >
                <Filters />
                <ApplyFilterButton />
            </DefaultCard>
            {
                invalidModelsQuantizations.length > 0 &&
                <InvalidModelsAlert />
            }
            <Ranking models={modelsToFetch} quantizations={quantizationsToFetch} />
        </MainContainer>
    )

    function Filters() {
        return (
            <Accordion type="multiple" className="max-w-l">
                <ModelsFilter />
                <QuantizationFilters />
            </Accordion>
        )
    }

    function ModelsFilter() {
        return (
            <DefaultAccordionItem
                value="modelos"
                triggerLabel="Modelos"
            >
                {
                    CATEGORIES.map(category =>
                        <AccordionItemWithSwitch
                            data={models}
                            setData={setModels}
                            title={category.label}
                            getItemName={(item) => item.value.ml_model}
                            showItem={(item) => item.value.category === category.value}
                        />
                    )
                }
                <AccordionItemWithSwitch
                    data={models}
                    setData={setModels}
                    title="Outros"
                    getItemName={(item) => item.value.ml_model}
                    showItem={(item) => !CATEGORIES.map(x => x.value)
                        .includes(item.value.category)
                    }
                />
            </DefaultAccordionItem>
        )
    }

    function QuantizationFilters() {
        return (
            <AccordionItemWithSwitch
                data={quantizations}
                setData={setQuantizations}
                title="Quantizações"
                getItemName={(item) => item.value}
            />
        )
    }

    function ApplyFilterButton() {
        return (
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
        )
    }

    function InvalidModelsAlert() {
        return (
            <>
                {
                    invalidModelsQuantizations.length > 0 &&
                    <AccordionInCard contentClassName="flex flex-col gap-y-2">
                        {
                            invalidModelsQuantizations.map(quant =>
                                <DefaultCard
                                    title={quant.quantization}
                                    subtitle="Modelos não suportados"
                                    className="flex flex-row items-center bg-secondary"
                                    titleClassName="text-lg"
                                    contentClassName="flex flex-wrap p-0 justify-center gap-x-2 gap-y-2"
                                >
                                    {
                                        quant.models.map(model =>
                                            <Badge>{model.ml_model}</Badge>
                                        )
                                    }
                                </DefaultCard>
                            )
                        }
                    </AccordionInCard>
                }
            </>
        )
    }

    function getInvalidModelsQuantizations() {

        const byQuant = quantizationsToFetch
            .filter(quant => quant.isSelected)
            .map(quant => {
                return {
                    quantization: quant.value,
                    models: modelsToFetch.filter(model =>
                        model.isSelected && !model.value.quantizations.includes(quant.value)
                    ).map(model => model.value)
                }
            })
        return byQuant
    }
}

type RankingLayerProps = {
    models: Selectable<Model>[],
    quantizations: Selectable<string>[]
}

function Ranking({ models, quantizations }: RankingLayerProps) {

    const rankingQuery = useSimpleRanking(
        models.filter(x => x.isSelected)
            .map(x => x.value.ml_model),
        quantizations.filter(x => x.isSelected)
            .map(x => x.value),
    )

    if (rankingQuery.isLoading || rankingQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <DataTable columns={columns} data={rankingQuery.data} />
    )

}

function arraysOfSelectableEquals(a: Selectable<any>[], b: Selectable<any>[]) {
    return JSON.stringify(a) === JSON.stringify(b)
}





