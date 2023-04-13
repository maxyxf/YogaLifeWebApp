import "../style/appLayout.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div>
        <p>Name: {user.name}</p>
      </div>
      <div>
        <img src={user.picture} width="70" alt="profile avatar" />
      </div>
      <div>
        <p>📧 Email: {user.email}</p>
      </div>
      <div>
        <p>🔑 Auth0Id: {user.sub}</p>
      </div>
      <div>
        <p>✅ Email verified: {user.email_verified?.toString()}</p>
      </div>
    </div>
  );
}
