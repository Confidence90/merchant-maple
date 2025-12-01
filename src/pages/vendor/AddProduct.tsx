// pages/AddProduct.tsx - CODE COMPLET CORRIGÉ
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, ShieldAlert, Store } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import VendorPermissionGuard from '@/components/VendorPermissionGuard';
import { useVendorPermission } from '@/hooks/useVendorPermission';

// Schéma de validation
const formSchema = z.object({
title: z.string().min(1, { message: "Le titre est requis" }),
description: z.string().min(1, { message: "La description est requise" }),
price: z.coerce.number().min(1, { message: "Le prix est requis" }),
quantity: z.coerce.number().min(1, { message: "La quantité doit être au moins 1" }),
type: z.enum(["sale", "rental"], { required_error: "Le type est requis" }),
condition: z.enum(["new", "used"], { required_error: "L'état est requis" }),
location: z.string().min(1, { message: "La localisation est requise" }),
category: z.string().min(1, { message: "La catégorie est requise" }),
is_featured: z.boolean().optional(),
images: z.any().refine((files) => files && files.length > 0, { 
message: "Ajoutez au moins une image." 
})
});

const categoryIcons = {
Electronique: '📱',
Véhicules: '🚗',
Immobilier: '🏠',
Mode: '👗',
'Sports & Loisirs': '⚽',
Enfants: '👶',
'Santé & Beauté': '💅',
Emplois: '💼',
Apprentissage: '🎓',
Service: '🤝',
Alimentation: '🍎',
Animaux: '🐾',
};

export default function AddProduct() {
const navigate = useNavigate();
const [selectedImages, setSelectedImages] = useState<string[]>([]);
const [previewImageIndex, setPreviewImageIndex] = useState(0);
const [isSubmitting, setIsSubmitting] = useState(false);
const [categories, setCategories] = useState<any[]>([]);
const { permission, checkPermission } = useVendorPermission();

const {
register,
handleSubmit,
formState: { errors },
reset,
setValue,
watch
} = useForm({
resolver: zodResolver(formSchema),
defaultValues: {
title: "",
description: "",
price: 0,
quantity: 1,
type: "sale",
condition: "new",
location: "",
category: "",
is_featured: false,
images: [],
},
});

useEffect(() => {
const fetchCategories = async () => {
try {
const response = await fetch('http://localhost:8000/api/categories');
const data = await response.json();
const cats = Array.isArray(data) ? data : data.results;
setCategories(cats || []);
} catch (error) {
console.error("Erreur lors du chargement des catégories", error);
setCategories([]);
}
};

fetchCategories();
}, []);

const suggestedCategories = [
{ name: "Électronique", icon: "📱" },
{ name: "Mobilier", icon: "🪑" },
{ name: "Vêtements", icon: "👕" },
{ name: "Livres", icon: "📚" },
{ name: "Sports", icon: "⚽" }
];

const onSubmit = async (data: any) => {
// Vérification finale des permissions avant soumission
const hasPermission = await checkPermission(true);
if (!hasPermission) {
return;
}

setIsSubmitting(true);
try {
const formData = new FormData();
// Ajouter les champs du formulaire
Object.entries(data).forEach(([key, value]) => {
if (key === "images") {
Array.from(value as FileList).forEach((file) => formData.append("images", file as Blob));
} else {
formData.append(key, String(value));
}
});

const token = localStorage.getItem("access_token");
const response = await fetch("http://localhost:8000/api/listings/listings/", {
method: 'POST',
headers: {
Authorization: token ? `Bearer ${token}` : '',
},
body: formData,
});

if (!response.ok) {
const errorData = await response.json();
// Gestion spécifique des erreurs de permission
if (response.status === 403) {
throw new Error("Accès refusé. Vérifiez votre statut vendeur.");
}
throw new Error(errorData.detail || errorData.error || "Erreur lors de la publication");
}

toast({
title: "Succès",
description: "Produit ajouté avec succès !",
});
reset();
setSelectedImages([]);
navigate('/products');
} catch (error: any) {
toast({
title: "Erreur",
description: error.message || "Impossible de publier le produit.",
variant: "destructive",
});
} finally {
setIsSubmitting(false);
}
};

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = Array.from(e.target.files || []);
setValue("images", files);
setSelectedImages(files.map(file => URL.createObjectURL(file)));
setPreviewImageIndex(0);
};

const formValues = watch();

// Fonction pour obtenir l'icône d'une catégorie
const getCategoryIcon = (categoryName: string) => {
return categoryIcons[categoryName as keyof typeof categoryIcons] || '';
};

// Fonction pour trouver le nom de la catégorie parente
const findParentCategoryName = (subcategoryId: string) => {
for (const category of categories) {
if (category.subcategories) {
const subcategory = category.subcategories.find((sub: any) => sub.id.toString() === subcategoryId);
if (subcategory) {
return category.name;
}
}
if (category.id.toString() === subcategoryId) {
return category.name;
}
}
return '';
};

// Bannière de statut vendeur
const StatusBanner = () => {
if (!permission) return null;

if (permission.can_create_listings) {
return (
<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
<ShieldAlert className="h-4 w-4 text-green-600" />
</div>
<div>
<h3 className="font-medium text-green-800">Statut vendeur vérifié</h3>
<p className="text-sm text-green-600">
Vous pouvez publier des annonces en tant que vendeur
</p>
</div>
</div>
</div>
);
}

return (
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
<Store className="h-4 w-4 text-yellow-600" />
</div>
<div>
<h3 className="font-medium text-yellow-800">Permission limitée</h3>
<p className="text-sm text-yellow-600">
{permission.reasons.join(', ')}
</p>
</div>
</div>
</div>
);
};

return (
<VendorPermissionGuard>
<div className="min-h-screen bg-slate-50">
{/* Contenu principal du formulaire */}
<div className="container mx-auto px-6 py-8">
<div className="flex flex-col lg:flex-row gap-8">
{/* Colonne de gauche - Formulaire */}
<div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
<div className="p-6">
<h1 className="text-3xl font-bold text-gray-900 mb-2">Publier votre annonce</h1>
<p className="text-gray-600 mb-6">
Remplissez les informations de votre produit pour le mettre en vente
</p>
{/* Bannière de statut */}
<StatusBanner />

{/* Étape 1 : Informations de base */}
<div className="mb-8">
<h3 className="text-lg font-bold mb-4">Étape 1 : Informations de base</h3>
<div className="space-y-5">
{/* Titre */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
<input
{...register("title")}
placeholder="Entrez le titre de l'annonce"
className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
/>
{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
</div>

{/* Description */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
<textarea
{...register("description")}
rows={4}
placeholder="Décrivez votre article en détail..."
className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
/>
{errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
</div>

{/* Prix, Quantité et Localisation */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
<input
type="number"
{...register("price")}
placeholder="1000000"
className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
/>
{errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
<input
type="number"
{...register("quantity")}
placeholder="1"
min="1"
className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
/>
{errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
<input
{...register("location")}
placeholder="Ex: Koulikoro, Bamako"
className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
/>
{errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
</div>
</div>

{/* Type et État */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
<select
{...register("type")}
className={`w-full px-4 py-3 rounded-xl border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
>
<option value="sale">À vendre</option>
<option value="rental">À louer</option>
</select>
{errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
<select
{...register("condition")}
className={`w-full px-4 py-3 rounded-xl border ${errors.condition ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
>
<option value="new">Neuf</option>
<option value="used">Occasion</option>
</select>
{errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>}
</div>
</div>

{/* Catégorie */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
<select
{...register("category")}
className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
>
<option value="">Sélectionnez une catégorie</option>
{categories.map(cat => (
cat.subcategories && cat.subcategories.length > 0 ? (
<optgroup key={cat.id} label={cat.name}>
{cat.subcategories.map((sub: any) => (
<option key={sub.id} value={sub.id.toString()}>
{getCategoryIcon(cat.name)} {sub.name}
</option>
))}
</optgroup>
) : (
<option key={cat.id} value={cat.id.toString()}>
{getCategoryIcon(cat.name)} {cat.name}
</option>
)
))}
</select>
{errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
</div>
</div>
</div>

{/* Catégories suggérées */}
<div className="mb-8">
<h3 className="text-lg font-bold mb-3">Catégories suggérées</h3>
<div className="flex flex-wrap gap-2">
{suggestedCategories.map((cat, index) => (
<button
key={index}
type="button"
onClick={() => {
// Trouver la catégorie correspondante dans les catégories récupérées
const matchingCategory = categories.find(c => 
c.name.toLowerCase().includes(cat.name.toLowerCase()) ||
cat.name.toLowerCase().includes(c.name.toLowerCase())
);
if (matchingCategory) {
setValue("category", matchingCategory.id.toString());
}
}}
className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm font-medium hover:bg-blue-100"
>
<span>{cat.icon}</span>
<span>{cat.name}</span>
</button>
))}
</div>
</div>

{/* Case à cocher "En vedette" */}
<div className="mb-8">
<label className="flex items-center gap-3">
<input
type="checkbox"
{...register("is_featured")}
className="w-5 h-5 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
/>
<span className="text-sm font-medium">Mettre cette annonce en avant</span>
</label>
</div>

{/* Téléchargement d'images */}
<div className="mb-8">
<h3 className="text-lg font-bold mb-3">Images *</h3>
<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
<input
type="file"
multiple
accept="image/*"
onChange={handleImageChange}
className="hidden"
id="image-upload"
/>
<label
htmlFor="image-upload"
className="cursor-pointer flex flex-col items-center justify-center gap-3"
>
<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
<Upload className="w-6 h-6 text-blue-600" />
</div>
<div>
<p className="font-medium">Glissez-déposez vos images ici</p>
<p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
</div>
<button
type="button"
className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100"
>
Télécharger
</button>
</label>
</div>
{errors.images && <p className="mt-2 text-sm text-red-600 text-center">{errors.images.message}</p>}

{/* Aperçu des images */}
{selectedImages.length > 0 && (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
    {selectedImages.map((src, index) => (
      <div
        key={index}
        className={`relative group cursor-pointer bg-gray-50 border rounded-lg flex items-center justify-center overflow-hidden ${
          previewImageIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={() => setPreviewImageIndex(index)}
      >
        <img
          src={src}
          alt={`Preview ${index}`}
          className="max-h-32 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            const newImages = [...selectedImages];
            newImages.splice(index, 1);
            setSelectedImages(newImages);
            if (previewImageIndex >= newImages.length) {
              setPreviewImageIndex(Math.max(0, newImages.length - 1));
            }
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
)}

</div>

{/* Bouton de soumission */}
<div className="flex justify-end">
<button
type="submit"
onClick={handleSubmit(onSubmit)}
disabled={isSubmitting || !permission?.can_create_listings}
className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
title={!permission?.can_create_listings ? "Permission vendeur requise" : ""}
>
{isSubmitting ? (
<span className="flex items-center gap-2">
<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
Publication...
</span>
) : (
"Publier l'annonce"
)}
</button>
</div>
</div>
</div>

{/* Colonne de droite - Aperçu */}
<div className="w-full lg:w-96 bg-white rounded-xl shadow-lg overflow-hidden h-fit sticky top-8">
<div className="p-6">
<h2 className="text-xl font-bold mb-4">Aperçu de l'annonce</h2>
<div className="space-y-4">
{/* Image d'aperçu */}
<div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
{selectedImages.length > 0 ? (
<img
  src={selectedImages[previewImageIndex]}
  alt="Preview"
  className="w-full h-full object-contain bg-white rounded-lg"
/>
) : (
<div className="w-full h-full flex items-center justify-center text-gray-400">
<Upload className="w-12 h-12" />
</div>
)}
</div>

{/* Contenu de l'aperçu */}
<div>
<h3 className="font-bold text-lg">
{formValues.title || "Titre de l'annonce"}
</h3>
<p className="text-gray-600 text-sm mt-1">
{formValues.location || "Localisation"}
</p>
<p className="text-gray-500 text-sm mt-2 line-clamp-2">
{formValues.description || "Description de l'annonce"}
</p>
<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
<span>📦 Quantité :</span>
<span className="font-medium">{formValues.quantity || 1}</span>
</div>

{/* Affichage de la catégorie avec icône */}
{formValues.category && (
<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
<span>📁 Catégorie :</span>
<span className="font-medium">
{getCategoryIcon(findParentCategoryName(formValues.category))} 
{categories.find(cat => 
cat.id.toString() === formValues.category || 
(cat.subcategories && cat.subcategories.some((sub: any) => sub.id.toString() === formValues.category))
)?.name || formValues.category}
</span>
</div>
)}

<div className="mt-3 flex justify-between items-center">
<span className="font-bold text-blue-600">
{formValues.price ? `${Number(formValues.price).toLocaleString()} FCFA` : "Prix"}
</span>
<div className="flex items-center gap-2">
<span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
{formValues.type === "rental" ? "À louer" : "À vendre"}
</span>
<span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-600">
{formValues.condition === "new" ? "Neuf" : "Occasion"}
</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</VendorPermissionGuard>
);
}
