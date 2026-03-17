import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FlappyBirdGame } from "@/games/FlappyBirdGame";

export default function FlappyBirdPage() {
    const { libraryGameId } = useParams<{ libraryGameId: string }>();

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Flappy Bird";

        return () => {
            document.title = previousTitle;
        };
    }, []);

    if (!libraryGameId) return null;

    return <FlappyBirdGame libraryGameId={libraryGameId} />;
}
