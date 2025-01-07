import { Badge } from "../ui/badge";
import { TypographyP } from "../typography/Typography";
import { useToast } from "@/hooks/use-toast";
import { useDictionary } from "../providers/DictionaryProvider";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react";

export interface Selectable<T> {
    value: T,
    isSelected: boolean,
    tooltipContent?: string
}

export function getSelectedValues<T>(selectables: Selectable<T>[]) {
    return selectables
        .filter(x => x.isSelected)
        .map(x => x.value)
}

export type BadgePickerProps<T> = {
    className?: string,
    data: Selectable<T>[],
    setData: React.Dispatch<React.SetStateAction<Selectable<T>[]>>,
    title: string,
    showItem?: (item: Selectable<T>) => boolean,
    getItemName: (item: Selectable<T>) => string,
    noLessThanOneSelected?: boolean
}

export default function BadgePicker<T>({ title, data, setData, getItemName, showItem = (item) => true, noLessThanOneSelected }: BadgePickerProps<T>) {
    return (
        <div className="flex flex-col gap-y-3">
            <TypographyP text={title} className="mt-0" />
            <BadgePickerContent
                data={data}
                setData={setData}
                getItemName={getItemName}
                showItem={showItem}
                noLessThanOneSelected={noLessThanOneSelected}
            />
        </div>
    )
}

export type BadgePickerContentProps<T> = Omit<BadgePickerProps<T>, "title">

export function BadgePickerContent<T>({ data, setData, getItemName, showItem = (item) => true, noLessThanOneSelected }: BadgePickerContentProps<T>) {

    return (
        <div className="flex flex-row gap-x-3 gap-y-3 flex-wrap">
            {
                data.map((x, idx) => 
                    showItem(x) && 
                    <SelectableBadge
                        data={data}
                        index={idx}
                        setData={setData}
                        getItemName={getItemName}
                        noLessThanOneSelected={noLessThanOneSelected}
                    />
                )
            }
        </div>
    )
}

type SelectableBadgeProps<T> = {
    index: number,
} & Pick<BadgePickerProps<T>, "data" | "setData" | "getItemName" | "noLessThanOneSelected">

function SelectableBadge<T>({ data, index, setData, getItemName, noLessThanOneSelected }: SelectableBadgeProps<T>) {

    const dict = useDictionary()
    const { toast } = useToast()

    const tooltipText = data[index].tooltipContent

    function Wrapper({ children }: { children: ReactNode }) {
        return tooltipText !== undefined ?
            TooltipProvide({ children, tooltipText }) :
            <>{children}</>
    }

    return (
        <Wrapper>
            <Badge
                variant={data[index].isSelected ? "default" : "outline"}
                onClick={() =>
                    setData((prev) => {
                        const arr = [...prev]
                        const shouldNotUnmark = (
                            noLessThanOneSelected &&
                            arr.filter(x => x.isSelected).length == 1 &&
                            arr[index].isSelected
                        )
                        if (shouldNotUnmark) {
                            toast({
                                title: dict.dictionary.generalWarnings.atLeastOneSelected,
                                description: "",
                            })
                        }
                        arr[index] = {
                            ...arr[index],
                            isSelected: shouldNotUnmark ?
                                true :
                                !prev[index].isSelected
                        }
                        return arr
                    })
                }
            >
                {getItemName(data[index])}
            </Badge>
        </Wrapper>
    )
}

type TooltipProps = {
    children: ReactNode,
    tooltipText: string
}

function TooltipProvide({ children, tooltipText }: TooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}


