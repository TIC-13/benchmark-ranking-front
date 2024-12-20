import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";
import { useEffect } from "react";

export default function useSimpleRanking(models: string[], quantizations: string[]){

    const query = useQuery<Inference[]>({
        queryKey: ["simpleRanking"],
        queryFn: async ({ queryKey }) => {
            const queryString = `models=${models.join(',')}&quantizations=${quantizations.join(',')}`;
            return (await axios.get(`${process.env.NEXT_PUBLIC_API}/phone/get/simpleRanking?${queryString}`)).data
        },
        retry: false,
    })

    useEffect(() => {
        query.refetch()
    }, [models, quantizations])

    return query
}

