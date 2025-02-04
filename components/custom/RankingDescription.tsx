import { StoreCard, StoreCardProps } from "./StoreCard"

type RankingDescriptionProps = {
    description: string
    cardProps: StoreCardProps
}

export function RankingDescription({description, cardProps}: RankingDescriptionProps) {
    return (
        <div className="flex flex-wrap gap-x-10 gap-y-10 items-center">
            <p className="flex-2 w-2/3">{description}</p>
            <StoreCard
                classname="flex-1"
                {...cardProps}
            />
        </div>
    )
}