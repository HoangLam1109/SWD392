import { Users, Trophy, MessageSquare, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { mockActivities, mockReviews } from './mockData';

export function CommunitySection() {
  return (
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join the <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connect with friends, share achievements, and discover new games together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Friends Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold">Friends Activity</h3>
              </div>

              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
                        {activity.user.initial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{activity.user.name}</span>
                        {activity.action === 'achievement' && (
                          <>
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-slate-400">unlocked</span>
                            <span className="text-blue-400">{activity.achievement}</span>
                            <span className="text-slate-400">in</span>
                            <span className="text-white">{activity.game}</span>
                          </>
                        )}
                        {activity.action === 'review' && (
                          <>
                            <span className="text-slate-400">reviewed</span>
                            <span className="text-white">{activity.game}</span>
                          </>
                        )}
                        {activity.action === 'playing' && (
                          <>
                            <span className="text-slate-400">is playing</span>
                            <span className="text-white">{activity.game}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Recent Reviews</h3>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
                          {review.user.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.user.name}</div>
                        <div className="text-sm text-slate-400">{review.game}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < review.rating ? 'bg-yellow-400' : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold">Chat</h3>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'AlexGamer', message: 'Anyone up for Cyber Legends?', time: '5m' },
                  { name: 'SarahPro', message: 'Just finished Neon Warriors!', time: '12m' },
                  { name: 'MikeGaming', message: 'New update looks amazing!', time: '1h' },
                ].map((chat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="font-semibold text-sm">{chat.name}</span>
                      <span className="text-xs text-slate-500 ml-auto">{chat.time}</span>
                    </div>
                    <p className="text-sm text-slate-400">{chat.message}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">
                View All Messages
              </button>
            </div>

            {/* Online Friends */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Online Now</h3>
              <div className="flex flex-wrap gap-3">
                {['AG', 'SP', 'MG', 'EP', 'GE', 'PG'].map((initial, i) => (
                  <Avatar key={i} className="cursor-pointer hover:ring-2 ring-blue-400 transition-all">
                    <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
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

