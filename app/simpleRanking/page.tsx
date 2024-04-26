'use client'

import React, { useRef, useState } from "react"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TypographyH2 } from "@/components/typography/Typography";
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
            <TypographyH2 text="Ranking de aparelhos" />
            <Card>
                <CardHeader>
                    <CardTitle>Meus filtros</CardTitle>
                    <CardDescription>Selecione modelos e quantizações que serão usados para calcular os resultados</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <Accordion type="multiple" className="max-w-l">
                        <SelectionAccordionItem
                            data={models}
                            setData={setModels}
                            title="Modelos"
                        />
                        <SelectionAccordionItem
                            data={quantizations}
                            setData={setQuantizations}
                            title="Quantizações"
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

    const [checked, setChecked] = useState(true)

    function onCheckedChange(newChecked: boolean){
        setData(data.map(x => {
            return {...x, isSelected: newChecked}
        }))
        setChecked(newChecked)
    }

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
                        <Label htmlFor="check">{checked? "Remover todos": "Selecionar todos"}</Label>
                    </div>
                </div>
            </AccordionTrigger>
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





