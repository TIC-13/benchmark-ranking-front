'use client'

import React, { useEffect, useState } from "react"

import { DataTable } from "@/components/custom/DataTable";
import { DisplayModeVision, getColumns } from "./columns";
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
import BadgePicker, { getSelectedValues, Selectable } from "@/components/custom/BadgePicker";
import phoneNames from "@/app/src/utils/phone_names.json"
import RadioButtonsGroup, { RadioItem } from "@/components/custom/RadioButtonsGroup";

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

    const CATEGORY_OTHER: Category = { value: "OTHER", label: other }

    const [models, setModels] = useState(modelsList)
    const [quantizations, setQuantizations] = useState(quantizationsList)
    const [showSamples, setShowSamples] = useState(false)
    const [mode, setMode] = useState<DisplayModeVision>("speed")

    const { speed, cpu, gpu, ram } = dict.filters.categories

    const radioOptions: RadioItem<DisplayModeVision>[] = [
        { value: "speed", label: speed},
        //{ value: "cpu", label: cpu },
        { value: "gpu", label: gpu },
        { value: "ram", label: ram }
    ]

    const { items, setItems } = useAccordionBadgePicker([...CATEGORIES, CATEGORY_OTHER])

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
                    <RadioButtonsGroup<DisplayModeVision>
                        items={radioOptions}
                        setPickedItem={setMode}
                    />
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
                <Separator />
                <SwitchWithLabel
                    label={dict.filters.toggles.inferenceNumber}
                    checked={showSamples}
                    onCheckedChange={setShowSamples}
                />
            </DefaultCard>
            <Ranking
                mode={mode}
                models={getSelectedValues(models).map(val => val.ml_model)}
                quantizations={getSelectedValues(quantizations)}
                showSamples={showSamples}
            />
        </MainContainer>
    )
}

type RankingLayerProps = {
    models: string[],
    mode: DisplayModeVision,
    quantizations: string[],
    showSamples?: boolean,
    showPowerAndEnergy?: boolean,
    orderByEnergy?: boolean
}

function Ranking({ models, quantizations, showSamples = true, mode }: RankingLayerProps) {

    const rankingQuery = useSimpleRanking(
        models,
        quantizations,
    )

    let data = rankingQuery.data?.map(inference =>
    ({
        ...inference,
        CPU: { ...inference.CPU, showSamples },
        GPU: { ...inference.GPU, showSamples },
        NNAPI: { ...inference.NNAPI, showSamples },
        phone: { ...inference.phone, phone_model: ((phoneNames as any)[inference.phone.phone_model] ?? inference.phone.phone_model) }
    })
    ) ?? []

    return (
        <DataTable
            columns={getColumns(mode)}
            data={data}
            defaultSortId="CPU"
            isLoading={rankingQuery.isLoading || rankingQuery.data === undefined}
        />
    )
}





