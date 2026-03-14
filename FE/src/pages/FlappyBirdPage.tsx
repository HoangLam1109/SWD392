import { useEffect } from "react";
import { FlappyBirdGame } from "@/games/FlappyBirdGame";

export default function FlappyBirdPage() {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Flappy Bird";

        return () => {
            document.title = previousTitle;
        };
    }, []);

    return <FlappyBirdGame />;
}
