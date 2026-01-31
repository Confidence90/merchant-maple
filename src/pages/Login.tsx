import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FaGithub, FaGoogle, FaSpinner, FaArrowRight, FaEye, FaEyeSlash, FaCheck, FaStore } from "react-icons/fa";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast: uiToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const rememberMeRef = useRef(rememberMe);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    country_code: "+223",
    phone: "",
    location: "",
    is_seller: false,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    password2: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    width: "0%",
    color: "bg-gray-200",
    requirements: {
      length: false,
      number: false,
      special: false,
      uppercase: false,
      lowercase: false,
    },
  });

  const [touched, setTouched] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSellerRegistration, setIsSellerRegistration] = useState(false);

  const CITY_CHOICES = [
    "Bamako", "Sikasso", "Kayes", "Mopti", "Ségou", "Gao", 
    "Tombouctou", "Kidal", "Koutiala", "San", "Kita", "Bougouni",
    "Nioro du Sahel", "Nara", "Banamba", "Kolondiéba", "Yorosso",
    "Bla", "Markala", "Bandiagara", "Diré", "Goundam", "Douentza",
    "Ténenkou", "Macina", "Niono", "Ké-Macina", "Sokolo", "Yélimané",
    "Diéma", "Kéniéba", "Bafoulabé", "Oussoubidiagna", "Kangaba",
    "Kati", "Koulikoro", "Ménaka", "Ansongo", "Bourèm", "Tessalit"
  ].sort();

  const validations = {
    first_name: {
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "Le prénom ne doit contenir que des lettres, espaces, tirets et apostrophes"
    },
    last_name: {
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes"
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Format d'email invalide"
    },
    phone: {
      pattern: /^\d+$/,
      message: "Le téléphone ne doit contenir que des chiffres"
    }
  };

  // Mettre à jour la référence rememberMe
  useEffect(() => {
    rememberMeRef.current = rememberMe;
  }, [rememberMe]);

  // Gestion de la connexion GitHub
  const handleLoginWithGithub = () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!githubClientId) {
      uiToast({
        title: "Erreur",
        description: "Configuration GitHub manquante",
        variant: "destructive",
      });
      return;
    }
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`
    );
  };

  // Gestion de la connexion Google
  const handleLoginWithGoogle = useCallback(async (response) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/google/login/", {
        id_token: response.credential,
      });
      
      if (res.status === 200) {
        const user = {
          id: res.data.id,
          email: res.data.email,
          names: res.data.full_name || `${res.data.first_name} ${res.data.last_name}`,
        };

        const storage = rememberMeRef.current ? localStorage : sessionStorage;

        storage.setItem("access_token", res.data.access || res.data.token);
        storage.setItem("refresh_token", res.data.refresh || "");
        storage.setItem("user", JSON.stringify(user));

        uiToast({
          title: "Connexion réussie",
          description: "Connexion avec Google réussie !",
        });
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }
    } catch (error) {
      uiToast({
        title: "Erreur",
        description: "Échec de la connexion avec Google",
        variant: "destructive",
      });
    }
  }, [navigate]);

  // Envoi du code GitHub au serveur
  const sendGithubCodeToServer = async () => {
    const code = searchParams.get("code");
    if (!code) return;

    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:8000/api/users/github-login/", { code });
      if (res.status === 200) {
        const storage = rememberMeRef.current ? localStorage : sessionStorage;
        
        storage.setItem("access_token", res.data.access || res.data.token);
        storage.setItem("refresh_token", res.data.refresh || "");
        storage.setItem(
          "user",
          JSON.stringify({
            id: res.data.id,
            email: res.data.email,
            names: res.data.full_name,
          })
        );
        
        uiToast({
          title: "Connexion réussie",
          description: "Connexion avec GitHub réussie !",
        });
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }
    } catch (error) {
      uiToast({
        title: "Erreur",
        description: "Échec de la connexion avec GitHub",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sendGithubCodeToServer();
  }, [searchParams]);

  // Initialisation Google Sign-In
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const win = window as any;
    if (win.google && clientId) {
      win.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleLoginWithGoogle,
      });
      win.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large", text: "signin", width: 190 }
      );
    }
  }, [handleLoginWithGoogle]);

  // Gestion de la connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      setFieldErrors({ general: "Veuillez patienter avant de réessayer" });
      return;
    }
    setLastRequestTime(now);

    const { email, password } = loginData;

    // Validation des champs
    if (!email || !password) {
      setFieldErrors({ general: "Veuillez remplir tous les champs obligatoires" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: "Email invalide" }));
      return;
    }

    if (password.length < 8) {
      setFieldErrors({ password: "Le mot de passe doit contenir au moins 8 caractères" });
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login/",
        loginData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const user = {
        id: res.data.id,
        email: res.data.email,
        full_name: res.data.full_name,
      };

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", res.data.access);
      storage.setItem("refresh_token", res.data.refresh);
      storage.setItem("user", JSON.stringify(user));

      uiToast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.errors) {
            setFieldErrors(data.errors);
          } else if (typeof data === "string" && data.includes("Email ou mot de passe incorrect")) {
            setFieldErrors({ general: "Email ou mot de passe incorrect" });
          } else if (data.password) {
            setFieldErrors((prev) => ({ ...prev, password: data.password }));
          } else if (data.message) {
            setFieldErrors({ general: data.message });
          } else {
            setFieldErrors({ general: "Identifiants incorrects" });
          }
        } else if (status === 401) {
          setFieldErrors({ general: "Email ou mot de passe incorrect" });
        } else if (status === 403) {
          setFieldErrors({ general: "Compte non activé. Vérifiez vos emails." });
        } else if (status === 429) {
          setFieldErrors({ general: "Trop de tentatives. Veuillez patienter." });
        } else {
          setFieldErrors({ general: "Une erreur est survenue lors de la connexion." });
        }
      } else if (error.request) {
        setFieldErrors({ general: "Le serveur ne répond pas. Veuillez réessayer plus tard." });
      } else {
        setFieldErrors({ general: "Une erreur inattendue est survenue" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'inscription
  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSeller = e.target.checked;
    setSignupData(prev => ({ ...prev, is_seller: isSeller }));
    setIsSellerRegistration(isSeller);
    
    if (isSeller) {
      uiToast({
        title: "Information",
        description: "Vous allez être redirigé vers la configuration vendeur après inscription",
      });
    }
  };

  const validateField = (name: string, value: string) => {
    if (!validations[name as keyof typeof validations]) return null;
    
    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        return "Seuls les chiffres sont autorisés";
      }
      if (value && value.length < 8) {
        return "Le numéro doit contenir au moins 8 chiffres";
      }
      return null;
    }

    if (name === "email") {
      if (value && !validations.email.pattern.test(value)) {
        return "Format d'email invalide (ex: exemple@domaine.com)";
      }
      return null;
    }

    const validation = validations[name as keyof typeof validations];
    if (value && !validation.pattern.test(value)) {
      return validation.message;
    }
    return null;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let fieldValue = value;
    if (name === "phone") {
      fieldValue = value.replace(/\D/g, "");
    }
    
    if (name === "first_name" || name === "last_name") {
      fieldValue = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    }

    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : fieldValue;
    
    if (name !== "is_seller") {
      setSignupData((prev) => ({ ...prev, [name]: finalValue }));
    }

    const error = validateField(name, finalValue as string);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }

    if (name === "password") {
      checkPasswordStrength(finalValue as string);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    };

    Object.values(requirements).forEach(req => {
      if (req) strength += 20;
    });

    let color;
    if (strength <= 20) color = "bg-red-500";
    else if (strength <= 40) color = "bg-orange-500";
    else if (strength <= 60) color = "bg-yellow-500";
    else if (strength <= 80) color = "bg-blue-500";
    else color = "bg-green-500";

    setPasswordStrength({ width: `${strength}%`, color, requirements });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validateSignupForm = () => {
    const errors: any = {};
    
    if (!signupData.first_name.trim()) errors.first_name = "Le prénom est obligatoire";
    else if (validateField("first_name", signupData.first_name)) errors.first_name = validateField("first_name", signupData.first_name);
    
    if (!signupData.last_name.trim()) errors.last_name = "Le nom est obligatoire";
    else if (validateField("last_name", signupData.last_name)) errors.last_name = validateField("last_name", signupData.last_name);
    
    if (!signupData.email.trim()) errors.email = "L'email est obligatoire";
    else if (validateField("email", signupData.email)) errors.email = validateField("email", signupData.email);
    
    if (!signupData.phone.trim()) errors.phone = "Le téléphone est obligatoire";
    else if (validateField("phone", signupData.phone)) errors.phone = validateField("phone", signupData.phone);
    else if (signupData.phone.length < 8) errors.phone = "Le numéro doit contenir au moins 8 chiffres";
    
    if (!signupData.password) errors.password = "Le mot de passe est obligatoire";
    else if (signupData.password.length < 8) errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    
    if (!signupData.password2) errors.password2 = "Veuillez confirmer le mot de passe";
    else if (signupData.password !== signupData.password2) errors.password2 = "Les mots de passe ne correspondent pas";

    if (!signupData.location) errors.location = "Veuillez sélectionner votre ville";

    return errors;
  };

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/users/check-email/",
      { email: email.toLowerCase() }
    );
    return response.data.exists;
  } catch (error) {
    return false;
  }
};

 const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!termsAccepted) {
    uiToast({
      title: "Erreur",
      description: "Veuillez accepter les conditions générales",
      variant: "destructive",
    });
    return;
  }

  const formErrors = validateSignupForm();
  if (Object.keys(formErrors).length > 0) {
    setFieldErrors(formErrors);
    uiToast({
      title: "Erreur",
      description: "Veuillez corriger les erreurs dans le formulaire",
      variant: "destructive",
    });
    return;
  }
  const emailExists = await checkEmailExists(signupData.email);
  if (emailExists) {
    uiToast({
      title: "Email déjà utilisé",
      description: "Cet email est déjà associé à un compte. Essayez de vous connecter.",
      variant: "destructive",
    });
    return;
  }


  setLoading(true);

  try {
    const payload = {
      first_name: signupData.first_name.trim(),
      last_name: signupData.last_name.trim(),
      email: signupData.email.trim().toLowerCase(), // 🔥 Normaliser l'email
      password: signupData.password,
      password2: signupData.password2,
      country_code: signupData.country_code,
      phone: signupData.phone.trim(),
      location: signupData.location?.trim() || "",
      is_seller: signupData.is_seller, // 🔥 CORRECTION : is_seller, pas is_seller_pending
    };

    console.log("Données envoyées au serveur:", payload); // 🔥 Log de débogage

    const response = await axios.post(
      "http://localhost:8000/api/users/register/",
      payload,
      {
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        withCredentials: false,
      }
    );

    console.log("Réponse du serveur:", response.data); // 🔥 Log de débogage

    localStorage.setItem("registrationEmail", signupData.email);
    
    if (signupData.is_seller) {
      localStorage.setItem("is_seller_registration", "true");
      localStorage.setItem("pending_seller_data", JSON.stringify({
        first_name: signupData.first_name.trim(),
        last_name: signupData.last_name.trim(),
        email: signupData.email.trim().toLowerCase(),
        phone: signupData.phone.trim(),
        location: signupData.location.trim(),
      }));

      navigate(`/verify-email?email=${encodeURIComponent(signupData.email)}&type=seller`);
      uiToast({
        title: "Succès",
        description: "Code OTP envoyé! Validez votre email pour configurer votre boutique",
      });
    } else {
      navigate(`/verify-email?email=${encodeURIComponent(signupData.email)}`);
      uiToast({
        title: "Succès",
        description: response.data.message || "Compte créé avec succès",
      });
    }
  } catch (error: any) {
    console.error("Erreur d'inscription:", error.response?.data); // 🔥 Log de débogage
    
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Une erreur est survenue lors de la création du compte";
    
    // Gestion spécifique des erreurs
    if (error.response?.data?.errors?.email) {
      uiToast({
        title: "Email déjà utilisé",
        description: "Cet email est déjà associé à un compte. Essayez de vous connecter ou utilisez un autre email.",
        variant: "destructive",
      });
    } else {
      uiToast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    if (error.response?.data?.errors) {
      setFieldErrors(error.response.data.errors);
    }
  } finally {
    setLoading(false);
  }
};

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Espace Vendeur</CardTitle>
          <CardDescription>Connectez-vous ou créez votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {fieldErrors.general && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {fieldErrors.general}
                </div>
              )}

              <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded text-center">
                Mode : {rememberMe ? "Session persistante" : "Session temporaire"}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={fieldErrors.email ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={fieldErrors.password ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={loading || isLoading}>
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleLoginWithGithub}
                  type="button"
                  disabled={isLoading}
                  className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <FaGithub className="text-gray-800 mr-2" />
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </button>
                <div id="signInDiv" className="flex items-center justify-center" />
              </div>
            </TabsContent>

            <TabsContent value="signup">
              {isSellerRegistration && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center">
                  <FaStore className="mr-2 text-blue-600" />
                  <span className="text-sm font-medium">
                    Inscription vendeur - Vous serez redirigé vers la configuration de votre boutique
                  </span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="first_name"
                      placeholder="Prénom"
                      value={signupData.first_name}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={fieldErrors.first_name ? "border-red-500" : ""}
                      required
                    />
                    {fieldErrors.first_name && <p className="text-red-500 text-sm">{fieldErrors.first_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="last_name"
                      placeholder="Nom"
                      value={signupData.last_name}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={fieldErrors.last_name ? "border-red-500" : ""}
                      required
                    />
                    {fieldErrors.last_name && <p className="text-red-500 text-sm">{fieldErrors.last_name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={fieldErrors.email ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country_code">Indicatif</Label>
                    <select
                      id="country_code"
                      name="country_code"
                      value={signupData.country_code}
                      onChange={handleSignupChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="+223">Mali (+223)</option>
                      <option value="+221">Sénégal (+221)</option>
                      <option value="+226">Burkina Faso (+226)</option>
                      <option value="+225">Côte d'Ivoire (+225)</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="77777777"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={fieldErrors.phone ? "border-red-500" : ""}
                      required
                    />
                    {fieldErrors.phone && <p className="text-red-500 text-sm">{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation (Ville)</Label>
                  <select
                    id="location"
                    name="location"
                    value={signupData.location}
                    onChange={handleSignupChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  >
                    <option value="">Sélectionnez une ville</option>
                    {CITY_CHOICES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.location && <p className="text-red-500 text-sm">{fieldErrors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword.password ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={fieldErrors.password ? "border-red-500" : ""}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
                  
                  {signupData.password && (
                    <div className="mt-2">
                      <div className="flex mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} 
                            style={{ width: passwordStrength.width }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 grid grid-cols-2 gap-1">
                        <span className="inline-flex items-center">
                          {passwordStrength.requirements.length ? (
                            <FaCheck className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                          )}
                          8+ caractères
                        </span>
                        <span className="inline-flex items-center">
                          {passwordStrength.requirements.number ? (
                            <FaCheck className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                          )}
                          Chiffre
                        </span>
                        <span className="inline-flex items-center">
                          {passwordStrength.requirements.special ? (
                            <FaCheck className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                          )}
                          Caractère spécial
                        </span>
                        <span className="inline-flex items-center">
                          {passwordStrength.requirements.uppercase ? (
                            <FaCheck className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                          )}
                          Majuscule
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword.password2 ? "text" : "password"}
                      name="password2"
                      placeholder="••••••••"
                      value={signupData.password2}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={
                        fieldErrors.password2 
                          ? "border-red-500" 
                          : signupData.password2 && signupData.password === signupData.password2 
                            ? "border-green-500" 
                            : ""
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-10 top-3 text-gray-500 hover:text-gray-700 transition"
                      onClick={() => togglePasswordVisibility("password2")}
                    >
                      {showPassword.password2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {signupData.password2 && signupData.password === signupData.password2 && !fieldErrors.password2 && (
                        <FaCheck className="text-green-500" />
                      )}
                    </div>
                  </div>
                  {fieldErrors.password2 && <p className="text-red-500 text-sm">{fieldErrors.password2}</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700">
                        J'accepte les conditions générales et la politique de confidentialité
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="is_seller"
                        checked={signupData.is_seller}
                        onChange={handleSellerChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_seller" className="text-gray-700">
                        Je souhaite m'inscrire en tant que vendeur
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Création du compte...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}