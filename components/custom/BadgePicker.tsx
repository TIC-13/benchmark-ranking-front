import { Badge } from "../ui/badge";
import { TypographyP } from "../typography/Typography";

export interface Selectable<T> {
    value: T,
    isSelected: boolean
}

export type BadgePickerProps<T> = {
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
            <TypographyP text={title} className="mt-0"/>
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
                    <Badge
                        variant={x.isSelected ? "default" : "outline"}
                        onClick={() =>
                            setData((prev) => {
                                const arr = [...prev]
                                arr[idx] = { 
                                    ...arr[idx], 
                                    isSelected: (noLessThanOneSelected && arr.filter(x => x.isSelected).length == 1)? 
                                        true: 
                                        !prev[idx].isSelected 
                                }
                                return arr
                            })
                        }
                    >
                        {getItemName(x)}
                    </Badge>
                )
            }
        </div>
    )
}


