import { useTranslation } from 'react-i18next';
import { ShoppingBag, Library, Users, Cloud } from 'lucide-react';

export function AboutSection() {
  const { t } = useTranslation();
  const features = [
    { icon: ShoppingBag, titleKey: 'home.about.digitalStore', descKey: 'home.about.digitalStoreDesc' },
    { icon: Library, titleKey: 'home.about.gameLibrary', descKey: 'home.about.gameLibraryDesc' },
    { icon: Users, titleKey: 'home.about.community', descKey: 'home.about.communityDesc' },
    { icon: Cloud, titleKey: 'home.about.cloudSave', descKey: 'home.about.cloudSaveDesc' },
  ];

  return (
    <section className="relative py-12 sm:py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            {t('home.about.title')}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('home.about.titleHighlight')}</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            {t('home.about.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-600/20 mb-4 sm:mb-6 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t(feature.titleKey)}</h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

