import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = () => 
    useQuery({
        queryKey: ["quantizations"],
        queryFn: async () => (await axios.get<string[]>(`${process.env.NEXT_PUBLIC_API}/inference/get/quantizations`)).data
    })

export default useModels