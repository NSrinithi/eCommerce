import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../../components/ui/Button.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

export function ProfilePage() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setName(user?.name || "");
    }, [user?.name]);

    async function submit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        const trimmedName = name.trim();

        if (trimmedName.length < 2) {
            setError("Name must contain at least 2 characters.");
            return;
        }

        if (trimmedName.length > 80) {
            setError("Name cannot exceed 80 characters.");
            return;
        }

        if (trimmedName === user?.name) {
            return;
        }

        setBusy(true);

        try {
            await updateProfile({
                name: trimmedName,
            });

            setMessage("Your profile has been updated successfully.");
        } catch (err) {
            setError(
                err?.message || "Unable to update your profile."
            );
        } finally {
            setBusy(false);
        }
    }

    const displayName = user?.name || "User";

    const avatarLetter = displayName
        .trim()
        .charAt(0)
        .toUpperCase();

    return (
        <main className="profile-page">

            {/* HEADER */}

            <div className="profile-header">
                <div>
                    <p className="profile-eyebrow">
                        ACCOUNT
                    </p>

                    <h1>My Profile</h1>

                    <p className="profile-subtitle">
                        Manage your personal information.
                    </p>
                </div>
            </div>


            {/* PROFILE CARD */}

            <section className="profile-card">

                {/* PROFILE INTRO */}

                <div className="profile-intro">

                    <div className="profile-avatar">
                        {avatarLetter}
                    </div>

                    <div>
                        <h2>{displayName}</h2>

                        <p>{user?.email}</p>
                    </div>

                </div>


                {/* DIVIDER */}

                <div className="profile-divider" />


                {/* FORM */}

                <form
                    className="profile-form"
                    onSubmit={submit}
                >

                    <div className="profile-form-header">

                        <div>
                            <h3>Personal Information</h3>

                            <p>
                                Update the information associated
                                with your account.
                            </p>
                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <Alert>
                            {error}
                        </Alert>
                    )}


                    {/* SUCCESS */}

                    {message && (
                        <Alert tone="success">
                            {message}
                        </Alert>
                    )}


                    {/* NAME */}

                    <div className="profile-field">

                        <label htmlFor="profile-name">
                            Full name
                        </label>

                        <input
                            id="profile-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter your full name"
                            minLength={2}
                            maxLength={80}
                            disabled={busy}
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="profile-field">

                        <label htmlFor="profile-email">
                            Email address
                        </label>

                        <input
                            id="profile-email"
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            className="profile-readonly"
                        />

                        <span className="profile-hint">
                            Your email address cannot be changed.
                        </span>

                    </div>


                    {/* SAVE */}

                    <div className="profile-actions">

                        <Button
                            type="submit"
                            busy={busy}
                            disabled={
                                busy ||
                                name.trim() === user?.name
                            }
                        >
                            Save Changes
                        </Button>

                    </div>

                </form>

            </section>

        </main>
    );
}