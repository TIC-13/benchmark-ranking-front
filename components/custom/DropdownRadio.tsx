
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


type DropdownRadioProps = {
    outerLabel: string,
    innerLabel: string,
    value?: string,
    setValue: (value: string) => void,
    options: DropdownRadioOption[]
}

type DropdownRadioOption = {
    value: string,
    label: string
}

export function DropdownMenuRadio({ outerLabel, innerLabel, value, setValue, options }: DropdownRadioProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{outerLabel}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{innerLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                    {
                        options.map(
                            ({value, label}) =>
                                <DropdownMenuRadioItem value={value}>{label}</DropdownMenuRadioItem>
                        )
                    }
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}