"use client"

import { useState, useEffect } from "react"
import type { IPokemon } from "../interfaces/Pokemon"
import api from "../services/server"
import DescriptionButton from "./DescriptionButton"

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<IPokemon[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchPokemons = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/", { params: { page } })
      const { pokemons: newPokemons, totalPages, currentPage } = response.data

      setPokemons((prev) => [...prev, ...newPokemons])
      setHasMore(currentPage < totalPages)
    } catch (error) {
      console.error("Erro ao buscar Pokémons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemons()
  }, [page])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pokédex</h1>
          <p className="text-gray-600">Descubra o mundo dos Pokémons</p>
        </div>

        {pokemons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-shadow duration-200"
              >
                <div className="mb-4">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </div>

                <h2 className="text-xl font-semibold capitalize text-gray-800 mb-2">{pokemon.name}</h2>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full capitalize">
                    {pokemon.types}
                  </span>
                </div>

                <div className="mb-4 min-h-[60px] flex items-center justify-center">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pokemon.description || "Sem descrição disponível"}
                  </p>
                </div>

                {!pokemon.description && (
                  <DescriptionButton
                    id={pokemon.id}
                    onDescriptionUpdate={(description) => {
                      setPokemons((prev) => prev.map((p) => (p.id === pokemon.id ? { ...p, description } : p)))
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mb-4"></div>
            <p className="text-gray-600">Carregando Pokémons...</p>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center my-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Carregar Mais Pokémons
            </button>
          </div>
        )}

        {!hasMore && !isLoading && (
          <div className="text-center my-8">
            <p className="text-gray-600">Todos os Pokémons foram carregados!</p>
          </div>
        )}
      </div>
    </div>
  )
}
