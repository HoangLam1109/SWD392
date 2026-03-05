import { Navbar, Footer } from '@/components/home';
import {
    Settings,
    LogOut,
    Gamepad2,
    Trophy,
    Clock,
    Users,
    Facebook,
    Youtube,
    MessageCircle,
    MapPin,
    Phone,
    Globe,
    Calendar,
    User
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGetMyProfile } from '@/hooks/profile/useGetMyProfile';
import { useCreateProfile } from '@/hooks/profile/useCreateProfile';
import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import type { CreateProfileDTO, UpdateProfileDTO } from '@/types/Profile.types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';

export default function ProfilePage() {

    const { user } = useAuth();
    const { logout } = useLogout();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: profile, isLoading: profileLoading, isError } = useGetMyProfile();
    const { mutate: createProfile, isPending: isCreating } = useCreateProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile(user?.id);

    const { register, handleSubmit, reset, control } = useForm<UpdateProfileDTO>();

    useEffect(() => {
        if (profile) {
            reset({
                bio: profile.bio || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                country: profile.country || '',
                dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
                sex: profile.sex || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: UpdateProfileDTO) => {
        if (profile) {
            updateProfile(data, {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            if (!user?.id) return;
            createProfile({
                ...data,
                userId: user.id,
                bio: data.bio || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                country: data.country || '',
                dateOfBirth: data.dateOfBirth || '',
                sex: data.sex || '',
            } as CreateProfileDTO, {
                onSuccess: () => setIsDialogOpen(false),
            });
        }
    };

    // Fake stats nếu backend chưa có
    const stats = [
        { label: 'Games Owned', value: '124', icon: Gamepad2, color: 'text-blue-400' },
        { label: 'Hours Played', value: '1,240', icon: Clock, color: 'text-purple-400' },
        { label: 'Achievements', value: '842', icon: Trophy, color: 'text-yellow-400' },
        { label: 'Friends', value: '42', icon: Users, color: 'text-emerald-400' },
    ];

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full">
                        <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
                        <p className="text-slate-400 mb-6">
                            We couldn't find a profile for your account. You may need to complete your setup.
                        </p>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors"
                        >
                            Create Profile
                        </button>
                    </div>
                </div>
                {/* Form Dialog */}
                {renderProfileDialog()}
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 py-16">

                {/* PROFILE HEADER */}
                {/* PROFILE HEADER */}
                <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 mb-10 transition-all duration-300 hover:bg-white/[0.07]">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">

                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                            <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                                    alt="avatar"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 w-full space-y-8">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                                        {user.fullName || `User #${profile.userId}`}
                                    </h1>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Premium Member</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDialogOpen(true)}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 font-bold transition-all hover:bg-red-600 hover:text-white active:scale-95"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="max-w-2xl text-lg text-slate-400 leading-relaxed font-medium italic">
                                "{profile.bio || "No bio available. Adding a bio helps others get to know you!"}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12 pt-6 border-t border-white/5">
                                {profile.phoneNumber && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                                            <Phone className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Phone</span>
                                            <span className="text-sm font-semibold">{profile.phoneNumber}</span>
                                        </div>
                                    </div>
                                )}
                                {profile.address && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                                            <MapPin className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Location</span>
                                            <span className="text-sm font-semibold">{profile.address}</span>
                                        </div>
                                    </div>
                                )}
                                {profile.country && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                                            <Globe className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Country</span>
                                            <span className="text-sm font-semibold">{profile.country}</span>
                                        </div>
                                    </div>
                                )}
                                {profile.dateOfBirth && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-colors">
                                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-yellow-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Birthday</span>
                                            <span className="text-sm font-semibold">{new Date(profile.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                    </div>
                                )}
                                {profile.sex && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-colors">
                                            <User className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Identity</span>
                                            <span className="text-sm font-semibold uppercase tracking-wider">{profile.sex}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {profile.socialLinks && (
                                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                                    {profile.socialLinks.facebook && (
                                        <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                            <Facebook className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Facebook</span>
                                        </a>
                                    )}
                                    {profile.socialLinks.discord && (
                                        <a href={profile.socialLinks.discord} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all duration-300">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Discord</span>
                                        </a>
                                    )}
                                    {profile.socialLinks.youtube && (
                                        <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                                            <Youtube className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">YouTube</span>
                                        </a>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* STATS SECTION */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:bg-white/[0.08] hover:-translate-y-2"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <stat.icon className="w-20 h-20" />
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-white">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {renderProfileDialog()}

            <Footer />
        </div>
    );

    function renderProfileDialog() {
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-slate-900 text-white border-white/10">
                    <DialogHeader>
                        <DialogTitle>{profile ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself..."
                                className="bg-slate-950 border-white/10"
                                {...register('bio')}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="0123456789"
                                    className="bg-slate-950 border-white/10"
                                    {...register('phoneNumber')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sex">Sex</Label>
                                <Controller
                                    name="sex"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="bg-slate-950 border-white/10">
                                                <SelectValue placeholder="Select sex" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 text-white border-white/10">
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Street Name"
                                className="bg-slate-950 border-white/10"
                                {...register('address')}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="Vietnam"
                                    className="bg-slate-950 border-white/10"
                                    {...register('country')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    className="bg-slate-950 border-white/10"
                                    {...register('dateOfBirth')}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="bg-blue-600 hover:bg-blue-500"
                            >
                                {isCreating || isUpdating ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}
