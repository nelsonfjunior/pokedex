"use client"

import { useState } from "react"
import api from "../services/server"

type Props = {
  id: number
  onDescriptionUpdate: (description: string) => void
}

export default function GenerateDescriptionButton({ id, onDescriptionUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post(`/generate-description/${id}`)
      if (res.data?.updatedPokemon?.description) {
        onDescriptionUpdate(res.data.updatedPokemon.description)
        return
      }

      if (res.status === 202 || res.data?.message) {
        setError("Descrição ainda não pronta. Tente novamente em alguns instantes.")
        return
      }

      if (res.data?.n8nResponse?.description) {
        onDescriptionUpdate(res.data.n8nResponse.description)
        return
      }
    } catch (err: any) {
      console.error("Erro ao gerar descrição:", err)
      setError(err?.response?.data?.error || err?.message || "Erro ao gerar descrição.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {isLoading && <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse" />}
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando...
            </>
          ) : (
            <>✨ Gerar descrição com IA</>
          )}
        </span>
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
