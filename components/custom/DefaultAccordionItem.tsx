import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type DefaultAccordionItemProps = {
    value: string,
    triggerLabel: string,
    children: ReactNode,
    className?: string
    contentClassName?: string
}

export default function DefaultAccordionItem({value, triggerLabel, className, contentClassName, children}: DefaultAccordionItemProps) {
    return (
        <AccordionItem value={value} className={className}>
            <AccordionTrigger className="text-left">{triggerLabel}</AccordionTrigger>
            <AccordionContent className={cn("pl-5", contentClassName)}>
                {children}
            </AccordionContent>
        </AccordionItem>
    )
}