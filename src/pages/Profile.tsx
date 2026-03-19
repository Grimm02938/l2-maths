import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UploadForm from '@/components/UploadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Briefcase, GraduationCap, Mail, User } from 'lucide-react';
import { userProfileService, UserProfile } from '@/lib/firebase-database';
import { Skeleton } from "@/components/ui/skeleton";


const ADMIN_UID = 'iw4t9QYWJgeWiCwKbiPTlyrSBlk2';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAdmin = user && user.uid === ADMIN_UID;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (user) {
        try {
          const userProfile = await userProfileService.getOrCreateProfile(user.uid, {
            email: user.email,
            displayName: user.displayName,
          });
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch or create profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    if (profile) {
      await userProfileService.updateProfile(profile.id, {
        displayName: profile.displayName,
        university: profile.university,
        fieldOfStudy: profile.fieldOfStudy,
      });
      setIsEditing(false);
    }
  };

  const getInitials = (email: string) => {
    const parts = email.split('@')[0];
    return parts.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user || !profile) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md p-8 text-center">
                <CardTitle>Profil introuvable</CardTitle>
                <CardDescription>
                { !user ? "Veuillez vous connecter pour voir votre profil." : "Impossible de charger votre profil. Veuillez actualiser la page."}
                </CardDescription>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <UserProfileCard 
        user={user} 
        profile={profile} 
        setProfile={setProfile}
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
        handleUpdate={handleUpdate}
        getInitials={getInitials}
      />
      
      {isAdmin && <AdminPanel />}
    </div>
  );
};

// Main Profile Card Component
const UserProfileCard = ({ user, profile, setProfile, isEditing, setIsEditing, handleUpdate, getInitials }) => {
    return (
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Mon Profil</CardTitle>
                <CardDescription>Consultez et modifiez vos informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                        <AvatarFallback className="text-2xl">{getInitials(user.email || 'U')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-xl font-semibold">{profile.displayName}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                </div>
                <Separator />
                {isEditing ? (
                    <EditProfileForm profile={profile} setProfile={setProfile} handleUpdate={handleUpdate} setIsEditing={setIsEditing} />
                ) : (
                    <DisplayProfileInfo profile={profile} setIsEditing={setIsEditing} />
                )}
            </CardContent>
        </Card>
    );
}

// Component to Display Profile Information
const DisplayProfileInfo = ({ profile, setIsEditing }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />} label="Université" value={profile.university || 'Non spécifiée'} />
            <InfoItem icon={<Briefcase className="h-5 w-5 text-muted-foreground" />} label="Niveau d'études" value={profile.fieldOfStudy || 'Non spécifié'} />
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
        </div>
    </div>
);


// Component to Edit Profile Information
const EditProfileForm = ({ profile, setProfile, handleUpdate, setIsEditing }) => (
    <div className="space-y-4">
        <div>
            <Label htmlFor="displayName">Nom d'utilisateur</Label>
            <Input id="displayName" value={profile.displayName || ''} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} />
        </div>
        <div>
            <Label htmlFor="university">Université</Label>
            <Input id="university" value={profile.university || ''} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
        </div>
        <div>
            <Label htmlFor="fieldOfStudy">Niveau d'études</Label>
            <Input id="fieldOfStudy" value={profile.fieldOfStudy || ''} onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })} />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            <Button onClick={handleUpdate}>Enregistrer</Button>
        </div>
    </div>
);


// Reusable Info Item
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        {icon}
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);


// Admin Panel Component
const AdminPanel = () => (
    <Card className="border-red-500 border-2 bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Panneau d'Administration</CardTitle>
            <CardDescription>Cette section est réservée à l'administrateur du site.</CardDescription>
        </CardHeader>
        <CardContent>
            <UploadForm />
        </CardContent>
    </Card>
);

// Skeleton loader for the profile page
const ProfileSkeleton = () => (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-8 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-8 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                         <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default ProfilePage;
