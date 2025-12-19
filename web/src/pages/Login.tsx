import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLogin } from "../api/mutations/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const loginMutation = useLogin();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    await loginMutation.mutateAsync({ email, password }, {
      onSuccess: (result) => {
        signin(result.id);
        navigate(from, { replace: true });
      },
      onError: (data) => {
        console.log(data)
        setError(data ? data.message : "Login failed. Please try again.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-text">Welcome back</h1>
        <p className="mb-6 text-muted">Sign in to your account to continue</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-card-muted px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-card-muted px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-accent px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-accent hover:opacity-90">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
