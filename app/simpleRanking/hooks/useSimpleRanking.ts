import { useQuery } from "@tanstack/react-query";
import { Inference } from "../columns";
import axios from "axios";

export default function useSimpleRanking(){
    return useQuery<Inference[]>({
        queryKey: ["simpleRanking"],
        queryFn: async () => (await axios.get(`http://localhost:3030/phone/get/simpleRanking`)).data,
        retry: false,
    })
}

