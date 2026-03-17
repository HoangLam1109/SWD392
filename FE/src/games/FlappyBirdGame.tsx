import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./flappy-bird.css";
import { useStartPlaying, useEndPlaying } from "@/hooks/game-session/useGameSession";
import { useGetLeaderboardHighestScore } from "@/hooks/library/useGetLeaderboardHighestScore";

type GamePhase = "idle" | "playing" | "gameover";

type Pipe = {
    id: number;
    x: number;
    gapY: number;
    scored: boolean;
};

const GAME_WIDTH = 420;
const GAME_HEIGHT = 640;
const GROUND_HEIGHT = 92;
const BIRD_X = 92;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 68;
const PIPE_GAP = 170;
const PIPE_SPEED = 2.9;
const GRAVITY = 0.4;
const JUMP_FORCE = -7.2;
const PIPE_SPAWN_MS = 1500;
const PIPE_MARGIN = 70;

const createPipe = (id: number): Pipe => {
    const minGapY = PIPE_MARGIN + PIPE_GAP / 2;
    const maxGapY = GAME_HEIGHT - GROUND_HEIGHT - PIPE_MARGIN - PIPE_GAP / 2;

    return {
        id,
        x: GAME_WIDTH + PIPE_WIDTH,
        gapY: Math.random() * (maxGapY - minGapY) + minGapY,
        scored: false,
    };
};

interface FlappyBirdGameProps {
    libraryGameId: string;
}

export function FlappyBirdGame({ libraryGameId }: FlappyBirdGameProps) {
    const [phase, setPhase] = useState<GamePhase>("idle");
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState<Pipe[]>([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const startPlayingMutation = useStartPlaying();
    const endPlayingMutation = useEndPlaying();
    const leaderboardQuery = useGetLeaderboardHighestScore({ limit: 5 });

    useEffect(() => {
        if (leaderboardQuery.data && leaderboardQuery.data.length > 0) {
            setBestScore(leaderboardQuery.data[0].highest_score);
        }
    }, [leaderboardQuery.data]);

    const gameAreaRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number | null>(null);
    const spawnTimerRef = useRef(0);
    const pipeIdRef = useRef(0);

    const phaseRef = useRef<GamePhase>(phase);
    const birdYRef = useRef(birdY);
    const birdVelocityRef = useRef(birdVelocity);
    const pipesRef = useRef(pipes);
    const scoreRef = useRef(score);

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    useEffect(() => {
        birdYRef.current = birdY;
    }, [birdY]);

    useEffect(() => {
        birdVelocityRef.current = birdVelocity;
    }, [birdVelocity]);

    useEffect(() => {
        pipesRef.current = pipes;
    }, [pipes]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const stopLoop = useCallback(() => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        lastFrameTimeRef.current = null;
    }, []);

    const resetGame = useCallback(() => {
        stopLoop();
        spawnTimerRef.current = 0;
        pipeIdRef.current = 0;
        birdYRef.current = GAME_HEIGHT / 2 - BIRD_SIZE / 2;
        birdVelocityRef.current = 0;
        pipesRef.current = [];
        scoreRef.current = 0;
        setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
        setBirdVelocity(0);
        setPipes([]);
        setScore(0);
    }, [stopLoop]);

    const startGame = useCallback(() => {
        resetGame();
        phaseRef.current = "playing";
        setPhase("playing");

        startPlayingMutation.mutate(libraryGameId, {
            onSuccess: (session) => {
                setCurrentSessionId(session._id);
            },
        });
    }, [libraryGameId, resetGame, startPlayingMutation]);

    const endGame = useCallback(() => {
        phaseRef.current = "gameover";
        setPhase("gameover");
        setBestScore((currentBest) =>
            Math.max(
                currentBest,
                scoreRef.current,
                leaderboardQuery.data && leaderboardQuery.data.length > 0
                    ? leaderboardQuery.data[0].highest_score
                    : 0
            )
        );
        stopLoop();

        if (currentSessionId) {
            endPlayingMutation.mutate({
                gameSessionId: currentSessionId,
                sessionScore: scoreRef.current,
            });
            setCurrentSessionId(null);
        }
    }, [currentSessionId, endPlayingMutation, stopLoop]);

    const flap = useCallback(() => {
        if (phaseRef.current !== "playing") {
            return;
        }

        setBirdVelocity(JUMP_FORCE);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== "Space") {
                return;
            }

            event.preventDefault();

            if (phaseRef.current === "playing") {
                flap();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [flap]);

    useEffect(() => {
        if (phase !== "playing") {
            stopLoop();
            return;
        }

        const step = (timestamp: number) => {
            if (lastFrameTimeRef.current === null) {
                lastFrameTimeRef.current = timestamp;
                animationFrameRef.current = requestAnimationFrame(step);
                return;
            }

            const elapsed = timestamp - lastFrameTimeRef.current;
            lastFrameTimeRef.current = timestamp;
            const delta = Math.min(elapsed / 16.67, 2);

            let nextVelocity = birdVelocityRef.current + GRAVITY * delta;
            let nextBirdY = birdYRef.current + nextVelocity * delta;

            if (nextBirdY < 0) {
                nextBirdY = 0;
                nextVelocity = 0;
            }

            spawnTimerRef.current += elapsed;

            let nextPipes = pipesRef.current
                .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED * delta }))
                .filter((pipe) => pipe.x + PIPE_WIDTH > -20);

            if (spawnTimerRef.current >= PIPE_SPAWN_MS) {
                spawnTimerRef.current = 0;
                pipeIdRef.current += 1;
                nextPipes = [...nextPipes, createPipe(pipeIdRef.current)];
            }

            let nextScore = scoreRef.current;
            nextPipes = nextPipes.map((pipe) => {
                if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
                    nextScore += 1;
                    return { ...pipe, scored: true };
                }

                return pipe;
            });

            const birdBottom = nextBirdY + BIRD_SIZE;
            const hasHitGround = birdBottom >= GAME_HEIGHT - GROUND_HEIGHT;
            const hasHitPipe = nextPipes.some((pipe) => {
                const overlapsHorizontally =
                    BIRD_X + BIRD_SIZE > pipe.x && BIRD_X < pipe.x + PIPE_WIDTH;

                if (!overlapsHorizontally) {
                    return false;
                }

                const gapTop = pipe.gapY - PIPE_GAP / 2;
                const gapBottom = pipe.gapY + PIPE_GAP / 2;
                const hitsTopPipe = nextBirdY < gapTop;
                const hitsBottomPipe = birdBottom > gapBottom;

                return hitsTopPipe || hitsBottomPipe;
            });

            setBirdVelocity(nextVelocity);
            setBirdY(nextBirdY);
            setPipes(nextPipes);

            if (nextScore !== scoreRef.current) {
                scoreRef.current = nextScore;
                setScore(nextScore);
            }

            if (hasHitGround || hasHitPipe) {
                endGame();
                return;
            }

            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);

        return () => {
            stopLoop();
        };
    }, [endGame, phase, stopLoop]);

    useEffect(() => {
        return () => {
            stopLoop();
        };
    }, [stopLoop]);

    const birdRotation = useMemo(() => {
        if (phase === "idle") {
            return -8;
        }

        return Math.max(-30, Math.min(70, birdVelocity * 6));
    }, [birdVelocity, phase]);

    return (
        <div className="flappy-page">
            <div className="flappy-shell">
                <div className="flappy-header">
                    <div>
                        <p className="flappy-eyebrow">React + TypeScript</p>
                        <h1>Flappy Bird</h1>
                    </div>
                    <div className="flappy-scoreboard">
                        <div>
                            <span>Score</span>
                            <strong>{score}</strong>
                        </div>
                        <div>
                            <span>Best</span>
                            <strong>{bestScore}</strong>
                        </div>
                    </div>
                </div>

                <div
                    ref={gameAreaRef}
                    className={`flappy-game ${phase === "playing" ? "is-playing" : ""}`}
                    onClick={() => {
                        if (phase === "playing") {
                            flap();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Flappy Bird game area"
                    onKeyDown={(event) => {
                        if (event.code === "Space" && phase === "playing") {
                            event.preventDefault();
                            flap();
                        }
                    }}
                >
                    <div className="flappy-sky" />
                    <div className="flappy-cloud flappy-cloud-one" />
                    <div className="flappy-cloud flappy-cloud-two" />

                    {pipes.map((pipe) => {
                        const topHeight = pipe.gapY - PIPE_GAP / 2;
                        const bottomHeight =
                            GAME_HEIGHT - GROUND_HEIGHT - (pipe.gapY + PIPE_GAP / 2);

                        return (
                            <div key={pipe.id}>
                                <div
                                    className="pipe pipe-top"
                                    style={{
                                        left: pipe.x,
                                        width: PIPE_WIDTH,
                                        height: topHeight,
                                    }}
                                />
                                <div
                                    className="pipe pipe-bottom"
                                    style={{
                                        left: pipe.x,
                                        width: PIPE_WIDTH,
                                        height: bottomHeight,
                                    }}
                                />
                            </div>
                        );
                    })}

                    <div
                        className={`bird ${phase === "idle" ? "is-idle" : ""}`}
                        style={{
                            left: BIRD_X,
                            top: birdY,
                            width: BIRD_SIZE,
                            height: BIRD_SIZE,
                            transform: `rotate(${birdRotation}deg)`,
                        }}
                    >
                        <span className="bird-eye" />
                        <span className="bird-wing" />
                        <span className="bird-beak" />
                    </div>

                    <div className="ground" />

                    <div className="live-score">{score}</div>

                    {phase === "idle" && (
                        <div className="flappy-overlay">
                            <div className="flappy-panel">
                                <p className="flappy-panel-title">Ready to flap?</p>
                                <p>
                                    Press the start button, then use the spacebar or click
                                    anywhere inside the game to jump.
                                </p>
                                <button
                                    type="button"
                                    className="flappy-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        startGame();
                                    }}
                                >
                                    Start Game
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === "gameover" && (
                        <div className="flappy-overlay">
                            <div className="flappy-panel">
                                <p className="flappy-panel-title">Game Over</p>
                                <p>Your bird hit an obstacle. Try again and beat your best score.</p>
                                <div className="flappy-results">
                                    <span>Score: {score}</span>
                                    <span>Best: {bestScore}</span>
                                </div>
                                <button
                                    type="button"
                                    className="flappy-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        startGame();
                                    }}
                                >
                                    Restart
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flappy-footer">
                    <div className="flappy-instructions">
                        <p>Click or press the spacebar to keep the bird in the air.</p>
                        <p>Avoid pipes, stay above the ground, and score by passing each pipe.</p>
                    </div>

                    <div className="flappy-leaderboard">
                        <h2>Leaderboard</h2>
                        {leaderboardQuery.isLoading && <p>Loading leaderboard...</p>}
                        {leaderboardQuery.isError && (
                            <p>Could not load leaderboard. Please try again later.</p>
                        )}
                        {leaderboardQuery.data && leaderboardQuery.data.length > 0 && (
                            <ol>
                                {leaderboardQuery.data.map((entry, index) => (
                                    <li key={entry._id}>
                                        <span>
                                            #{index + 1}{" "}
                                            {entry.user_id
                                                ? `User ${entry.user_id.slice(0, 6)}…`
                                                : "Unknown user"}
                                        </span>
                                        <span>
                                            Score: <strong>{entry.highest_score}</strong>
                                        </span>
                                        <span>
                                            Total playtime: {Math.round(entry.total_playtime / 60)}{" "}
                                            min
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                        {leaderboardQuery.data && leaderboardQuery.data.length === 0 && !leaderboardQuery.isLoading && !leaderboardQuery.isError && (
                            <p>No leaderboard data yet. Be the first to set a high score!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
