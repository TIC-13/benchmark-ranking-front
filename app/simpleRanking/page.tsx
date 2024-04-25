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

type Selectable = {
    name: string,
    isSelected: boolean
}

export default function Ranking() {
    const modelsQuery = useModels()

    if (modelsQuery.isLoading || modelsQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <RankingComponents
            modelsList={modelsQuery.data.map((x: string) => {
                return { name: x, isSelected: true }
            })}
        />
    )
}

type RankingProps = {
    modelsList: Selectable[]
}

function RankingComponents({ modelsList }: RankingProps) {

    const [models, setModels] = useState(modelsList)

    const [modelsToFetch, setModelsToFetch] = useState(modelsList)

    const rankingQuery = useSimpleRanking(
        modelsToFetch.filter(x => x.isSelected)
            .map(x => x.name)
    )

    const onRefetch = () => {
        setModelsToFetch(models)
    }

    if (rankingQuery.isLoading || rankingQuery.data === undefined)
        return <LoadingFullScreen />

    return (
        <MainContainer>
            <TypographyH3 text="Ranking de aparelhos" />
            <Selection data={models} setData={setModels} />
            <div className="flex flex-row gap-x-5">
                <Button onClick={onRefetch} className="max-w-xs" variant="outline">
                    Aplicar filtros
                </Button>
                {
                    !arraysOfSelectableEquals(models, modelsToFetch) &&
                    <Badge variant="destructive">
                        Mudanças não salvas
                    </Badge>
                }
            </div>
            <DataTable columns={columns} data={rankingQuery.data} />
        </MainContainer>
    )

}

type SelectionProps = {
    data: Selectable[],
    setData: React.Dispatch<React.SetStateAction<Selectable[]>>
}

function Selection({ data, setData }: SelectionProps) {
    return (
        <div className="flex flex-row gap-x-1 gap-y-1 flex-wrap">
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
        </div>
    );
}

function arraysOfSelectableEquals(a: Selectable[], b: Selectable[]) {

    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].name !== b[i].name || a[i].isSelected !== b[i].isSelected) return false;
    }

    return true;
}





