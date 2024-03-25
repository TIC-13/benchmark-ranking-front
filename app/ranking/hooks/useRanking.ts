import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RankingEntry } from "../page";

const useRanking = (models: string[], quantizations: string[], modes: string[]) => 
        useQuery({
            queryKey: ["ranking", models, quantizations, modes],
            retry: false,
            queryFn: async ({queryKey}) => {
                const models = queryKey[1] as string[]
                const quantizations = queryKey[2] as string[]
                const modes = queryKey[3] as string[]

                const queryString = `models=${models.join(',')}&quantizations=${quantizations.join(',')}&modes=${modes.join(',')}`;
                console.log(queryString)

                return (await axios.get<RankingEntry[]>(`http://localhost:3030/phone/get/ranking?${queryString}`)).data
            }
        })

export default useRanking