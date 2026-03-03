'use client';

import { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components/home';
import {
    Settings,
    LogOut,
    Gamepad2,
    Trophy,
    Clock,
    Users,
    Star
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useLogout } from '@/hooks/auth/useLogout';
interface Profile {
  userId: string;
  bio: string;
  phoneNumber: string;
  address: string;
  country: string;
  dateOfBirth: string;
  sex: string;
}
export default function ProfilePage() {

    const { logout } = useLogout();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fake stats nếu backend chưa có
    const stats = [
        { label: 'Games Owned', value: '124', icon: Gamepad2, color: 'text-blue-400' },
        { label: 'Hours Played', value: '1,240', icon: Clock, color: 'text-purple-400' },
        { label: 'Achievements', value: '842', icon: Trophy, color: 'text-yellow-400' },
        { label: 'Friends', value: '42', icon: Users, color: 'text-emerald-400' },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId"); // nên lưu khi login

                const res = await fetch(
                    `http://localhost:3000/api/profiles/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-500">
                Failed to load profile
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 py-16">

                {/* PROFILE HEADER */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10">

                    <div className="flex flex-col lg:flex-row gap-8">

                        <div className="w-40 h-40 rounded-2xl overflow-hidden border border-white/20">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4">

                            <h1 className="text-3xl font-bold">
                                User #{profile.userId}
                            </h1>

                            <p className="text-slate-400">
                                {profile.bio}
                            </p>

                            <div className="text-sm text-slate-400 space-y-1">
                                <div>📞 {profile.phoneNumber}</div>
                                <div>📍 {profile.address}</div>
                                <div>🌍 {profile.country}</div>
                                <div>
                                    🎂 {new Date(profile.dateOfBirth).toLocaleDateString()}
                                </div>
                                <div>👤 {profile.sex}</div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">
                                    <Settings className="w-4 h-4 inline mr-2" />
                                    Edit Profile
                                </button>

                                <button
                                    onClick={logout}
                                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                                >
                                    <LogOut className="w-4 h-4 inline mr-2" />
                                    Logout
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex justify-between mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <Star className="w-4 h-4 text-white/20" />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    );
}
