import { QueryKey, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useSimpleRanking(models: string[], options?: Partial<UndefinedInitialDataOptions<Inference[], Error, Inference[], QueryKey>>){
    return useQuery<Inference[]>({
        queryKey: ["simpleRanking", models],
        queryFn: async ({queryKey}) => {
            const models = queryKey[1] as string[]
            console.log("MODELS", models)

            const queryString = `models=${models.join(',')}`;
            console.log(queryString)

            return (await axios.get(`http://localhost:3030/phone/get/simpleRanking?${queryString}`)).data
        },
        retry: false,
        ...options
    })
}

