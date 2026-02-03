import { useTranslation } from 'react-i18next';

/**
 * GameHeader Component
 * Header bar với tiêu đề trang (search và filter đã chuyển vào sidebar)
 */
interface GameHeaderProps {
    title?: string;
    subtitle?: string;
}

export function GameHeader({
    title,
    subtitle,
}: GameHeaderProps) {
    const { t } = useTranslation();
    const displayTitle = title ?? t('library.header.title');
    const displaySubtitle = subtitle ?? t('library.header.subtitle');
    return (
        <div className="bg-[#1b2838] border-b border-[#2a475e] p-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayTitle}</h1>
                <p className="text-sm text-[#8f98a0] mt-1">{displaySubtitle}</p>
            </div>
        </div>
    );
}
