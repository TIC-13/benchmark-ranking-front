'use client'

import React, { useEffect, useState } from "react"

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
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
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import { Separator } from "@/components/custom/Separator";

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

    const [showSamples, setShowSamples] = useState(false)
    const [showPowerAndEnergy, setShowPowerAndEnergy] = useState(false)

    const [orderByEnergy, setOrderByEnergy] = useState(false)

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
            <div className="flex flex-1 justify-between">
                <TypographyH2 text="Ranking de modelos de visão" />
            </div>
            <DefaultCard
                title="Meus filtros"
                subtitle="Selecione modelos e quantizações que serão usados para calcular os resultados"
                contentClassName="flex flex-col gap-y-5"
            >
                <Accordion type="multiple" className="max-w-l">
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
                    <AccordionItemWithSwitch
                        data={quantizations}
                        setData={setQuantizations}
                        title="Quantizações"
                        getItemName={(item) => item.value}
                    />
                </Accordion>
                <SwitchWithLabel
                    label="Mostrar número de inferências"
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
                <ApplyFilterButton />
            </DefaultCard>
            {
                invalidModelsQuantizations.length > 0 &&
                <InvalidModelsAlert />
            }
            <Ranking 
                models={modelsToFetch} 
                quantizations={quantizationsToFetch} 
                showSamples={showSamples} 
                showPowerAndEnergy={showPowerAndEnergy}
                orderByEnergy={showPowerAndEnergy && orderByEnergy}
            />
        </MainContainer>
    )

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
                    <AccordionInCard
                        classNameOuterCard="border-warning-foreground"
                        labelClassName="text-warning-foreground font-bold"
                        contentClassName="flex flex-col gap-y-2"
                    >
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
    quantizations: Selectable<string>[],
    showSamples?: boolean,
    showPowerAndEnergy?: boolean,
    orderByEnergy?: boolean
}

function Ranking({ models, quantizations, showSamples = true, showPowerAndEnergy = true, orderByEnergy = false }: RankingLayerProps) {

    const rankingQuery = useSimpleRanking(
        models.filter(x => x.isSelected)
            .map(x => x.value.ml_model),
        quantizations.filter(x => x.isSelected)
            .map(x => x.value),
    )

    if (rankingQuery.isLoading || rankingQuery.data === undefined)
        return <LoadingFullScreen />

    let data = rankingQuery.data.map(inference =>
    ({
        ...inference,
        CPU: { ...inference.CPU, showSamples, showPowerAndEnergy },
        GPU: { ...inference.GPU, showSamples, showPowerAndEnergy },
        NNAPI: { ...inference.NNAPI, showSamples, showPowerAndEnergy },
    })
    )

    return (
        <DataTable
            columns={getColumns(orderByEnergy ? "energy": "speed")}
            data={data}
        />
    )
}

function arraysOfSelectableEquals(a: Selectable<any>[], b: Selectable<any>[]) {
    return JSON.stringify(a) === JSON.stringify(b)
}





