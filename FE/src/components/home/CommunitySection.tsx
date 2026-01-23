import { Users, Trophy, MessageSquare, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { mockActivities, mockReviews } from './mockData';

export function CommunitySection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Join the <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Connect with friends, share achievements, and discover new games together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Friends Activity Feed */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="text-lg sm:text-xl font-semibold">Friends Activity</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm">
                        {activity.user.initial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-semibold text-sm sm:text-base">{activity.user.name}</span>
                        {activity.action === 'achievement' && (
                          <>
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
                            <span className="text-xs sm:text-sm text-slate-400">unlocked</span>
                            <span className="text-xs sm:text-sm text-blue-400">{activity.achievement}</span>
                            <span className="text-xs sm:text-sm text-slate-400">in</span>
                            <span className="text-xs sm:text-sm text-white">{activity.game}</span>
                          </>
                        )}
                        {activity.action === 'review' && (
                          <>
                            <span className="text-xs sm:text-sm text-slate-400">reviewed</span>
                            <span className="text-xs sm:text-sm text-white">{activity.game}</span>
                          </>
                        )}
                        {activity.action === 'playing' && (
                          <>
                            <span className="text-xs sm:text-sm text-slate-400">is playing</span>
                            <span className="text-xs sm:text-sm text-white">{activity.game}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Recent Reviews</h3>
              <div className="space-y-3 sm:space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm">
                          {review.user.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base">{review.user.name}</div>
                        <div className="text-xs sm:text-sm text-slate-400">{review.game}</div>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                              i < review.rating ? 'bg-yellow-400' : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="space-y-4 sm:space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="text-lg sm:text-xl font-semibold">Chat</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: 'AlexGamer', message: 'Anyone up for Cyber Legends?', time: '5m' },
                  { name: 'SarahPro', message: 'Just finished Neon Warriors!', time: '12m' },
                  { name: 'MikeGaming', message: 'New update looks amazing!', time: '1h' },
                ].map((chat, i) => (
                  <div key={i} className="p-2.5 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm">{chat.name}</span>
                      <span className="text-xs text-slate-500 ml-auto">{chat.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">{chat.message}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm">
                View All Messages
              </button>
            </div>

            {/* Online Friends */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Online Now</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['AG', 'SP', 'MG', 'EP', 'GE', 'PG'].map((initial, i) => (
                  <Avatar key={i} className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:ring-2 ring-blue-400 transition-all">
                    <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

