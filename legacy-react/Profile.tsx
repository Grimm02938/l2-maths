import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  Crown,
  GraduationCap,
  LockKeyhole,
  Mail,
  PenLine,
  Save,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UploadForm from '@/components/UploadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { userProfileService, type UserProfile } from '@/lib/firebase-database';

const ADMIN_UID = 'iw4t9QYWJgeWiCwKbiPTlyrSBlk2';

type ProfileDraft = Pick<UserProfile, 'displayName' | 'university' | 'fieldOfStudy'>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setProfile(null);
        setDraft(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await userProfileService.getOrCreateProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
        });

        setProfile(userProfile);
        setDraft({
          displayName: userProfile.displayName || '',
          university: userProfile.university || '',
          fieldOfStudy: userProfile.fieldOfStudy || '',
        });
      } catch (nextError) {
        console.error('Failed to fetch or create profile:', nextError);
        setError('Impossible de charger le profil.');
        setProfile(null);
        setDraft(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!profile || !draft) return;

    setSaving(true);
    setError(null);

    try {
      await userProfileService.updateProfile(profile.id, draft);
      setProfile({ ...profile, ...draft });
      setIsEditing(false);
    } catch (nextError) {
      console.error('Failed to update profile:', nextError);
      setError("Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setDraft({
        displayName: profile.displayName || '',
        university: profile.university || '',
        fieldOfStudy: profile.fieldOfStudy || '',
      });
    }

    setError(null);
    setIsEditing(false);
  };

  if (loading) return <ProfileSkeleton />;

  if (!user || !profile || !draft) {
    return (
      <main className="mx-auto flex min-h-[62vh] w-full max-w-md items-center px-4">
        <section className="w-full rounded-lg border border-border bg-card p-5 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Profil inaccessible</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error || 'Connecte-toi pour ouvrir ton profil.'}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-5 sm:py-8">
      <section className="space-y-5">
        <section className="neo-panel border border-border bg-card p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Informations</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tes infos visibles dans ton espace.</p>
            </div>

            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="neo-button-shape h-9 shrink-0"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <ProfileField
                id="displayName"
                label="Nom affiché"
                value={draft.displayName || ''}
                icon={<UserRound className="h-4 w-4" />}
                onChange={(value) => setDraft((current) => current && { ...current, displayName: value })}
              />
              <ProfileField
                id="university"
                label="Université"
                value={draft.university || ''}
                icon={<GraduationCap className="h-4 w-4" />}
                onChange={(value) => setDraft((current) => current && { ...current, university: value })}
              />
              <ProfileField
                id="fieldOfStudy"
                label="Parcours"
                value={draft.fieldOfStudy || ''}
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                onChange={(value) => setDraft((current) => current && { ...current, fieldOfStudy: value })}
              />

              {error && <p className="text-sm text-red-300">{error}</p>}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button type="button" variant="outline" onClick={handleCancel} className="neo-button-shape h-10">
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="neo-button-shape h-10 bg-foreground text-background hover:bg-foreground/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? '...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/80">
              <InfoRow
                icon={<GraduationCap className="h-4 w-4" />}
                label="Université"
                value={profile.university || 'Non renseignée'}
              />
              <InfoRow
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label="Parcours"
                value={profile.fieldOfStudy || 'Non renseigné'}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
              />
            </div>
          )}
        </section>

        {isAdmin && <AdminPanel />}
      </section>
    </main>
  );
}

function ProfileField({
  id,
  label,
  value,
  icon,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="neo-button-shape h-11 border-border bg-background/70 pl-10 text-base text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/25 sm:text-sm"
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="neo-icon flex h-9 w-9 shrink-0 items-center justify-center bg-background/55 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <section className="neo-panel border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="neo-icon flex h-9 w-9 shrink-0 items-center justify-center bg-background/55 text-muted-foreground">
          <Crown className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">Administration</h2>
          <p className="truncate text-sm text-muted-foreground">Publication de ressources</p>
        </div>
      </div>
      <UploadForm />
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-5 sm:py-8">
      <section className="space-y-5">
        <div className="neo-panel border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-full max-w-64" />
            </div>
          </div>
        </div>
        <div className="neo-panel border border-border bg-card p-4 sm:p-5">
          <Skeleton className="mb-5 h-6 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
        </div>
      </section>
    </main>
  );
}
