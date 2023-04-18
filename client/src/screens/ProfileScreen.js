import "../style/appLayout.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function Profile() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] =
    useState(true);

  const { user, isLoading } = useAuth0();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-semibold leading-7 text-black ml-60">
            Personal Information
          </h2>
        </div>
        <form className="md:col-span-2 ml-10 mt-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                src={user.picture}
                alt=""
                className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-base font-medium leading-6 text-black"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="text-gray-900">{user.name}</div>
              </div>
            </div>

            <div className="col-span-full mt-3">
              <label
                htmlFor="email"
                className="block text-base font-medium leading-6 text-black"
              >
                Email address
              </label>
              <div className="mt-2">
                <div className="text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="username"
                className="block text-base font-medium leading-6 text-black"
              >
                Email Verified
              </label>
              <div className="mt-2">
                <div className="text-gray-900">
                  {user.email_verified?.toString()}
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="username"
                className="block text-base font-medium leading-6 text-black"
              >
                Auth0Id
              </label>
              <div className="mt-2">
                <div className="text-gray-900">{user.sub}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
