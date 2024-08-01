import { QueryKey, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useSimpleRanking(models: string[], quantizations: string[], options?: Partial<UndefinedInitialDataOptions<Inference[], Error, Inference[], QueryKey>>){
    return useQuery<Inference[]>({
        queryKey: ["simpleRanking", models, quantizations],
        queryFn: async ({queryKey}) => {
            const models = queryKey[1] as string[]
            const quantizations = queryKey[2] as string[]

            const queryString = `models=${models.join(',')}&quantizations=${quantizations.join(',')}`;

            return (await axios.get(`${process.env.NEXT_PUBLIC_API}/phone/get/simpleRanking?${queryString}`)).data
        },
        retry: false,
        ...options
    })
}

