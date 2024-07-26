import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = () => 
    useQuery({
        queryKey: ["quantizations"],
        queryFn: async () => (await axios.get<string[]>("http://192.168.158.226:3030/inference/get/quantizations")).data
    })

export default useModels