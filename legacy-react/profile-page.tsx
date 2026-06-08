import { useEffect, useState } from 'react';
import { useAuth } from '../providers/auth-provider';
import { userProfileService, UserProfile } from '../lib/firebase-database';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';
import { User, Edit3, University, BookOpen } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [university, setUniversity] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userProfile = await userProfileService.getOrCreateProfile(user.uid, { 
            email: user.email, 
            displayName: user.displayName 
          });
          setProfile(userProfile);
          setDisplayName(userProfile.displayName);
          setUniversity(userProfile.university || '');
          setFieldOfStudy(userProfile.fieldOfStudy || '');
        } catch (error) {
          toast.error("Erreur lors de la récupération du profil.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>> = {
        displayName,
        university,
        fieldOfStudy,
      };

      try {
        await userProfileService.updateProfile(user.uid, updates);
        toast.success('Profil mis à jour avec succès !');
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du profil.');
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100">Mon Compte</h1>

        {isLoading ? (
          <div className="text-center text-gray-400">Chargement du profil...</div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Colonne de la carte de profil */}
            <div className="md:col-span-1">
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`}
                      alt="Avatar" 
                      className="rounded-full border-4 border-gray-600 shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-2xl text-white">{profile.displayName}</CardTitle>
                  <p className="text-gray-400">{profile.email}</p>
                </CardHeader>
              </Card>
            </div>

            {/* Colonne du formulaire */}
            <div className="md:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Informations du profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       <Input 
                        id="displayName"
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-primary"
                      />
                    </div>
                    <div className="relative">
                       <University className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       <Input 
                        id="university"
                        type="text" 
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="Université (ex: Université de Paris)"
                        className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-primary"
                      />
                    </div>
                    <div className="relative">
                       <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       <Input 
                        id="fieldOfStudy"
                        type="text" 
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        placeholder="Filière (ex: L2 Mathématiques)"
                        className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-primary"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                      <Edit3 className="mr-2 h-4 w-4"/>
                      Sauvegarder les modifications
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Impossible de charger le profil. Veuillez vous reconnecter.</div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
