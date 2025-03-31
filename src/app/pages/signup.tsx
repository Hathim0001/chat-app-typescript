import { useState } from "react";
import supabase from "../utils/supabaseClient";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        const { data: { user, session }, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            console.log("User signed up:", user, session);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignup}>Sign Up</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}