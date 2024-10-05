export interface Movie {
    title: string
    release_date: string
    vote_average: number
    editors: string[]
}

export interface DiscoverMovieResponse {
    page: number
    results: DiscoverMovie[]
    total_results: number
    total_pages: number
}

export interface DiscoverMovie {
    id: number
    title: string
    release_date: string
    vote_average: number
}

export interface CreditsResponse {
    id: number
    cast: CastMember[]
    crew: CrewMember[]
}

export interface CastMember {
    cast_id: number
    character: string
    credit_id: string
    gender: number | null
    id: number
    name: string
    order: number
    profile_path: string | null
}

export interface CrewMember {
    credit_id: string
    department: string
    gender: number | null
    id: number
    known_for_department: string
    name: string
    profile_path: string | null
}
