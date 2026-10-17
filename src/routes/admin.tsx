import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '../supabase'

// 1. Déclaration de la route pour TanStack Router
export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

interface Product {
  id: string | number
  name: string
  price: number
  image_url: string
  description: string
  category: string
  stock?: number
}

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // États pour les produits
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  // Formulaire d'ajout de produit
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Savons')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('10')

  // Charger la liste des produits
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products') // Remplacez par 'produits' si votre table s'appelle ainsi
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Ajouter un produit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('products').insert([
      {
        name,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
        description,
        stock: parseInt(stock) || 0,
      },
    ])

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message)
    } else {
      alert('Produit ajouté avec succès !')
      setName('')
      setPrice('')
      setImageUrl('')
      setDescription('')
      setStock('10')
      fetchProducts()
    }
  }

  // Supprimer un produit
  const handleDeleteProduct = async (id: string | number) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) fetchProducts()
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* BARRE DE NAVIGATION LATÉRALE (SIDEBAR) */}
      <aside style={{ width: '260px', background: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '0 0 10px 0' }}>CDSI Admin</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={buttonTabStyle(activeTab === 'dashboard')}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab('commandes')} style={buttonTabStyle(activeTab === 'commandes')}>
            📦 Commandes
          </button>
          <button onClick={() => setActiveTab('produits')} style={buttonTabStyle(activeTab === 'produits')}>
            🛍️ Produits & Stock
          </button>
          <button onClick={() => setActiveTab('ajouter')} style={buttonTabStyle(activeTab === 'ajouter')}>
            ➕ Ajouter un produit
          </button>
          <button onClick={() => setActiveTab('clients')} style={buttonTabStyle(activeTab === 'clients')}>
            👥 Clients
          </button>
          <button onClick={() => setActiveTab('statistiques')} style={buttonTabStyle(activeTab === 'statistiques')}>
            📈 Statistiques
          </button>
          <button onClick={() => setActiveTab('promotions')} style={buttonTabStyle(activeTab === 'promotions')}>
            🏷️ Promotions
          </button>
          <button onClick={() => setActiveTab('livraisons')} style={buttonTabStyle(activeTab === 'livraisons')}>
            🛵 Livraisons
          </button>
          <button onClick={() => setActiveTab('parametres')} style={buttonTabStyle(activeTab === 'parametres')}>
            ⚙️ Paramètres
          </button>
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main style={{ flex: 1, background: '#f8fafc', padding: '30px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1>Tableau de bord</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <Card title="Chiffre d'Affaires" value="0 FCFA" color="#10b981" />
              <Card title="Commandes du jour" value="0" color="#3b82f6" />
              <Card title="À préparer" value="0" color="#f59e0b" />
              <Card title="Livrées" value="0" color="#6366f1" />
              <Card title="Total Clients" value="0" color="#8b5cf6" />
              <Card title="Alerte Stock Faible" value="0" color="#ef4444" />
            </div>
          </div>
        )}

        {activeTab === 'commandes' && (
          <div>
            <h1>Gestion des Commandes</h1>
            <p>Aucune commande enregistrée pour le moment.</p>
          </div>
        )}

        {activeTab === 'produits' && (
          <div>
            <h1>Catalogue & Stocks ({products.length})</h1>
            {loading ? (
              <p>Chargement...</p>
            ) : products.length === 0 ? (
              <p>Aucun produit en base.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                {products.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                      <div>
                        <strong>{p.name}</strong> — {p.price} FCFA <br />
                        <small style={{ color: '#64748b' }}>Catégorie : {p.category} | Stock : {p.stock ?? 'N/C'}</small>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Supprimer</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ajouter' && (
          <div style={{ maxWidth: '600px', background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h1>Ajouter un nouveau produit</h1>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Catégorie :
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Savons">Savons</option>
                  <option value="Boutique SAK">Boutique SAK</option>
                  <option value="Autre">Autre</option>
                </select>
              </label>

              <input type="text" placeholder="Nom du produit" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Prix (ex: 2500)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Quantité en stock" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Lien de la photo (URL ou images/...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <textarea placeholder="Description du produit" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }} />

              <button type="submit" style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Ajouter le produit
              </button>
            </form>
          </div>
        )}

        {activeTab === 'clients' && <div><h1>Gestion des Clients</h1></div>}
        {activeTab === 'statistiques' && <div><h1>Statistiques de vente</h1></div>}
        {activeTab === 'promotions' && <div><h1>Codes promo & Remises</h1></div>}
        {activeTab === 'livraisons' && <div><h1>Options & Frais de livraison</h1></div>}
        {activeTab === 'parametres' && <div><h1>Paramètres du site</h1></div>}
      </main>
    </div>
  )
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', borderLeft: `5px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#64748b' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
    </div>
  )
}

function buttonTabStyle(isActive: boolean) {
  return {
    textAlign: 'left' as const,
    padding: '10px 15px',
    background: isActive ? '#334155' : 'transparent',
    color: isActive ? '#38bdf8' : '#cbd5e1',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
  }
}

// 2. Exportation par défaut sur sa propre ligne tout en bas
export default AdminPage
