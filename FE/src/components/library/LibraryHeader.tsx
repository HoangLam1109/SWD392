/**
 * GameHeader Component
 * Header bar với tiêu đề trang (search và filter đã chuyển vào sidebar)
 */
interface GameHeaderProps {
    title?: string;
    subtitle?: string;
}

export function GameHeader({
    title = 'Library',
    subtitle = 'Manage your game library',
}: GameHeaderProps) {
    return (
        <div className="bg-[#1b2838] border-b border-[#2a475e] p-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
                <p className="text-sm text-[#8f98a0] mt-1">{subtitle}</p>
            </div>
        </div>
    );
}
