
import { ReactNode } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AlertProps = {
    label: string,
    children: ReactNode
    classNameOuterCard?: string,
    contentClassName?: string,
    classNameAccordion?: string,
    labelClassName?: string
}

export default function AccordionInCard({ label, children, classNameOuterCard, contentClassName, labelClassName, classNameAccordion }: AlertProps) {
    return (
        <Card className={cn("px-10", classNameOuterCard)}>
            <Accordion type="single" collapsible className={classNameAccordion}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className={labelClassName}>{label}</AccordionTrigger>
                    <AccordionContent className={contentClassName}>
                        {children}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}