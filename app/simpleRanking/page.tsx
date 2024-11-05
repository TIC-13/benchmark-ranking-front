'use client'

import React, { useEffect, useState } from "react"

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { TypographyH2, TypographyP } from "@/components/typography/Typography";
import useSimpleRanking from "./hooks/useSimpleRanking";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";
import useModels, { Model } from "./hooks/useModels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Accordion
} from "@/components/ui/accordion"
import useQuantizations from "./hooks/useQuantizations";
import AccordionInCard from "@/components/custom/AccordionInCard";
import DefaultCard from "@/components/custom/DefaultCard";
import AccordionBadgePicker, { useAccordionBadgePicker } from "@/components/custom/AccordionBadgePicker";
import DefaultAccordionItem from "@/components/custom/DefaultAccordionItem";
import { Separator } from "@/components/custom/Separator";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import SwitchWithLabel from "@/components/custom/SwitchWithLabel";
import TextWarning from "@/components/custom/TextWarning";
import BadgePicker, { Selectable } from "@/components/custom/BadgePicker";

export default function DataQueryLayer() {
    const modelsQuery = useModels()
    const quantizationsQuery = useQuantizations()

    if (modelsQuery.isLoading || quantizationsQuery.isLoading ||
        modelsQuery.data === undefined || quantizationsQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <PageLayer
            modelsList={modelsQuery.data.map(x => {
                return { 
                    value: x, 
                    isSelected: true, 
                    tooltipContent: x.quantizations.join(", ")
                }
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

export type Category = {
    value: string,
    label: string
}

function PageLayer({ modelsList, quantizationsList }: PageLayerProps) {


    const { dictionary } = useDictionary()
    const { visionRanking: dict } = dictionary
    const { classification, detection, segmentation, other } = dict.filters.models.types

    const CATEGORIES: Category[] = [
        { value: "CLASSIFICATION", label: classification },
        { value: "DETECTION", label: detection },
        { value: "SEGMENTATION", label: segmentation },
    ]

    const CATEGORY_OTHER: Category = {value: "OTHER", label: other}

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


    const { items, setItems, addItem, removeItem } = useAccordionBadgePicker([...CATEGORIES, CATEGORY_OTHER])

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
                subtitle={dict.filters.subtitle}
                contentClassName="flex flex-col gap-y-5"
            >
                <Accordion type="multiple" className="max-w-l">
                    <DefaultAccordionItem
                        value="modelos"
                        triggerLabel={dict.filters.models.label}
                    >
                        <Accordion
                            type="multiple"
                            value={items}
                            onValueChange={setItems}
                        >
                            {
                                CATEGORIES.map(category =>
                                    <AccordionBadgePicker<Model>
                                        data={models}
                                        setData={setModels}
                                        title={category.label}
                                        getItemName={(item) => item.value.ml_model}
                                        showItem={(item) => item.value.category === category.value}
                                        openSelf={() => addItem(category.label)}
                                        closeSelf={() => removeItem(category.label)}
                                    />
                                )
                            }
                            <AccordionBadgePicker<Model>
                                data={models}
                                setData={setModels}
                                title={other}
                                getItemName={(item) => item.value.ml_model}
                                showItem={(item) => !CATEGORIES.map(x => x.value)
                                    .includes(item.value.category)
                                }
                                openSelf={() => addItem(other)}
                                closeSelf={() => removeItem(other)}
                            />
                        </Accordion>
                    </DefaultAccordionItem>
                </Accordion>
                <BadgePicker<string>
                    data={quantizations}
                    setData={setQuantizations}
                    title={dict.filters.quantizations}
                    getItemName={(item) => item.value}
                    noLessThanOneSelected={true}
                />
                <Separator/>
                <SwitchWithLabel
                    label={dict.filters.toggles.inferenceNumber}
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
            <div className="flex flex-row gap-x-5 items-center">
                <Button
                    onClick={onRefetch}
                    className="max-w-xs"
                    variant="default"
                >
                    {dict.filters.buttons.apply}
                </Button>
                {
                    refreshPending &&
                    <TextWarning text={dict.filters.warnings.changesNotSaved} />
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
                        label={dict.alert.label}
                        classNameOuterCard="border-warning-foreground"
                        labelClassName="text-warning-foreground font-bold"
                        contentClassName="flex flex-col gap-y-2"
                    >
                        {
                            invalidModelsQuantizations.map(quant =>
                                <DefaultCard
                                    title={quant.quantization}
                                    subtitle={dict.alert.notSupported}
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
            columns={getColumns(orderByEnergy ? "energy" : "speed")}
            data={data}
        />
    )
}

function arraysOfSelectableEquals(a: Selectable<any>[], b: Selectable<any>[]) {
    return JSON.stringify(a) === JSON.stringify(b)
}





