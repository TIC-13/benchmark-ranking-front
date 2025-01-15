import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import DefaultAccordionItem from "./DefaultAccordionItem"

const HelpAccordion: React.FC<{ helpLabel: string, helpContent: { value: string, label: string, content: string }[] }> = ({ helpLabel, helpContent }) => {
    return (
        <Accordion type="multiple">
                <AccordionItem value="help">
                    <AccordionTrigger className="items-start">
                        <div className="flex flex-row gap-x-2">
                            <HelpCircle />
                            {helpLabel}
                        </div>

                    </AccordionTrigger>
                    <AccordionContent className="pl-5">
                        {
                            helpContent.map(({ value, label, content }) =>
                                <DefaultAccordionItem
                                    className="mt-3"
                                    value={value}
                                    triggerLabel={label}
                                >
                                    <p>{content}</p>
                                </DefaultAccordionItem>

                            )
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
    )
}

export default HelpAccordion