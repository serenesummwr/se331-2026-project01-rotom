const STORAGE_KEY = 'catpassport.tokens'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

export const tokenStorage = {
  read(): StoredTokens | null {
    const stored = sessionStorage.getItem(STORAGE_KEY)

    if (!stored) return null

    try {
      const parsed: unknown = JSON.parse(stored)

      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('accessToken' in parsed) ||
        !('refreshToken' in parsed) ||
        typeof parsed.accessToken !== 'string' ||
        typeof parsed.refreshToken !== 'string' ||
        !parsed.accessToken ||
        !parsed.refreshToken
      ) {
        this.clear()
        return null
      }

      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      }
    } catch {
      this.clear()
      return null
    }
  },

  write(tokens: StoredTokens): void {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
    )
  },

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY)
  },
}