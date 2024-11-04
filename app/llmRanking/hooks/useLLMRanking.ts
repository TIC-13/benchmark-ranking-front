import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useLLMRanking(models: string[]) {
    return useQuery<Inference[]>({
        queryKey: ["llmRanking"],
        queryFn: async ({ queryKey }) => {
            //const models = queryKey[1] as string[]
            const queryString = `models=${models.join(',')}`;

            return (await axios.get(`${process.env.NEXT_PUBLIC_API}/llmInference/ranking?${queryString}`)).data
        },
        retry: false
    })
}

