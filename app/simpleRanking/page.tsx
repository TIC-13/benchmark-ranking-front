'use client'

import React from "react"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TypographyH3 } from "@/components/typography/Typography";
import useSimpleRanking from "./hooks/useSimpleRanking";
import MainContainer from "@/components/custom/MainContainer";
import { LoadingFullScreen } from "@/components/custom/LoadingFullScreen";

export default function Ranking() {

    const { data: ranking, isLoading } = useSimpleRanking()

    if (isLoading || ranking === undefined)
        return <LoadingFullScreen/>

    return (
        <MainContainer>
            <TypographyH3 text="Ranking de aparelhos" />
            <DataTable columns={columns} data={ranking} />
        </MainContainer>
    )
}





