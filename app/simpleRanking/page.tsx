'use client'

import React, { useEffect, useRef, useState } from "react"

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
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import useQuantizations from "./hooks/useQuantizations";
import { Label } from "@/components/ui/label";

interface Selectable<T> {
    value: T,
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

    const refreshPending =
        !arraysOfSelectableEquals(models, modelsToFetch) ||
        !arraysOfSelectableEquals(quantizations, quantizationsToFetch)

    const onRefetch = () => {
        setModelsToFetch(models)
        setQuantizationsToFetch(quantizations)
    }

    return (
        <MainContainer>
            <TypographyH2 text="Ranking de aparelhos" />
            <Card>
                <CardHeader>
                    <CardTitle>Meus filtros</CardTitle>
                    <CardDescription>Selecione modelos e quantizações que serão usados para calcular os resultados</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <Accordion type="multiple" className="max-w-l">
                        <AccordionItem value="Modelos">
                            <AccordionTrigger>Modelos</AccordionTrigger>
                            <AccordionContent className="pl-5">
                                {
                                    CATEGORIES.map(category =>
                                        <SelectionAccordionItem
                                            data={models}
                                            setData={setModels}
                                            title={category.label}
                                            getItemName={(item) => item.value.ml_model}
                                            showItem={(item) => item.value.category === category.value}
                                        />
                                    )
                                }
                                <SelectionAccordionItem
                                    data={models}
                                    setData={setModels}
                                    title="Outros"
                                    getItemName={(item) => item.value.ml_model}
                                    showItem={(item) => !CATEGORIES.map(x => x.value)
                                        .includes(item.value.category)
                                    }
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <SelectionAccordionItem
                            data={quantizations}
                            setData={setQuantizations}
                            title="Quantizações"
                            getItemName={(item) => item.value}
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
                </CardContent>
            </Card>
            <Ranking models={modelsToFetch} quantizations={quantizationsToFetch} />
        </MainContainer>
    )
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

interface SelectionProps<T> {
    data: Selectable<T>[],
    setData: React.Dispatch<React.SetStateAction<Selectable<T>[]>>,
    title: string,
    getItemName: (item: Selectable<T>) => string,
    showItem?: (item: Selectable<T>) => boolean,
}

function SelectionAccordionItem<T>({ data, setData, title, getItemName, showItem = (item) => true }: SelectionProps<T>) {

    const [checked, setChecked] = useState(true)

    function onCheckedChange(newChecked: boolean) {
        setData(data.map(x => {
            return { ...x, isSelected: showItem(x)? newChecked: x.isSelected }
        }))
        setChecked(newChecked)
    }

    useEffect(() => {
        const showedItems = data.filter(x => showItem(x))
        if(showedItems.every(x => x.isSelected))
            setChecked(true)
        if(showedItems.every(x => !x.isSelected))
            setChecked(false)
    }, [data])

    return (
        <AccordionItem
            value={title}
        >
            <AccordionTrigger>
                <div className="flex flex-1 flex-row justify-between items-center flex-wrap gap-y-5">
                    {title}
                    <div className="flex items-center space-x-2 pr-5">
                        <Switch
                            id="check"
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            onClick={(event) => event.stopPropagation()}
                        />
                        <Label htmlFor="check">{checked ? "Remover todos" : "Selecionar todos"}</Label>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-row gap-x-3 gap-y-3 flex-wrap">
                {
                    data.map((x, idx) =>
                        showItem(x) &&
                        <Badge
                            variant={x.isSelected ? "default" : "outline"}
                            onClick={() =>
                                setData((prev) => {
                                    const arr = [...prev]
                                    arr[idx] = { ...arr[idx], isSelected: !prev[idx].isSelected }
                                    return arr
                                })
                            }
                        >
                            {getItemName(x)}
                        </Badge>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    );
}

function arraysOfSelectableEquals(a: Selectable<any>[], b: Selectable<any>[]) {
    return JSON.stringify(a) === JSON.stringify(b)
}





