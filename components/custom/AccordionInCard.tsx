
import { ReactNode } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AlertProps = {
    children: ReactNode
    className?: string,
    contentClassName?: string
}

export default function AccordionInCard({ children, className, contentClassName }: AlertProps) {
    return (
        <Card className={cn("px-10", className)}>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Alerta</AccordionTrigger>
                    <AccordionContent className={contentClassName}>
                        {children}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}