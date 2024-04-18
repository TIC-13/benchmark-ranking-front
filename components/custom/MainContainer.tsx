import { cn } from "@/lib/utils"

type MainContainerProps = {
    children: React.ReactNode, 
    className?: string
}

export default function MainContainer({children, className = undefined}: MainContainerProps) {
    return (
        <div className={cn("flex flex-col container mx-auto py-10 gap-y-10", className)}>
              {children}  
        </div>
    )
}