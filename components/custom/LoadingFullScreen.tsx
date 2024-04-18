import { LoadingSpinner } from "./LoadingSpinner";
import MainContainer from "./MainContainer";

export function LoadingFullScreen() {
    return (
        <MainContainer className="h-dvh justify-center items-center">
            <LoadingSpinner/>
        </MainContainer>
    )
}