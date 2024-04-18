import { Inference } from "./columns";

const mockData: Inference[] = [
    {
        phone: {
            id: 1,
            phone_model: "Samsung A14",
            brand_name: "samsung"
        },
        CPU: 30,
        GPU: 15,
        NNAPI: 20
    },
    {
        phone: {
            id: 1,
            phone_model: "Xiaomi MI13",
            brand_name: "xiaomi"
        },
        CPU: 20,
        GPU: 22,
        NNAPI: 41
    },
    {
        phone: {
            id: 1,
            phone_model: "Moto G30",
            brand_name: "motorola"
        },
        CPU: 25,
        GPU: 17,
        NNAPI: 16
    },
]

export { mockData }