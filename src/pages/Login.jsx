import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function InputField({ label, type, value, onChange, error, placeholder, icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base select-none">
          {icon}
        </span>
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-${isPassword ? "10" : "4"} py-3 rounded-xl border text-sm transition-all bg-gray-50 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
              : "border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900"
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
          >
            {show ? "👁️" : "👁️"}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
}

export default function Login({ setPage }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fields, setFields] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => {
    setFields(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const e = {};
    if (mode === "register" && !fields.name.trim()) e.name = "Le nom est requis.";
    if (!fields.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide.";
    if (fields.password.length < 6) e.password = "Minimum 6 caractères.";
    if (mode === "register" && fields.password !== fields.confirm) e.confirm = "Les mots de passe ne correspondent pas.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // nice UX delay

    let result;
    if (mode === "login") {
      result = login(fields.email, fields.password);
    } else {
      result = register(fields.name, fields.email, fields.password);
    }

    setLoading(false);
    if (!result.success) {
      setGlobalError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setPage("home"), 1200);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setGlobalError("");
    setFields({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 fade-in">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Header gradient */}
          <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-8 pt-8 pb-10 relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
            <button
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-primary-200 hover:text-white text-sm mb-6 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Retour à la boutique
            </button>
            <div className="flex items-center gap-1 mb-3">
              <span className="font-display text-3xl font-black text-white">Nova</span>
              <span className="font-display text-3xl font-black text-gold-400">Mart</span>
            </div>
            <p className="text-primary-200 text-sm">
              {mode === "login"
                ? "Bienvenue ! Connectez-vous pour continuer."
                : "Créez votre compte et commencez à explorer."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            {["login", "register"].map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors relative ${
                  mode === m
                    ? "text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {m === "login" ? " Connexion" : " Inscription"}
                {mode === m && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-8 py-7 space-y-5">

            {success ? (
              <div className="text-center py-6 fade-in">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {mode === "login" ? "Connexion réussie !" : "Compte créé !"}
                </h3>
                <p className="text-gray-400 text-sm">Redirection en cours...</p>
              </div>
            ) : (
              <>
                {globalError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    <span></span> {globalError}
                  </div>
                )}

                {mode === "register" && (
                  <InputField
                    label="Nom complet"
                    type="text"
                    value={fields.name}
                    onChange={e => set("name", e.target.value)}
                    error={errors.name}
                    placeholder="Votre nom"
                    
                  />
                )}

                <InputField
                  label="Adresse email"
                  type="email"
                  value={fields.email}
                  onChange={e => set("email", e.target.value)}
                  error={errors.email}
                  placeholder="email@exemple.com"
                  
                />

                <InputField
                  label="Mot de passe"
                  type="password"
                  value={fields.password}
                  onChange={e => set("password", e.target.value)}
                  error={errors.password}
                  placeholder={mode === "register" ? "Minimum 6 caractères" : "Votre mot de passe"}
                 
                />

                {mode === "register" && (
                  <InputField
                    label="Confirmer le mot de passe"
                    type="password"
                    value={fields.confirm}
                    onChange={e => set("confirm", e.target.value)}
                    error={errors.confirm}
                    placeholder="Répétez le mot de passe"
                    
                  />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-primary-900"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    mode === "login" ? "Se connecter →" : "Créer mon compte →"
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
                  <button
                    onClick={() => switchMode(mode === "login" ? "register" : "login")}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  >
                    {mode === "login" ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <span>🔒</span> Connexion sécurisée · NovaMart DZ
        </p>
      </div>
    </main>
  );
}