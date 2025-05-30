'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MedicineInfo from '@/components/MedicineInfo'
import ChatInterface from '@/components/ChatInterface'
import { Search, Clock } from 'lucide-react'

interface Medicine {
  id: string; // or number, depending on your data structure
  name: string;
  genericName?: string; // Make this optional if it may not always be present
  description: string; // Add this property
  indications: string; // Add this property
  warnings: string; // Add this property
  dosage: string; // Add this property
  // Add other properties as needed
}

const MAX_RECENT_SEARCHES = 5

export default function Home() {
  const [query, setQuery] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('recentMedicineSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const addToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)]
      .slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(updated)
    localStorage.setItem('recentMedicineSearches', JSON.stringify(updated))
  }

  const searchMedicines = async (searchQuery: string) => {
    setIsSearching(true)
    setError('')
    try {
      const res = await fetch(`/api/medicine?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()

      if (res.ok) {
        setMedicines(data)
        addToRecentSearches(searchQuery)
      } else {
        throw new Error(data.error || 'Error searching for medicines')
      }
    } catch (err) {
      console.error('Error searching medicines:', err)
      setError(err instanceof Error ? err.message : 'Error searching for medicines')
      setMedicines([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-lg text-primary font-medium tracking-wider mb-2">
            MEDICAL ASSISTANT
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Medicine Search and Chat
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search for medicines, view detailed information, and get instant answers to your questions.
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 border-secondary/50 bg-black text-white dark:bg-card dark:text-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Search for a Medicine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Enter medicine name" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12"
                />
              </div>
              <Button 
                onClick={() => searchMedicines(query)} 
                disabled={isSearching}
                className="bg-primary hover:bg-primary/90 text-white dark:text-black"
              >
                {isSearching ? (
                  'Searching...'
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <p className="text-red-400 mt-3 font-medium">{error}</p>
            )}
            
            {recentSearches.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 text-white/70 mb-3">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm font-medium">Recent searches:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setQuery(search)
                        searchMedicines(search)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Results */}
          <Card className="border-secondary/50 bg-black text-white dark:bg-card dark:text-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {medicines.length > 0 ? (
                <ul className="space-y-2">
                  {medicines.map((medicine, index) => (
                    <li 
                      key={medicine.id || index} 
                      className="cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors"
                      onClick={() => setSelectedMedicine(medicine)}
                    >
                      <div className="font-medium">{medicine.name}</div>
                      {medicine.genericName && (
                        <div className="text-sm text-white/70 dark:text-gray-400">
                          {medicine.genericName}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/70 dark:text-gray-400">
                  No medicines found. Try searching for a medicine.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Medicine Info and Chat */}
          <Card className="border-secondary/50 bg-black text-white dark:bg-card dark:text-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Medicine Information and Chat</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMedicine ? (
                <>
                  <MedicineInfo medicine={selectedMedicine} />
                  <ChatInterface medicine={selectedMedicine} />
                </>
              ) : (
                <p className="text-white/70 dark:text-gray-400">
                  Select a medicine to view information and chat.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}